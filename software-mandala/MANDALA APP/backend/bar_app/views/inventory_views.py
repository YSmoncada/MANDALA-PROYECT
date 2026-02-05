from rest_framework import viewsets, status
from rest_framework.response import Response
from ..models import Producto, Movimiento
from ..serializers import ProductoSerializer, MovimientoSerializer
from ..authentication import GlobalAuthentication
from ..services.inventory_service import InventoryService

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all().order_by('-id')
    serializer_class = ProductoSerializer
    authentication_classes = [GlobalAuthentication]

class MovimientoViewSet(viewsets.ModelViewSet):
    queryset = Movimiento.objects.all().order_by('-id')
    serializer_class = MovimientoSerializer
    authentication_classes = [GlobalAuthentication]

    def create(self, request, *args, **kwargs):
        return InventoryService.create_movement(request.data)
