from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, action, authentication_classes, permission_classes
from rest_framework import generics
from rest_framework.response import Response
from django_filters import rest_framework as filters
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, DateFilter
from django.db.models import Sum, Value
from django.db.models import DecimalField, F
from django.db.models.functions import Coalesce, Concat
import logging
from django.db import models
from .models import Producto, Pedido, Movimiento, Mesa, Mesera, PedidoProducto, EmpresaConfig
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django.contrib.auth.models import User
from .serializers import (
    ProductoSerializer, 
    MovimientoSerializer, 
    PedidoSerializer, 
    MesaSerializer, 
    MeseraSerializer,
    MeseraTotalPedidosSerializer,
    UserSerializer,
    EmpresaConfigSerializer
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

@api_view(['GET'])
def api_root_view(request):
    return Response({
        "message": "Bienvenido a la API de Mandala Proyect",
        "status": "running"
    })

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def debug_users_view(request):
    try:
        users = User.objects.all().values('id', 'username', 'email', 'is_active', 'is_staff', 'is_superuser')
        db_name = settings.DATABASES['default']['NAME']
        return Response({
            "database_used": str(db_name),
            "user_count": len(users),
            "users": list(users)
        })
    except Exception as e:
        return Response({"error": str(e)}, status=500)


class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # Desactivar CSRF para permitir peticiones Vercel -> Render

class IsSuperUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and (request.user.is_superuser or request.user.is_staff))

class EmpresaConfigViewSet(viewsets.ModelViewSet):
    queryset = EmpresaConfig.objects.all()
    serializer_class = EmpresaConfigSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = [CsrfExemptSessionAuthentication, BasicAuthentication]

    def get_queryset(self):
        # Usamos un try-except para evitar errores si la tabla aún no existe durante las migraciones
        try:
            if EmpresaConfig.objects.count() == 0:
                EmpresaConfig.objects.create(nombre="MANDALA DISCO CLUB")
        except Exception:
            pass
        return super().get_queryset()

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
    authentication_classes = [CsrfExemptSessionAuthentication, BasicAuthentication]
    
    # La validación de código único se ha movido al MeseraSerializer.
    # El método perform_create ya no es necesario aquí para esa validación.
    
    @action(detail=True, methods=['post'], url_path='cambiar-codigo')
    def cambiar_codigo(self, request, pk=None):
        """
        Permite al administrador cambiar el PIN de una mesera.
        Solo accesible por superusuarios.
        """
        if not (request.user.is_superuser or request.user.is_staff):
            return Response({'detail': 'No tienes permiso para esta acción.'}, status=status.HTTP_403_FORBIDDEN)
            
        mesera = self.get_object()
        nuevo_codigo = request.data.get('codigo')

        if not nuevo_codigo:
            return Response({'detail': 'El código es requerido.'}, status=status.HTTP_400_BAD_REQUEST)

        # Limpiar y asegurar que sea string de al menos 4 caracteres
        nuevo_codigo_str = str(nuevo_codigo).strip()

        if len(nuevo_codigo_str) < 4:
            return Response({'detail': 'El código debe tener al menos 4 dígitos.'}, status=status.HTTP_400_BAD_REQUEST)

        mesera.codigo = nuevo_codigo_str
        mesera.save()

        return Response({'detail': f'Código de {mesera.nombre} actualizado correctamente.'})

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all().order_by('-id')
    serializer_class = ProductoSerializer
    authentication_classes = [CsrfExemptSessionAuthentication, BasicAuthentication]

class MovimientoViewSet(viewsets.ModelViewSet):
    queryset = Movimiento.objects.all().order_by('-id')
    serializer_class = MovimientoSerializer
    authentication_classes = [CsrfExemptSessionAuthentication, BasicAuthentication]

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
    usuario = filters.NumberFilter(field_name='usuario_id')
    sistema = filters.BooleanFilter(method='filter_sistema')

    class Meta:
        model = Pedido
        fields = ['mesera', 'usuario', 'estado', 'fecha', 'sistema']

    def filter_sistema(self, queryset, name, value):
        if value:
            return queryset.filter(mesera__isnull=True, usuario__isnull=False)
        return queryset

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all().order_by('-fecha_hora')
    serializer_class = PedidoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PedidoFilter
    authentication_classes = [CsrfExemptSessionAuthentication, BasicAuthentication]

    def get_queryset(self):
        """
        Retorna el queryset base para los pedidos.
        El filtrado real lo hace DjangoFilterBackend con PedidoFilter.
        """
        return Pedido.objects.all().order_by('-fecha_hora').select_related('mesera', 'usuario', 'mesa').prefetch_related('pedidoproducto_set', 'pedidoproducto_set__producto')

    def perform_update(self, serializer):
        """
        Si el pedido se marca como 'despachado', actualizamos todos sus items
        para que cantidad_despachada = cantidad.
        """
        instance = serializer.save()
        
        if instance.estado == 'despachado':
            with transaction.atomic():
                # Actualizar cada item para que esté totalmente despachado
                # Usamos F() para evitar condiciones de carrera, aunque en update simple está bien.
                # Lo hacemos directo:
                for item in instance.pedidoproducto_set.all():
                    if item.cantidad_despachada < item.cantidad:
                        item.cantidad_despachada = item.cantidad
                        item.save()

    def create(self, request, *args, **kwargs):
        """
        Crea un nuevo pedido o agrega productos a uno existente si 'force_append' es True.
        """
        force_append = request.data.get('force_append', False)
        mesa_id = request.data.get('mesa')

        if force_append:
            # Buscar un pedido activo para esta mesa (pendiente, despachado o en_proceso)
            # Excluimos cancelado y finalizada
            pedido_activo = Pedido.objects.filter(
                mesa_id=mesa_id
            ).exclude(
                estado__in=['cancelado', 'finalizada']
            ).order_by('-fecha_hora').first()

            if pedido_activo:
                logger.info(f"Agregando productos al pedido existente #{pedido_activo.id}")
                
                productos_data = request.data.get('productos', [])
                
                try:
                    with transaction.atomic():
                        # Bloquear el pedido para edición segura
                        pedido = Pedido.objects.select_for_update().get(pk=pedido_activo.id)
                        
                        # Si el pedido estaba "despachado", significa que todo lo anterior ya fue entregado.
                        # Debemos asegurar que los items existentes estén marcados como despachados
                        # ANTES de agregar lo nuevo, para que no aparezcan como nuevos.
                        if pedido.estado == 'despachado':
                            for old_item in pedido.pedidoproducto_set.all():
                                if old_item.cantidad_despachada < old_item.cantidad:
                                    old_item.cantidad_despachada = old_item.cantidad
                                    old_item.save()

                        total_agregado = 0
                        
                        for item in productos_data:
                            producto_id = item.get('producto_id')
                            cantidad = int(item.get('cantidad', 0))
                            
                            if cantidad <= 0:
                                continue

                            producto = Producto.objects.select_for_update().get(pk=producto_id)
                            
                            # Verificar stock
                            if producto.stock < cantidad:
                                return Response(
                                    {"detail": f"Stock insuficiente para {producto.nombre}"}, 
                                    status=status.HTTP_400_BAD_REQUEST
                                )

                            # Actualizar stock
                            producto.stock -= cantidad
                            producto.save()

                            # Buscar si el producto ya está en el pedido
                            pedido_producto, created = PedidoProducto.objects.get_or_create(
                                pedido=pedido,
                                producto=producto,
                                defaults={'cantidad': 0}
                            )
                            
                            # Actualizar cantidad en el pedido
                            pedido_producto.cantidad += cantidad
                            pedido_producto.save()
                            
                            # Sumar al total
                            total_agregado += producto.precio * cantidad

                        # Actualizar total del pedido
                        pedido.total += total_agregado
                        
                        # IMPORTANTE: Resetear estado a 'pendiente' para que el bartender lo vea de nuevo
                        # Solo si no estaba ya pendiente, para asegurar que se note el cambio
                        pedido.estado = 'pendiente'
                        pedido.save()
                        
                        # Serializar y devolver (usamos el serializer de lectura/detalle si es posible, o el standard)
                        serializer = self.get_serializer(pedido)
                        return Response(serializer.data, status=status.HTTP_200_OK)

                except Exception as e:
                    logger.error(f"Error al agregar productos al pedido: {e}")
                    return Response(
                        {"detail": "Error al actualizar el pedido existente."}, 
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            else:
                # Si no hay pedido activo, fallback a crear uno nuevo normal o error?
                # El frontend asume que si manda force_append es porque sabe que existe, 
                # pero si se cerró justo antes, mejor crear uno nuevo.
                logger.warning(f"No se encontró pedido activo para mesa {mesa_id} con force_append=True. Creando nuevo.")
        
        # Comportamiento normal (crear nuevo)
        return super().create(request, *args, **kwargs)

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

    @action(detail=True, methods=['post'], url_path='despachar_producto')
    def despachar_producto(self, request, pk=None):
        """
        Marca un producto específico de un pedido como despachado (cantidad_despachada = cantidad).
        Si todos los productos están despachados, cambia el estado del pedido a 'despachado'.
        """
        pedido = self.get_object()
        item_id = request.data.get('item_id')
        
        if not item_id:
            return Response({"detail": "Se requiere item_id"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            item = PedidoProducto.objects.get(id=item_id, pedido=pedido)
        except PedidoProducto.DoesNotExist:
            return Response({"detail": "Producto no encontrado en este pedido"}, status=status.HTTP_404_NOT_FOUND)
            
        # Actualizar cantidad despachada
        item.cantidad_despachada = item.cantidad
        item.save()
        
        # Verificar si todos los productos del pedido han sido despachados completely
        # (usamos item.cantidad <= item.cantidad_despachada para ser seguros)
        all_dispatched = not pedido.pedidoproducto_set.filter(cantidad__gt=models.F('cantidad_despachada')).exists()
        
        if all_dispatched:
            pedido.estado = 'despachado'
            pedido.save()
            msg = "Producto despachado. Pedido completado."
        else:
            msg = "Producto despachado."
            
        return Response({"detail": msg, "pedido_estado": pedido.estado}, status=status.HTTP_200_OK)

class MesaViewSet(viewsets.ModelViewSet):
    queryset = Mesa.objects.all().order_by('numero')
    serializer_class = MesaSerializer
    authentication_classes = [CsrfExemptSessionAuthentication, BasicAuthentication]
    # La validación de número único se ha movido al MesaSerializer.

# --- NUEVA VISTA PARA EL REPORTE ---

class MeseraTotalPedidosView(generics.ListAPIView):
    serializer_class = MeseraTotalPedidosSerializer

    def get_queryset(self):
        fecha_str = self.request.query_params.get('fecha', None)
        
        # 1. Ventas por Meseras
        meseras_ventas = Mesera.objects.annotate(
            total_vendido=Coalesce(
                Sum('pedido__total', filter=models.Q(pedido__fecha_hora__date=fecha_str) if fecha_str else None),
                Value(0),
                output_field=models.DecimalField()
            )
        ).values(
            'total_vendido', 
            mesera_id=F('id'), 
            mesera_nombre=F('nombre'),
            tipo=Value('mesera')
        )

        # 2. Ventas por Usuarios del Sistema (Admin y Barra)
        # Incluimos a todos los usuarios que han realizado al menos un pedido o que son del staff/superuser
        usuarios_ventas_raw = User.objects.filter(
            Q(groups__name='Bartender') | Q(is_superuser=True) | Q(is_staff=True) | Q(pedido__isnull=False)
        ).distinct().annotate(
            total_vendido=Coalesce(
                Sum('pedido__total', filter=models.Q(pedido__fecha_hora__date=fecha_str) if fecha_str else None),
                Value(0),
                output_field=models.DecimalField()
            )
        ).values('total_vendido', 'id', 'username')

        usuarios_ventas = []
        for u in usuarios_ventas_raw:
            nombre_mostrar = u['username'].upper()
            if u['username'].lower() == 'admin':
                nombre_mostrar = 'ADMINISTRADOR'
            elif u['username'].lower() == 'barra':
                nombre_mostrar = 'BARTENDER'
            
            usuarios_ventas.append({
                'total_vendido': u['total_vendido'],
                'mesera_id': u['id'],
                'mesera_nombre': nombre_mostrar,
                'tipo': 'usuario'
            })

        # Combinar ambos resultados
        return list(meseras_ventas) + usuarios_ventas

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        return Response(queryset)

class ReporteVentasDiariasView(generics.ListAPIView):
    """
    Vista para obtener el reporte de ventas diarias.
    Agrupa los pedidos por fecha y suma los totales.
    Útil para reportes contables y DIAN.
    """
    def list(self, request, *args, **kwargs):
        # Obtener rango de fechas opcional
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        queryset = Pedido.objects.exclude(estado='cancelado')

        if start_date:
            queryset = queryset.filter(fecha_hora__date__gte=start_date)
        if end_date:
            queryset = queryset.filter(fecha_hora__date__lte=end_date)

        # Agrupar por fecha
        # Nota: En SQLite la función de fecha es diferente que en Postgres,
        # pero Django suele abstraer esto con TruncDate.
        from django.db.models.functions import TruncDate
        
        ventas_diarias = queryset.annotate(
            fecha=TruncDate('fecha_hora')
        ).values('fecha').annotate(
            total_ventas=Sum('total'),
            cantidad_pedidos=models.Count('id')
        ).order_by('-fecha')

        return Response(ventas_diarias)

from rest_framework.views import APIView
from django.contrib.auth import authenticate

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication, BasicAuthentication]
    """
    Vista personalizada para login de Administrativos y Bartenders.
    Las Meseras siguen usando su código PIN (validado en frontend por ahora).
    """
    def post(self, request):
        from django.contrib.auth import login
        username = request.data.get('username')
        password = request.data.get('password')
        
        # Validar credenciales contra el sistema de usuarios de Django
        user = authenticate(request, username=username, password=password)
        
        if user:
            login(request, user) # Establish session
            
            # Limpieza: Si existen perfiles de mesera con el mismo nombre que usuarios del sistema,
            # los eliminamos para evitar confusiones, ya que ahora usamos el campo 'usuario'.
            from .models import Mesera
            Mesera.objects.filter(nombre__iexact=user.username).delete()

            # Determinar rol basado en grupos
            if user.is_superuser:
                role = 'admin'
            elif user.groups.filter(name='Bartender').exists():
                role = 'bartender'
            elif user.groups.filter(name='Prueba').exists():
                role = 'prueba'
            else:
                role = 'admin' # Default fallback

            
            return Response({
                'success': True,
                'role': role,
                'username': user.username,
                'user_id': user.id, # Enviamos el ID real del usuario de Django
                'detail': f'Bienvenido {user.username}'
            })
            
        return Response({
            'success': False,
            'detail': 'Credenciales inválidas'
        }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def total_pedidos_mesera_hoy(request):
    """
    Calcula el total de pedidos para cada mesera (y sistema) en el día actual.
    """
    hoy = timezone.now().date()
    
    # 1. Ventas Meseras
    ventas_por_mesera = Mesera.objects.annotate(
        total_vendido=Coalesce(
            Sum('pedido__total', filter=Q(pedido__fecha_hora__date=hoy)),
            Value(0),
            output_field=DecimalField()
        )
    ).values('id', 'nombre', 'total_vendido')

    # 2. Ventas Usuarios Sistema
    ventas_por_usuario = User.objects.filter(pedido__isnull=False).annotate(
        total_vendido=Coalesce(
            Sum('pedido__total', filter=Q(pedido__fecha_hora__date=hoy)),
            Value(0),
            output_field=DecimalField()
        )
    ).values('id', 'username', 'total_vendido')

    # Ajustar nombres de usuario
    resultado = list(ventas_por_mesera)
    for u in ventas_por_usuario:
        resultado.append({
            'id': f"u{u['id']}",
            'nombre': u['username'].upper(),
            'total_vendido': u['total_vendido']
        })

    return Response(resultado)

@api_view(['POST'])
@authentication_classes([CsrfExemptSessionAuthentication, BasicAuthentication])
@permission_classes([permissions.AllowAny])
@csrf_exempt
def verificar_codigo_mesera(request):
    """
    Verifica si el código ingresado corresponde a la mesera seleccionada.
    """
    mesera_id = request.data.get('mesera_id')
    codigo = request.data.get('codigo')

    if not mesera_id or not codigo:
        return Response({'detail': 'Faltan datos'}, status=status.HTTP_400_BAD_REQUEST)

    mesera = get_object_or_404(Mesera, pk=mesera_id)

    # Comparación robusta (strings limpios)
    # Convertimos ambos a string y removemos espacios para evitar fallos tontos.
    if str(mesera.codigo).strip() == str(codigo).strip():
        return Response({'success': True})
    else:
        return Response({'success': False, 'detail': 'Código incorrecto'}, status=status.HTTP_401_UNAUTHORIZED)

@method_decorator(csrf_exempt, name='dispatch')
class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet para la gestión de usuarios por parte del administrador.
    """
    queryset = User.objects.all().order_by('username')
    serializer_class = UserSerializer
    permission_classes = [IsSuperUser]
    authentication_classes = [CsrfExemptSessionAuthentication, BasicAuthentication]

    @action(detail=True, methods=['post'], url_path='cambiar-password')
    def cambiar_password(self, request, pk=None):
        user = self.get_object()
        new_password = request.data.get('password')

        if not new_password:
            return Response({'detail': 'Se requiere una nueva contraseña.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({'detail': f'Contraseña de {user.username} actualizada correctamente.'})
