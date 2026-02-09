from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from ..models import Mesera
from ..serializers import MeseraSerializer
from ..authentication import GlobalAuthentication, IsSuperUser
from ..services.auth_service import AuthService
import logging

logger = logging.getLogger(__name__)


class MeseraViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de meseras.
    Solo administradores pueden crear, editar y eliminar meseras.
    """
    queryset = Mesera.objects.all().order_by('-id')
    serializer_class = MeseraSerializer
    authentication_classes = [GlobalAuthentication]
    permission_classes = [IsSuperUser]  # Solo admin puede gestionar meseras
    
    def perform_create(self, serializer):
        """Log al crear mesera"""
        mesera = serializer.save()
        logger.info(f"Mesera creada: {mesera.nombre} (ID: {mesera.id})")
    
    def perform_update(self, serializer):
        """Log al actualizar mesera"""
        mesera = serializer.save()
        logger.info(f"Mesera actualizada: {mesera.nombre} (ID: {mesera.id})")
    
    def perform_destroy(self, instance):
        """Log al eliminar mesera"""
        logger.warning(f"Mesera eliminada: {instance.nombre} (ID: {instance.id})")
        instance.delete()
    
    @action(detail=True, methods=['post'], url_path='cambiar-codigo')
    def cambiar_codigo(self, request, pk=None):
        """
        Permite al administrador cambiar el PIN de una mesera.
        Solo accesible por superusuarios.
        """
        mesera = self.get_object()
        nuevo_codigo = request.data.get('codigo')

        if not nuevo_codigo:
            logger.warning(f"Intento de cambiar código sin proporcionar código para mesera {mesera.nombre}")
            return Response(
                {'detail': 'El código es requerido.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validar longitud mínima
        nuevo_codigo_str = str(nuevo_codigo).strip()
        if len(nuevo_codigo_str) < 4:
            logger.warning(f"Intento de cambiar código con PIN corto para mesera {mesera.nombre}")
            return Response(
                {'detail': 'El código debe tener al menos 4 caracteres.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Usar el servicio de autenticación
            AuthService.change_mesera_code(mesera, nuevo_codigo_str)
            
            return Response({
                'detail': f'Código de {mesera.nombre} actualizado y encriptado correctamente.'
            })
            
        except ValueError as e:
            logger.error(f"Error de validación al cambiar código de mesera {mesera.nombre}: {e}")
            return Response(
                {'detail': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error inesperado al cambiar código de mesera {mesera.nombre}: {e}")
            return Response(
                {'detail': 'Error interno al cambiar el código'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

