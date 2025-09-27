from django.shortcuts import render
from rest_framework import viewsets
from .models import Producto, Pedido
from .serializers import *
from rest_framework.decorators import api_view
from rest_framework.response import Response

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all().order_by('-id')
    serializer_class = ProductoSerializer


class MovimientoProductoViewSet(viewsets.ModelViewSet):
    queryset = MovimientoProducto.objects.all().order_by('-id')
    serializer_class = MovimientoProductoSerializer
    def perform_create(self, serializer):
        producto = serializer.validated_data['producto']
        tipo_movimiento = serializer.validated_data['tipo_movimiento']
        cantidad = serializer.validated_data['cantidad']

        if tipo_movimiento == 'entrada':
            producto.stock += cantidad
        elif tipo_movimiento == 'salida':
            producto.stock -= cantidad

        producto.save()
        serializer.save()
   
@api_view(['GET'])
def productos_list(request):
    productos = Producto.objects.all()
    serializer = ProductoSerializer(productos, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def movimientos_productos_list(request):
    movimientos = MovimientoProducto.objects.all()
    serializer = MovimientoProductoSerializer(movimientos, many=True)
    return Response(serializer.data)