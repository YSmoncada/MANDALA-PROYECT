from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, DateFilter
from django_filters import rest_framework as filters
from django.db import models, transaction
from django.utils import timezone
from django.db.models import Q, Sum, F, DecimalField, Value
from django.db.models.functions import Coalesce
from ..models import Pedido, PedidoProducto, Mesa, Mesera
from ..serializers import PedidoSerializer
from .core_views import GlobalAuthentication
from ..services.order_service import OrderService
from django.contrib.auth.models import User

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
    authentication_classes = [GlobalAuthentication]

    def get_queryset(self):
        """
        Retorna el queryset base para los pedidos.
        El filtrado real lo hace DjangoFilterBackend con PedidoFilter.
        """
        return Pedido.objects.all().order_by('-fecha_hora').select_related('mesera', 'usuario', 'mesa').prefetch_related('pedidoproducto_set', 'pedidoproducto_set__producto')

    def perform_update(self, serializer):
        """
        Maneja actualizaciones de estado usando OrderService.
        """
        previous_estado = serializer.instance.estado
        instance = serializer.save()
        OrderService.process_order_update(instance, previous_estado)

    def create(self, request, *args, **kwargs):
        """
        Crea un nuevo pedido o agrega productos a uno existente si 'force_append' es True.
        """
        force_append = request.data.get('force_append', False)
        mesa_id = request.data.get('mesa')

        if force_append and mesa_id:
            # Delegar al servicio
            response = OrderService.add_products_to_existing_order(mesa_id, request.data.get('productos', []), self.get_serializer_context())
            if response:
                return response
            # Si retorna None, es que no habia pedido activo, seguimos flujo normal
        
        # Validación normal para no duplicar si no es force_append
        if mesa_id and not force_append:
             pedido_existente = Pedido.objects.filter(
                mesa_id=mesa_id
             ).exclude(
                estado__in=['cancelado', 'finalizada']
             ).first()
             
             if pedido_existente:
                 try:
                    mesa_numero = pedido_existente.mesa.numero
                 except:
                    mesa_numero = mesa_id
                    
                 return Response(
                    {
                        "detail": f"Ya existe un pedido activo para la Mesa #{mesa_numero}. Por favor, agrega productos al pedido existente desde 'Mis Pedidos' o espera a que se finalice.",
                        "pedido_id": pedido_existente.id,
                        "mesa": mesa_numero
                    }, 
                    status=status.HTTP_400_BAD_REQUEST
                )

        return super().create(request, *args, **kwargs)

    @action(detail=False, methods=['delete'], url_path='borrar_historial')
    def borrar_historial(self, request, *args, **kwargs):
        """
        Elimina los pedidos que coinciden con los filtros de mesera y/o fecha.
        """
        queryset = self.get_queryset()
        return OrderService.delete_order_history(queryset)

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
            
        # Descontar stock del item si aún falta por despachar
        pendiente = item.cantidad - item.cantidad_despachada
        if pendiente > 0:
            item.producto.stock -= pendiente
            item.producto.save()

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
