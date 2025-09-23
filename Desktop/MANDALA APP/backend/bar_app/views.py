from django.shortcuts import render
from rest_framework import viewsets
from .models import Producto, Pedido
from .serializers import ProductoSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all().order_by('-id')
    serializer_class = ProductoSerializer




@api_view(['GET'])
def productos_list(request):
    productos = Producto.objects.all()
    serializer = ProductoSerializer(productos, many=True)
    return Response(serializer.data)

