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
    authentication_classes = [GlobalAuthentication]
    """
    Vista personalizada para login de Administrativos y Bartenders.
    Las Meseras siguen usando su código PIN (validado en frontend por ahora).
    """
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        result = AuthService.login_user(request, username, password)
        
        if result['success']:
            return Response(result)
            
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
        return Response({'detail': 'Faltan datos'}, status=status.HTTP_400_BAD_REQUEST)

    mesera = get_object_or_404(Mesera, pk=mesera_id)
    
    if AuthService.verify_mesera_code(mesera, codigo):
        return Response({'success': True})
        
    return Response({'success': False, 'detail': 'Código incorrecto'}, status=status.HTTP_401_UNAUTHORIZED)

@method_decorator(csrf_exempt, name='dispatch')
class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet para la gestión de usuarios por parte del administrador.
    """
    queryset = User.objects.all().order_by('username')
    serializer_class = UserSerializer
    permission_classes = [IsSuperUser]
    authentication_classes = [GlobalAuthentication]

    @action(detail=True, methods=['post'], url_path='cambiar-password')
    def cambiar_password(self, request, pk=None):
        user = self.get_object()
        new_password = request.data.get('password')

        if not new_password:
            return Response({'detail': 'Se requiere una nueva contraseña.'}, status=status.HTTP_400_BAD_REQUEST)

        AuthService.change_user_password(user, new_password)

        return Response({'detail': f'Contraseña de {user.username} actualizada correctamente.'})

@api_view(['GET'])
@permission_classes([IsSuperUser])
def debug_users_view(request):
    try:
        users = User.objects.all().values('id', 'username', 'email', 'is_active', 'is_staff', 'is_superuser')
        db_name = settings.DATABASES['default']['NAME']
        return Response({
            "database_used": str(db_name),
            "user_count": len(users),
            "users": list(users)
        })
    except Exception as e:
        logger.error(f"Error in debug_users_view: {e}")
        return Response({"error": "Error interno del servidor"}, status=500)

@api_view(['GET'])
@permission_classes([IsSuperUser])
def fix_users_view(request):
    try:
        created_users = SetupService.fix_users_and_data()
        return Response({
            "status": "success",
            "actions_performed": created_users
        })
    except Exception as e:
        return Response({"error": str(e)}, status=500)
