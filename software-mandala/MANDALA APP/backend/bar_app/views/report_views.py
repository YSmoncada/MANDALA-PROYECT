from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..serializers import MeseraTotalPedidosSerializer
from ..services.report_service import ReportService


class MeseraTotalPedidosView(generics.ListAPIView):
    """
    Vista para obtener el total de ventas por mesera/usuario.
    Soporta filtro por fecha.
    """
    serializer_class = MeseraTotalPedidosSerializer

    def get_queryset(self):
        fecha_str = self.request.query_params.get('fecha', None)
        return ReportService.get_ventas_por_vendedor(fecha=fecha_str)

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

        ventas_diarias = ReportService.get_ventas_diarias(
            start_date=start_date,
            end_date=end_date
        )

        return Response(ventas_diarias)


@api_view(['GET'])
def total_pedidos_mesera_hoy(request):
    """
    Calcula el total de pedidos para cada mesera (y sistema) en el día actual.
    """
    resultado = ReportService.get_total_pedidos_mesera_hoy()
    return Response(resultado)


