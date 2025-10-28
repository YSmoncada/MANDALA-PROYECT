from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend # Importar para filtrar

from .models import Producto, Pedido, Movimiento, Mesa, Mesera
from .serializers import ProductoSerializer, MovimientoSerializer, PedidoSerializer, MesaSerializer, MeseraSerializer
from .serializers import ProductoSerializer
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

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
    queryset = Movimiento.objects.all().order_by("-fecha")
    serializer_class = MovimientoSerializer

    


class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all().order_by('-fecha_hora')
    serializer_class = PedidoSerializer
    filter_backends = [DjangoFilterBackend] # Habilitar filtrado
    filterset_fields = ['mesera'] # Permitir filtrar por el ID de la mesera

class MesaViewSet(viewsets.ModelViewSet):
    queryset = Mesa.objects.all().order_by('numero')
    serializer_class = MesaSerializer
    # La validación de número único se ha movido al MesaSerializer.

@api_view(['GET'])
def productos_list(request):
    productos = Producto.objects.all()
    serializer = ProductoSerializer(productos, many=True)
    return Response(serializer.data)
