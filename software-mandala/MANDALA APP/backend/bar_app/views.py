from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework import generics
from rest_framework.response import Response
from django_filters import rest_framework as filters
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, DateFilter
from django.db.models import Sum, Value
from django.db.models import DecimalField, F
from django.db.models.functions import Coalesce
import logging
from django.db import models
from .models import Producto, Pedido, Movimiento, Mesa, Mesera
from .serializers import (
    ProductoSerializer, 
    MovimientoSerializer, 
    PedidoSerializer, 
    MesaSerializer, 
    MeseraSerializer,
    MeseraTotalPedidosSerializer # Asegúrate que este serializer existe
)
from datetime import datetime, timedelta
from django.utils import timezone
from django.db.models import Q
from decimal import Decimal
from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework import status
from django.core.exceptions import FieldDoesNotExist

import os
from django.core.files.storage import default_storage
from django.conf import settings

logger = logging.getLogger(__name__)

class DebugStorageView(generics.GenericAPIView):
    def get(self, request):
        storage_class = default_storage.__class__.__name__
        is_cloudinary = 'Cloudinary' in storage_class
        
        return Response({
            'storage_backend': storage_class,
            'is_cloudinary_active': is_cloudinary,
            'cloudinary_cloud_name': os.environ.get('CLOUDINARY_CLOUD_NAME'),
            'default_file_storage_setting': getattr(settings, 'DEFAULT_FILE_STORAGE', 'Not Set'),
            'media_url': settings.MEDIA_URL,
            'debug_mode': settings.DEBUG
        })

# --- VISTAS EXISTENTES ---

class MeseraViewSet(viewsets.ModelViewSet):
    queryset = Mesera.objects.all().order_by('-id')
    serializer_class = MeseraSerializer
    
    # La validación de código único se ha movido al MeseraSerializer.
    # El método perform_create ya no es necesario aquí para esa validación.
    # def perform_create(self, serializer):
    #     ...

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all().order_by('-id')
    serializer_class = ProductoSerializer

class MovimientoViewSet(viewsets.ModelViewSet):
    queryset = Movimiento.objects.all().order_by('-id')
    serializer_class = MovimientoSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        producto_id = data.get('producto') or data.get('producto_id')
        tipo = (data.get('tipo') or '').lower()
        cantidad_raw = data.get('cantidad')

        if not producto_id or tipo not in ('entrada', 'salida') or not cantidad_raw:
            return Response({'detail': 'Payload inválido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cantidad = Decimal(str(cantidad_raw))
            if cantidad <= 0:
                raise ValueError
        except Exception:
            return Response({'detail': 'Cantidad inválida'}, status=status.HTTP_400_BAD_REQUEST)

        producto = get_object_or_404(Producto, pk=producto_id)

        with transaction.atomic():
            producto = Producto.objects.select_for_update().get(pk=producto.pk)
            nuevo_stock = producto.stock + cantidad if tipo == 'entrada' else producto.stock - cantidad
            if nuevo_stock < 0:
                return Response({'detail': 'Stock insuficiente'}, status=status.HTTP_400_BAD_REQUEST)

            # Construir kwargs seguros para crear Movimiento
            mov_kwargs = {
                'producto': producto,
                'tipo': tipo,
                'cantidad': cantidad,
            }

            # Mapear 'descripcion' (o alternativas) al campo real del modelo si existe
            descripcion_val = data.get('descripcion') or data.get('motivo') or data.get('detalle') or data.get('observacion')
            if descripcion_val:
                for candidate in ('descripcion', 'motivo', 'detalle', 'observacion'):
                    try:
                        Movimiento._meta.get_field(candidate)
                        mov_kwargs[candidate] = descripcion_val
                        break
                    except FieldDoesNotExist:
                        continue

            movimiento = Movimiento.objects.create(**mov_kwargs)

            producto.stock = nuevo_stock
            producto.save()

        producto.refresh_from_db()
        mov_ser = MovimientoSerializer(movimiento)
        prod_ser = ProductoSerializer(producto)
        return Response({'movimiento': mov_ser.data, 'producto': prod_ser.data}, status=status.HTTP_201_CREATED)

# --- Crear un FilterSet para Pedido ---
class PedidoFilter(FilterSet):
    fecha = DateFilter(field_name='fecha_hora__date')
    mesera = filters.NumberFilter(field_name='mesera_id')

    class Meta:
        model = Pedido
        fields = ['mesera', 'estado', 'fecha']

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all().order_by('-fecha_hora')
    serializer_class = PedidoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PedidoFilter

    def get_queryset(self):
        """
        Filtra los pedidos por mesera y/o fecha.
        - Si se provee 'mesera', filtra por esa mesera.
        - Si se provee 'fecha', filtra por esa fecha.
        - Si se proveen ambos, filtra por ambos.
        - Si no se provee 'mesera' pero sí 'fecha', devuelve todos los pedidos de esa fecha.
        """
        queryset = super().get_queryset()
        mesera_id = self.request.query_params.get('mesera')
        fecha = self.request.query_params.get('fecha')

        if mesera_id:
            queryset = queryset.filter(mesera_id=mesera_id)

        if fecha:
            queryset = queryset.filter(fecha_hora__date=fecha)

        return queryset.select_related('mesera', 'mesa')

    def create(self, request, *args, **kwargs):
        mesa_id = request.data.get('mesa')
        force_append = request.data.get('force_append', False)
        
        # Filtramos pedidos activos para esta mesa (ni finalizados ni cancelados)
        active_pedido = Pedido.objects.filter(
            mesa_id=mesa_id
        ).exclude(
            estado__in=['finalizada', 'cancelado']
        ).first()

        if active_pedido:
            if not force_append:
                return Response(
                    {"detail": f"La mesa {active_pedido.mesa.numero} ya tiene un pedido activo. Ve a 'Mis Pedidos' para agregar productos."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Lógica para AGREGAR productos a un pedido existente
            from .models import PedidoProducto  # Importación local para evitar circular, si aplica

            productos_data = request.data.get('productos', [])
            if not productos_data:
                 return Response({"detail": "No se enviaron productos."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                with transaction.atomic():
                    # Opcional: Actualizar mesera si cambió
                    if 'mesera' in request.data:
                        active_pedido.mesera_id = request.data['mesera']

                    total_adicional = 0
                    
                    for item in productos_data:
                        producto_id = item.get('producto_id')
                        cantidad = int(item.get('cantidad', 0))
                        
                        if cantidad <= 0:
                            continue

                        # Obtener producto y bloquear fila
                        producto = Producto.objects.select_for_update().get(pk=producto_id)
                        
                        # Validar stock
                        if producto.stock < cantidad:
                             raise ValueError(f"Stock insuficiente para {producto.nombre}")
                        
                        # Descontar stock
                        producto.stock -= cantidad
                        producto.save()
                        
                        total_adicional += producto.precio * cantidad
                        
                        # Agregar o Actualizar PedidoProducto
                        # Buscamos si ya existe este producto en este pedido para sumar cantidad
                        pp_existente = PedidoProducto.objects.filter(pedido=active_pedido, producto=producto).first()
                        
                        if pp_existente:
                            pp_existente.cantidad += cantidad
                            pp_existente.save()
                        else:
                            PedidoProducto.objects.create(pedido=active_pedido, producto=producto, cantidad=cantidad)
                    
                    # Actualizar Total y Estado del Pedido
                    active_pedido.total += Decimal(total_adicional)
                    # Si se agregan nuevos productos, el bartender debe verlos como pendientes
                    # (Incluso si el pedido estaba 'despachado', vuelve a 'pendiente' parcialmente?)
                    # Simplificación: Lo ponemos en 'pendiente' para alertar.
                    active_pedido.estado = 'pendiente' 
                    active_pedido.save()
            
            except Producto.DoesNotExist:
                return Response({"detail": "Uno de los productos no existe."}, status=status.HTTP_400_BAD_REQUEST)
            except ValueError as e:
                return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                logger.error(f"Error actualizando pedido: {e}")
                return Response({"detail": "Error interno al actualizar el pedido."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Retornar el pedido actualizado
            serializer = self.get_serializer(active_pedido)
            return Response(serializer.data, status=status.HTTP_200_OK)

        else:
            # Comportamiento estándar (Crear Nuevo)
            # Primero verificamos si podemos bloquear la mesa
             with transaction.atomic():
                mesa = get_object_or_404(Mesa, pk=mesa_id)
                # Opcional: si la validación es estricta por estado de mesa
                # if mesa.estado == 'ocupada':
                #    return Response({"detail": "La mesa figura ocupada."}, status=status.HTTP_400_BAD_REQUEST)
                
                mesa.estado = 'ocupada'
                mesa.save()
                
                return super().create(request, *args, **kwargs)

class MesaViewSet(viewsets.ModelViewSet):
    queryset = Mesa.objects.all().order_by('numero')
    serializer_class = MesaSerializer
    # La validación de número único se ha movido al MesaSerializer.

# --- NUEVA VISTA PARA EL REPORTE ---

class MeseraTotalPedidosView(generics.ListAPIView):
    """
    Vista para obtener el total de pedidos por cada mesera.
    """
    serializer_class = MeseraTotalPedidosSerializer

    def get_queryset(self):
        # Obtener el parámetro de fecha de la URL, si existe
        fecha_str = self.request.query_params.get('fecha', None)

        # Partimos de TODAS las meseras y calculamos sus ventas.
        # Usamos Coalesce para asegurarnos de que si no hay ventas, el total sea 0.
        queryset = Mesera.objects.annotate(
            total_vendido=Coalesce(
                Sum(
                    'pedido__total',
                    # Aplicar el filtro de fecha directamente en la suma
                    filter=models.Q(pedido__fecha_hora__date=fecha_str) if fecha_str else None
                ),
                Value(0),
                output_field=DecimalField()
            )
        ).values(
            'total_vendido',
            mesera_id=F('id'), # Mapear el 'id' del modelo Mesera al campo 'mesera_id' del serializer
            mesera_nombre=F('nombre') # Mapear el 'nombre' del modelo Mesera al campo 'mesera_nombre' del serializer
        )
        return queryset

