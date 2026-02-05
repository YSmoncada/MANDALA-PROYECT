from rest_framework import generics
from rest_framework.decorators import api_view
from django.utils import timezone
from rest_framework.response import Response
from django.db import models
from django.db.models import Sum, Value, F, Q
from django.db.models.functions import Coalesce
from ..models import Mesera, Pedido
from ..serializers import MeseraTotalPedidosSerializer
from django.contrib.auth.models import User

class MeseraTotalPedidosView(generics.ListAPIView):
    serializer_class = MeseraTotalPedidosSerializer

    def get_queryset(self):
        fecha_str = self.request.query_params.get('fecha', None)
        
        # 1. Ventas por Meseras
        meseras_ventas = Mesera.objects.annotate(
            total_vendido=Coalesce(
                Sum('pedido__total', filter=models.Q(pedido__fecha_hora__date=fecha_str) if fecha_str else None),
                Value(0),
                output_field=models.DecimalField()
            )
        ).values(
            'total_vendido', 
            mesera_id=F('id'), 
            mesera_nombre=F('nombre'),
            tipo=Value('mesera')
        )

        # 2. Ventas por Usuarios del Sistema (Admin y Barra)
        # Incluimos a todos los usuarios que han realizado al menos un pedido o que son del staff/superuser
        usuarios_ventas_raw = User.objects.filter(
            Q(groups__name='Bartender') | Q(is_superuser=True) | Q(is_staff=True) | Q(pedido__isnull=False)
        ).distinct().annotate(
            total_vendido=Coalesce(
                Sum('pedido__total', filter=models.Q(pedido__fecha_hora__date=fecha_str) if fecha_str else None),
                Value(0),
                output_field=models.DecimalField()
            )
        ).values('total_vendido', 'id', 'username')

        usuarios_ventas = []
        for u in usuarios_ventas_raw:
            nombre_mostrar = u['username'].upper()
            if u['username'].lower() == 'admin':
                nombre_mostrar = 'ADMINISTRADOR'
            elif u['username'].lower() == 'barra':
                nombre_mostrar = 'BARTENDER'
            
            usuarios_ventas.append({
                'total_vendido': u['total_vendido'],
                'mesera_id': u['id'],
                'mesera_nombre': nombre_mostrar,
                'tipo': 'usuario'
            })

        # Combinar ambos resultados
        return list(meseras_ventas) + usuarios_ventas

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        return Response(queryset)

class ReporteVentasDiariasView(generics.ListAPIView):
    """
    Vista para obtener el reporte de ventas diarias.
    Agrupa los pedidos por fecha y suma los totales.
    Útil para reportes contables y DIAN.
    """
    def list(self, request, *args, **kwargs):
        # Obtener rango de fechas opcional
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        queryset = Pedido.objects.exclude(estado='cancelado')

        if start_date:
            queryset = queryset.filter(fecha_hora__date__gte=start_date)
        if end_date:
            queryset = queryset.filter(fecha_hora__date__lte=end_date)

        # Agrupar por fecha
        from django.db.models.functions import TruncDate
        
        ventas_diarias = queryset.annotate(
            fecha=TruncDate('fecha_hora')
        ).values('fecha').annotate(
            total_ventas=Sum('total'),
            cantidad_pedidos=models.Count('id')
        ).order_by('-fecha')

        return Response(ventas_diarias)

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
            output_field=models.DecimalField()
        )
    ).values('id', 'nombre', 'total_vendido')

    # 2. Ventas Usuarios Sistema
    ventas_por_usuario = User.objects.filter(pedido__isnull=False).annotate(
        total_vendido=Coalesce(
            Sum('pedido__total', filter=Q(pedido__fecha_hora__date=hoy)),
            Value(0),
            output_field=models.DecimalField()
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

