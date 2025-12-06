from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework import generics
from rest_framework.decorators import action
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

    @action(detail=False, methods=['delete'], url_path='borrar_historial')
    def borrar_historial(self, request, *args, **kwargs):
        """
        Elimina los pedidos que coinciden con los filtros de mesera y/o fecha.
        Este endpoint es llamado por el botón "Borrar Historial" en el frontend.
        """
        # Reutilizamos get_queryset() que ya sabe cómo filtrar por los query params
        queryset = self.get_queryset()

        if not queryset.exists():
            return Response({"detail": "No hay pedidos que coincidan con los filtros para eliminar."}, status=status.HTTP_404_NOT_FOUND)

        # Usar una transacción para asegurar la integridad de los datos.
        # Si algo falla, todos los cambios se revierten.
        try:
            with transaction.atomic():
                pedidos_a_eliminar = list(queryset) # Convertir a lista para poder contar
                count = len(pedidos_a_eliminar)

                for pedido in pedidos_a_eliminar:
                    # Por cada pedido, devolvemos el stock de sus productos
                    for item in pedido.pedidoproducto_set.all():
                        producto = item.producto
                        producto.stock += item.cantidad
                        producto.save()
                
                # Después de revertir el stock, eliminamos los pedidos.
                queryset.delete()
        except Exception as e:
            logger.error(f"Error al intentar borrar el historial de pedidos: {e}")
            return Response({"detail": "Ocurrió un error al intentar eliminar el historial. No se realizaron cambios."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"detail": f"Se eliminaron {count} pedidos exitosamente y se restauró el stock."}, status=status.HTTP_200_OK)

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
