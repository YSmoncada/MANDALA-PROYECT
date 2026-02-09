from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from django.conf import settings
from django.core.files.storage import default_storage
import os
import logging
from ..models import Mesa, EmpresaConfig
from ..serializers import MesaSerializer, EmpresaConfigSerializer
from ..authentication import GlobalAuthentication, IsSuperUser

logger = logging.getLogger(__name__)


@api_view(['GET'])
def api_root_view(request):
    """
    Vista raíz de la API.
    Retorna información básica del estado de la API.
    """
    return Response({
        "message": "Bienvenido a la API de Mandala Project",
        "status": "running",
        "version": "2.0"
    })


class DebugStorageView(generics.GenericAPIView):
    """
    Vista de debug para verificar la configuración de almacenamiento.
    Útil para verificar si Cloudinary está configurado correctamente.
    """
    permission_classes = [IsSuperUser]
    
    def get(self, request):
        try:
            storage_class = default_storage.__class__.__name__
            is_cloudinary = 'Cloudinary' in storage_class
            
            logger.info(f"Debug storage view accessed by {request.user.username if request.user.is_authenticated else 'anonymous'}")
            
            return Response({
                'storage_backend': storage_class,
                'is_cloudinary_active': is_cloudinary,
                'cloudinary_cloud_name': os.environ.get('CLOUDINARY_CLOUD_NAME', 'Not Set'),
                'default_file_storage_setting': getattr(settings, 'DEFAULT_FILE_STORAGE', 'Not Set'),
                'media_url': settings.MEDIA_URL,
                'debug_mode': settings.DEBUG
            })
        except Exception as e:
            logger.error(f"Error in debug storage view: {e}", exc_info=True)
            return Response(
                {"error": "Error al obtener información de almacenamiento"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class MesaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de mesas.
    Permite CRUD completo de mesas del restaurante/bar.
    """
    queryset = Mesa.objects.all().order_by('numero')
    serializer_class = MesaSerializer
    authentication_classes = [GlobalAuthentication]
    permission_classes = [IsSuperUser]  # Solo admin puede gestionar mesas
    
    def perform_create(self, serializer):
        """Log al crear mesa"""
        mesa = serializer.save()
        logger.info(f"Mesa creada: {mesa.numero} (ID: {mesa.id})")
    
    def perform_update(self, serializer):
        """Log al actualizar mesa"""
        mesa = serializer.save()
        logger.info(f"Mesa actualizada: {mesa.numero} (ID: {mesa.id})")
    
    def perform_destroy(self, instance):
        """Log al eliminar mesa"""
        logger.warning(f"Mesa eliminada: {instance.numero} (ID: {instance.id})")
        instance.delete()


class EmpresaConfigViewSet(viewsets.ModelViewSet):
    """
    ViewSet para configuración de la empresa.
    Gestiona información como nombre, logo, dirección, etc.
    """
    queryset = EmpresaConfig.objects.all()
    serializer_class = EmpresaConfigSerializer
    permission_classes = [permissions.AllowAny]  # Lectura pública, escritura solo admin
    authentication_classes = [GlobalAuthentication]

    def get_queryset(self):
        """
        Crea configuración por defecto si no existe.
        Útil para la primera ejecución del sistema.
        """
        try:
            if EmpresaConfig.objects.count() == 0:
                config = EmpresaConfig.objects.create(nombre="MANDALA DISCO CLUB")
                logger.info(f"Configuración de empresa creada por defecto: {config.nombre}")
        except Exception as e:
            # Ignorar errores durante migraciones
            logger.debug(f"No se pudo crear configuración por defecto (probablemente durante migración): {e}")
            pass
        
        return super().get_queryset()
    
    def perform_update(self, serializer):
        """Log al actualizar configuración"""
        config = serializer.save()
        logger.info(f"Configuración de empresa actualizada: {config.nombre}")

