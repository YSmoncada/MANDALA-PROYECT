from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, DateFilter
from django_filters import rest_framework as filters
from django.utils import timezone
from datetime import timedelta
from ..models import Pedido, Mesa
from ..serializers import PedidoSerializer
from ..authentication import GlobalAuthentication, IsSuperUser
from ..services.order_service import OrderService
import logging

logger = logging.getLogger(__name__)


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
        return Pedido.objects.all().order_by('-fecha_hora').select_related('mesera', 'usuario', 'mesa').prefetch_related('items', 'items__producto')

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

        # CASO 1: Agregar a pedido existente
        if force_append and mesa_id:
            logger.info(f"Intentando agregar productos a pedido existente de mesa {mesa_id}")
            response = OrderService.add_products_to_existing_order(
                mesa_id, 
                request.data.get('productos', []), 
                self.get_serializer_context()
            )
            if response:
                return response
            # Si retorna None, no había pedido activo, continuar con creación normal
            logger.info(f"No hay pedido activo para mesa {mesa_id}, creando nuevo pedido")
        
        # CASO 2: Validar que no exista pedido duplicado (solo si NO es force_append)
        if mesa_id and not force_append:
            today = timezone.localdate()
            pedido_existente = Pedido.objects.filter(
                mesa_id=mesa_id,
                fecha_hora__date=today,
                estado__in=OrderService.ESTADOS_ACTIVOS
            ).select_related('mesa').first()
            
            if pedido_existente:
                mesa_numero = pedido_existente.mesa.numero if pedido_existente.mesa else mesa_id
                
                logger.warning(f"Intento de crear pedido duplicado para mesa {mesa_numero}")
                
                return Response(
                    {
                        "detail": f"Ya existe un pedido activo para la Mesa #{mesa_numero}. "
                                  f"Por favor, agrega productos al pedido existente desde 'Mis Pedidos' "
                                  f"o espera a que se finalice.",
                        "pedido_id": pedido_existente.id,
                        "mesa": mesa_numero
                    }, 
                    status=status.HTTP_400_BAD_REQUEST
                )

        # CASO 3: Crear nuevo pedido
        logger.info(f"Creando nuevo pedido para mesa {mesa_id}")
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
            
        result = OrderService.despachar_producto(pedido, item_id)
        
        if result.get("error"):
            return Response({"detail": result["error"]}, status=result["status"])
            
        return Response({"detail": result["detail"], "pedido_estado": result["pedido_estado"]}, status=result["status"])

