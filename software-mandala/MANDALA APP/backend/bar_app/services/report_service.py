from django.db import models
from django.db.models import Sum, Value, F, Q, Count
from django.db.models.functions import Coalesce, TruncDate
from django.utils import timezone
from django.contrib.auth.models import User
from ..models import Mesera, Pedido
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)

class ReportService:
    """
    Servicio centralizado para generación de reportes y estadísticas.
    """
    
    @staticmethod
    def get_ventas_por_vendedor(fecha=None):
        """
        Obtiene el total de ventas agrupado por vendedor (meseras y usuarios).
        
        Args:
            fecha: Fecha específica para filtrar (opcional). Si es None, incluye todas las fechas.
            
        Returns:
            list: Lista de diccionarios con información de ventas por vendedor
        """
        logger.info(f"Generando reporte de ventas por vendedor{f' para fecha {fecha}' if fecha else ''}")
        
        # Filtro de fecha
        fecha_filter = Q(pedido__fecha_hora__date=fecha) if fecha else Q()
        
        # 1. Ventas por Meseras
        meseras_ventas = Mesera.objects.annotate(
            total_vendido=Coalesce(
                Sum('pedido__total', filter=fecha_filter),
                Value(0),
                output_field=models.DecimalField()
            )
        ).values(
            'total_vendido',
            mesera_id=F('id'),
            mesera_nombre=F('nombre'),
            tipo=Value('mesera')
        )
        
        # 2. Ventas por Usuarios del Sistema
        usuarios_ventas_raw = User.objects.filter(
            Q(groups__name='Bartender') | Q(is_superuser=True) | Q(is_staff=True) | Q(pedido__isnull=False)
        ).distinct().annotate(
            total_vendido=Coalesce(
                Sum('pedido__total', filter=fecha_filter),
                Value(0),
                output_field=models.DecimalField()
            )
        ).values('total_vendido', 'id', 'username')
        
        # Formatear nombres de usuarios
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
        
        # Combinar resultados
        resultado = list(meseras_ventas) + usuarios_ventas
        
        logger.info(f"Reporte generado: {len(resultado)} vendedores encontrados")
        return resultado
    
    @staticmethod
    def get_ventas_por_vendedor_hoy():
        """
        Obtiene el total de ventas del día actual por vendedor.
        
        Returns:
            list: Lista de diccionarios con información de ventas de hoy
        """
        hoy = timezone.now().date()
        return ReportService.get_ventas_por_vendedor(fecha=hoy)
    
    @staticmethod
    def get_ventas_diarias(start_date=None, end_date=None):
        """
        Obtiene el reporte de ventas diarias agrupadas por fecha.
        
        Args:
            start_date: Fecha inicial del rango (opcional)
            end_date: Fecha final del rango (opcional)
            
        Returns:
            QuerySet: Ventas agrupadas por fecha con totales
        """
        logger.info(f"Generando reporte de ventas diarias (desde: {start_date}, hasta: {end_date})")
        
        queryset = Pedido.objects.exclude(estado='cancelado')
        
        # Aplicar filtros de fecha
        if start_date:
            queryset = queryset.filter(fecha_hora__date__gte=start_date)
        if end_date:
            queryset = queryset.filter(fecha_hora__date__lte=end_date)
        
        # Agrupar por fecha
        ventas_diarias = queryset.annotate(
            fecha=TruncDate('fecha_hora')
        ).values('fecha').annotate(
            total_ventas=Sum('total'),
            cantidad_pedidos=Count('id')
        ).order_by('-fecha')
        
        logger.info(f"Reporte generado: {ventas_diarias.count()} días con ventas")
        return ventas_diarias
    
    @staticmethod
    def get_total_pedidos_mesera_hoy():
        """
        Calcula el total de pedidos para cada mesera y usuario en el día actual.
        Formato compatible con el endpoint existente.
        
        Returns:
            list: Lista de diccionarios con id, nombre y total_vendido
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
        
        # Formatear resultado
        resultado = list(ventas_por_mesera)
        for u in ventas_por_usuario:
            resultado.append({
                'id': f"u{u['id']}",
                'nombre': u['username'].upper(),
                'total_vendido': u['total_vendido']
            })
        
        return resultado
    
    @staticmethod
    def get_estadisticas_generales(fecha=None):
        """
        Obtiene estadísticas generales del sistema.
        
        Args:
            fecha: Fecha específica para filtrar (opcional)
            
        Returns:
            dict: Diccionario con estadísticas generales
        """
        fecha_filter = {'fecha_hora__date': fecha} if fecha else {}
        
        pedidos = Pedido.objects.filter(**fecha_filter).exclude(estado='cancelado')
        
        estadisticas = {
            'total_ventas': pedidos.aggregate(total=Sum('total'))['total'] or Decimal('0'),
            'cantidad_pedidos': pedidos.count(),
            'pedidos_pendientes': pedidos.filter(estado='pendiente').count(),
            'pedidos_despachados': pedidos.filter(estado='despachado').count(),
            'pedidos_finalizados': pedidos.filter(estado='finalizada').count(),
            'ticket_promedio': Decimal('0')
        }
        
        # Calcular ticket promedio
        if estadisticas['cantidad_pedidos'] > 0:
            estadisticas['ticket_promedio'] = estadisticas['total_ventas'] / estadisticas['cantidad_pedidos']
        
        logger.info(f"Estadísticas generadas: ${estadisticas['total_ventas']} en {estadisticas['cantidad_pedidos']} pedidos")
        
        return estadisticas
