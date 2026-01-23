
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from bar_app.views import ProductoViewSet
from bar_app import views
from bar_app.views import MovimientoViewSet, MeseraTotalPedidosView, DebugStorageView, ReporteVentasDiariasView # Importamos la nueva vista
from bar_app.views import PedidoViewSet, MesaViewSet, MeseraViewSet, UserViewSet, EmpresaConfigViewSet
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

router = DefaultRouter()
router.register(r'productos', ProductoViewSet)
router.register(r'movimientos', MovimientoViewSet, basename='movimiento')
router.register(r'pedidos', PedidoViewSet, basename='pedido')
router.register(r'mesas', MesaViewSet, basename='mesa')
router.register(r'meseras', MeseraViewSet, basename='mesera')
router.register(r'usuarios', UserViewSet, basename='usuario')
router.register(r'config', EmpresaConfigViewSet, basename='config')

urlpatterns = [
    path('', views.api_root_view, name='api-root'),
    path('admin/', admin.site.urls),
    # Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    path('api/debug-storage/', DebugStorageView.as_view(), name='debug-storage'), # URL de debug
    path('api/debug-users/', views.debug_users_view, name='debug-users'),
    path('api/fix-users/', views.fix_users_view, name='fix-users'),


    path('api/meseras/total-pedidos/', MeseraTotalPedidosView.as_view(), name='mesera-total-pedidos'), # URL específica primero
    path('api/reportes/ventas-diarias/', ReporteVentasDiariasView.as_view(), name='reporte-ventas-diarias'),
    path('api/login/', views.LoginView.as_view(), name='login'), # Login Admin/Bartender
    path('api/verificar-codigo-mesera/', views.verificar_codigo_mesera, name='verificar-codigo-mesera'), # Verificación segura de PIN
    path('api/total-pedidos-mesera-hoy/', views.total_pedidos_mesera_hoy, name='total-pedidos-mesera-hoy'),
    path('api/', include(router.urls)), # Restauramos el prefijo 'api/'
]

# Servir archivos media en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
