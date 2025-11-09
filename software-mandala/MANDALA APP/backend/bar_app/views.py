from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework import generics
from rest_framework.response import Response
from django_filters import rest_framework as filters
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, DateFilter
from django.db.models import Sum, Value
from django.db.models import DecimalField, F
from django.db.models.functions import Coalesce
import logging
from django.db import models
from .models import Producto, Pedido, Movimiento, Mesa, Mesera
from .serializers import (
    ProductoSerializer, 
    MovimientoSerializer, 
    PedidoSerializer, 
    MesaSerializer, 
    MeseraSerializer,
    MeseraTotalPedidosSerializer # Asegúrate que este serializer existe
)
from datetime import datetime, timedelta
from django.utils import timezone
from django.db.models import Q

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

# --- Crear un FilterSet para Pedido ---
class PedidoFilter(FilterSet):
    fecha = DateFilter(field_name='fecha_hora__date')
    mesera = filters.NumberFilter(field_name='mesera_id')

    class Meta:
        model = Pedido
        fields = ['mesera', 'estado', 'fecha']

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all().order_by('-fecha_hora')
    serializer_class = PedidoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PedidoFilter

    def get_queryset(self):
        """
        Filtra los pedidos por mesera y/o fecha.
        - Si se provee 'mesera', filtra por esa mesera.
        - Si se provee 'fecha', filtra por esa fecha.
        - Si se proveen ambos, filtra por ambos.
        - Si no se provee 'mesera' pero sí 'fecha', devuelve todos los pedidos de esa fecha.
        """
        queryset = super().get_queryset()
        mesera_id = self.request.query_params.get('mesera')
        fecha = self.request.query_params.get('fecha')

        if mesera_id:
            queryset = queryset.filter(mesera_id=mesera_id)

        if fecha:
            queryset = queryset.filter(fecha_hora__date=fecha)

        return queryset.select_related('mesera', 'mesa')

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
        # Obtener el parámetro de fecha de la URL, si existe
        fecha_str = self.request.query_params.get('fecha', None)

        # Partimos de TODAS las meseras y calculamos sus ventas.
        # Usamos Coalesce para asegurarnos de que si no hay ventas, el total sea 0.
        queryset = Mesera.objects.annotate(
            total_vendido=Coalesce(
                Sum(
                    'pedido__total',
                    # Aplicar el filtro de fecha directamente en la suma
                    filter=models.Q(pedido__fecha_hora__date=fecha_str) if fecha_str else None
                ),
                Value(0),
                output_field=DecimalField()
            )
        ).values(
            'total_vendido',
            mesera_id=F('id'), # Mapear el 'id' del modelo Mesera al campo 'mesera_id' del serializer
            mesera_nombre=F('nombre') # Mapear el 'nombre' del modelo Mesera al campo 'mesera_nombre' del serializer
        )
        return queryset
