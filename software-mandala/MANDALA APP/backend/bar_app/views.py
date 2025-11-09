from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework import generics
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend # Importar para filtrar
from django.db.models import Sum, Value
from django.db.models import DecimalField, F # Importamos F
from django.db.models.functions import Coalesce
import logging

from .models import Producto, Pedido, Movimiento, Mesa, Mesera
from .serializers import (
    ProductoSerializer, 
    MovimientoSerializer, 
    PedidoSerializer, 
    MesaSerializer, 
    MeseraSerializer,
    MeseraTotalPedidosSerializer # Asegúrate que este serializer existe
)

logger = logging.getLogger(__name__)

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
    queryset = Movimiento.objects.all().order_by("-fecha")
    serializer_class = MovimientoSerializer

    


class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all().order_by('-fecha_hora')
    serializer_class = PedidoSerializer
    filter_backends = [DjangoFilterBackend] # Habilitar filtrado
    filterset_fields = ['mesera', 'estado'] # Permitir filtrar por el ID de la mesera y el estado

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
        # Partimos de TODAS las meseras y calculamos sus ventas.
        # Usamos Coalesce para asegurarnos de que si no hay ventas, el total sea 0.
        queryset = Mesera.objects.annotate(
            total_vendido=Coalesce(
                Sum('pedido__total'),  # CORRECCIÓN FINAL: Usar la relación 'pedido' que indica el error.
                Value(0),
                output_field=DecimalField()
            )
        ).values(
            'total_vendido',
            mesera_id=F('id'), # Mapear el 'id' del modelo Mesera al campo 'mesera_id' del serializer
            mesera_nombre=F('nombre') # Mapear el 'nombre' del modelo Mesera al campo 'mesera_nombre' del serializer
        )
        return queryset
