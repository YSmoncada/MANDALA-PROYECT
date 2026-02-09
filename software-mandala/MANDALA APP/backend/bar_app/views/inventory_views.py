from rest_framework import viewsets
from ..models import Producto, Movimiento
from ..serializers import ProductoSerializer, MovimientoSerializer
from ..authentication import GlobalAuthentication, IsSuperUser
from ..services.inventory_service import InventoryService
import logging

logger = logging.getLogger(__name__)


class ProductoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de productos.
    Permite CRUD completo de productos del inventario.
    """
    queryset = Producto.objects.all().select_related('categoria_rel').order_by('-id')
    serializer_class = ProductoSerializer
    authentication_classes = [GlobalAuthentication]
    permission_classes = [IsSuperUser]  # Solo admin puede gestionar productos
    
    def perform_create(self, serializer):
        """Log al crear producto"""
        producto = serializer.save()
        logger.info(f"Producto creado: {producto.nombre} (ID: {producto.id}, Stock: {producto.stock})")
    
    def perform_update(self, serializer):
        """Log al actualizar producto"""
        producto = serializer.save()
        logger.info(f"Producto actualizado: {producto.nombre} (ID: {producto.id}, Stock: {producto.stock})")
    
    def perform_destroy(self, instance):
        """Log al eliminar producto"""
        logger.warning(f"Producto eliminado: {instance.nombre} (ID: {instance.id})")
        instance.delete()


class MovimientoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de movimientos de inventario.
    Los movimientos se crean a través del InventoryService.
    """
    queryset = Movimiento.objects.all().select_related('producto').order_by('-id')
    serializer_class = MovimientoSerializer
    authentication_classes = [GlobalAuthentication]
    permission_classes = [IsSuperUser]  # Solo admin puede ver/gestionar movimientos

    def create(self, request, *args, **kwargs):
        """
        Crea un movimiento de inventario (entrada o salida).
        Delega la lógica al InventoryService que maneja validaciones y actualización de stock.
        """
        return InventoryService.create_movement(request.data, user=request.user)

