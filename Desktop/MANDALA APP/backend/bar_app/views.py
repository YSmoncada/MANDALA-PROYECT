from django.shortcuts import render
from rest_framework import viewsets
from .models import Producto, Pedido
from .serializers import ProductoSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import MovimientoSerializer
from .serializers import PedidoSerializer, MesaSerializer, MeseraSerializer
from .models import Movimiento
from .models import PedidoProducto, Mesa, Mesera
from rest_framework import status

class MeseraViewSet(viewsets.ModelViewSet):
    queryset = Mesera.objects.all().order_by('-id')
    serializer_class = MeseraSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all().order_by('-id')
    serializer_class = ProductoSerializer

class MovimientoViewSet(viewsets.ModelViewSet):
    queryset = Movimiento.objects.all().order_by("-fecha")
    serializer_class = MovimientoSerializer

def perform_create(self, serializer):
        movimiento = serializer.save()
        producto = movimiento.producto

        if movimiento.tipo == "entrada":
            producto.stock += movimiento.cantidad
        elif movimiento.tipo == "salida":
            producto.stock -= movimiento.cantidad

        producto.save()

        return Response({
            "movimiento": MovimientoSerializer(movimiento).data,
            "producto": ProductoSerializer(producto).data
        }, status=status.HTTP_201_CREATED)


class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all().order_by('-fecha_hora')
    serializer_class = PedidoSerializer

    def perform_create(self, serializer):
        pedido = serializer.save()
        print("Pedido creado:", pedido)
        for item in PedidoProducto.objects.filter(pedido=pedido):
            producto = item.producto
            print(producto)
            if producto.stock < item.cantidad:
                raise ValueError(f"❌ Stock insuficiente para el producto {producto.nombre}.")
            producto.stock -= item.cantidad
            producto.save()

class MesaViewSet(viewsets.ModelViewSet):
    queryset = Mesa.objects.all().order_by('numero')
    serializer_class = MesaSerializer
    def perform_create(self, serializer):
        if Mesa.objects.filter(numero=serializer.validated_data['numero']).exists():
            raise ValueError("❌ Ya existe una mesa con ese número.")
        serializer.save()
@api_view(['GET'])
def productos_list(request):
    productos = Producto.objects.all()
    serializer = ProductoSerializer(productos, many=True)
    return Response(serializer.data)

