from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, authentication_classes, action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from ..models import Mesera
from ..serializers import UserSerializer
from ..authentication import GlobalAuthentication, IsSuperUser
from ..services.auth_service import AuthService
from ..services.setup_service import SetupService
import logging
from django.conf import settings

logger = logging.getLogger(__name__)


@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    """
    Vista personalizada para login de Administrativos y Bartenders.
    Las Meseras usan verificar_codigo_mesera.
    """
    authentication_classes = [GlobalAuthentication]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            logger.warning("Login attempt without username or password")
            return Response(
                {'detail': 'Usuario y contraseña son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        result = AuthService.login_user(request, username, password)
        
        if result['success']:
            return Response(result, status=status.HTTP_200_OK)
            
        return Response(result, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@authentication_classes([GlobalAuthentication])
@permission_classes([permissions.AllowAny])
@csrf_exempt
def verificar_codigo_mesera(request):
    """
    Verifica si el código ingresado corresponde a la mesera seleccionada.
    Soporta migración automática de texto plano a hash.
    """
    mesera_id = request.data.get('mesera_id')
    codigo = request.data.get('codigo')

    if not mesera_id or not codigo:
        logger.warning("Verificación de mesera sin mesera_id o código")
        return Response(
            {'detail': 'Se requiere mesera_id y código'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        mesera = get_object_or_404(Mesera, pk=mesera_id)
    except Exception as e:
        logger.error(f"Mesera no encontrada: {mesera_id}")
        return Response(
            {'detail': 'Mesera no encontrada'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if AuthService.verify_mesera_code(mesera, codigo):
        return Response({'success': True}, status=status.HTTP_200_OK)
        
    return Response(
        {'success': False, 'detail': 'Código incorrecto'},
        status=status.HTTP_401_UNAUTHORIZED
    )


@method_decorator(csrf_exempt, name='dispatch')
class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet para la gestión de usuarios por parte del administrador.
    Solo superusuarios pueden gestionar usuarios.
    """
    queryset = User.objects.all().order_by('username')
    serializer_class = UserSerializer
    permission_classes = [IsSuperUser]
    authentication_classes = [GlobalAuthentication]

    def perform_create(self, serializer):
        """Log al crear usuario"""
        user = serializer.save()
        logger.info(f"Usuario creado: {user.username} (ID: {user.id})")
    
    def perform_update(self, serializer):
        """Log al actualizar usuario"""
        user = serializer.save()
        logger.info(f"Usuario actualizado: {user.username} (ID: {user.id})")
    
    def perform_destroy(self, instance):
        """Log al eliminar usuario"""
        logger.warning(f"Usuario eliminado: {instance.username} (ID: {instance.id})")
        instance.delete()

    @action(detail=True, methods=['post'], url_path='cambiar-password')
    def cambiar_password(self, request, pk=None):
        """
        Permite al administrador cambiar la contraseña de un usuario.
        """
        user = self.get_object()
        new_password = request.data.get('password')

        if not new_password:
            logger.warning(f"Intento de cambiar password sin proporcionar password para {user.username}")
            return Response(
                {'detail': 'Se requiere una nueva contraseña.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            AuthService.change_user_password(user, new_password)
            return Response({
                'detail': f'Contraseña de {user.username} actualizada correctamente.'
            })
        except ValueError as e:
            logger.error(f"Error de validación al cambiar password de {user.username}: {e}")
            return Response(
                {'detail': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error inesperado al cambiar password de {user.username}: {e}")
            return Response(
                {'detail': 'Error interno al cambiar la contraseña'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(['GET'])
@permission_classes([IsSuperUser])
def debug_users_view(request):
    """
    Vista de debug para ver información de usuarios en la base de datos.
    Solo accesible por superusuarios.
    """
    try:
        users = User.objects.all().values(
            'id', 'username', 'email', 'is_active', 'is_staff', 'is_superuser'
        )
        db_name = settings.DATABASES['default']['NAME']
        
        logger.info(f"Debug users view accessed by {request.user.username}")
        
        return Response({
            "database_used": str(db_name),
            "user_count": len(users),
            "users": list(users)
        })
    except Exception as e:
        logger.error(f"Error in debug_users_view: {e}", exc_info=True)
        return Response(
            {"error": "Error interno del servidor"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsSuperUser])
def fix_users_view(request):
    """
    Ejecuta la configuración inicial del sistema:
    - Crea/actualiza usuarios por defecto
    - Crea mesas si no existen
    - Crea categorías si no existen
    Solo accesible por superusuarios.
    """
    try:
        logger.info(f"Fix users view accessed by {request.user.username}")
        created_users = SetupService.fix_users_and_data()
        
        return Response({
            "status": "success",
            "actions_performed": created_users
        })
    except Exception as e:
        logger.error(f"Error in fix_users_view: {e}", exc_info=True)
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

