
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from bar_app.views import ProductoViewSet
from bar_app import views
from bar_app.views import MovimientoViewSet, MeseraTotalPedidosView, DebugStorageView, ClearOrdersView # Importamos la nueva vista
from bar_app.views import PedidoViewSet, MesaViewSet, MeseraViewSet

router = DefaultRouter()
router.register(r'productos', ProductoViewSet)
router.register(r'movimientos', MovimientoViewSet, basename='movimiento')
router.register(r'pedidos', PedidoViewSet, basename='pedido')
router.register(r'mesas', MesaViewSet, basename='mesa')
router.register(r'meseras', MeseraViewSet, basename='mesera')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/debug-storage/', DebugStorageView.as_view(), name='debug-storage'), # URL de debug
    path('api/meseras/total-pedidos/', MeseraTotalPedidosView.as_view(), name='mesera-total-pedidos'), # URL específica primero
    path('api/admin/clear-orders-force/', ClearOrdersView.as_view(), name='clear-orders'), # BORRADO DE EMERGENCIA
    path('api/', include(router.urls)), # Restauramos el prefijo 'api/'
]

# Servir archivos media en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
