from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from django.conf import settings
from django.core.files.storage import default_storage
import os
import logging
from ..models import Mesa, EmpresaConfig, Pedido
from ..serializers import MesaSerializer, EmpresaConfigSerializer
from ..authentication import GlobalAuthentication, IsSuperUser

logger = logging.getLogger(__name__)

@api_view(['GET'])
def api_root_view(request):
    return Response({
        "message": "Bienvenido a la API de Mandala Proyect",
        "status": "running"
    })

class DebugStorageView(generics.GenericAPIView):
    def get(self, request):
        storage_class = default_storage.__class__.__name__
        is_cloudinary = 'Cloudinary' in storage_class
        
        return Response({
            'storage_backend': storage_class,
            'is_cloudinary_active': is_cloudinary,
            'cloudinary_cloud_name': os.environ.get('CLOUDINARY_CLOUD_NAME'),
            'default_file_storage_setting': getattr(settings, 'DEFAULT_FILE_STORAGE', 'Not Set'),
            'media_url': settings.MEDIA_URL,
            'debug_mode': settings.DEBUG
        })

class MesaViewSet(viewsets.ModelViewSet):
    queryset = Mesa.objects.all().order_by('numero')
    serializer_class = MesaSerializer
    authentication_classes = [GlobalAuthentication]
    # La validación de número único se ha movido al MesaSerializer.

class EmpresaConfigViewSet(viewsets.ModelViewSet):
    queryset = EmpresaConfig.objects.all()
    serializer_class = EmpresaConfigSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = [GlobalAuthentication]

    def get_queryset(self):
        # Usamos un try-except para evitar errores si la tabla aún no existe durante las migraciones
        try:
            if EmpresaConfig.objects.count() == 0:
                EmpresaConfig.objects.create(nombre="MANDALA DISCO CLUB")
        except Exception:
            pass
        return super().get_queryset()
