from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, authentication_classes, action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password, check_password
from ..models import Mesera, Categoria, Mesa
from ..serializers import UserSerializer
from .core_views import GlobalAuthentication, IsSuperUser
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
        from django.contrib.auth import login
        username = request.data.get('username')
        password = request.data.get('password')
        
        # Validar credenciales contra el sistema de usuarios de Django
        user = authenticate(request, username=username, password=password)
        
        if user:
            login(request, user) # Establish session
            
            # Determinar rol basado en grupos
            if user.is_superuser:
                role = 'admin'
            elif user.groups.filter(name='Bartender').exists():
                role = 'bartender'
            elif user.groups.filter(name='Prueba').exists():
                role = 'prueba'
            else:
                role = 'admin' # Default fallback

            
            from rest_framework.authtoken.models import Token
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'success': True,
                'role': role,
                'token': token.key,
                'username': user.username,
                'user_id': user.id, # Enviamos el ID real del usuario de Django
                'detail': f'Bienvenido {user.username}'
            })
            
        return Response({
            'success': False,
            'detail': 'Credenciales inválidas'
        }, status=status.HTTP_401_UNAUTHORIZED)

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
    codigo_input = str(codigo).strip()
    
    # 1. Intentar validar como Hash (Seguro)
    if check_password(codigo_input, mesera.codigo):
        return Response({'success': True})
    
    # 2. Fallback: Intentar validar como Texto Plano (Legacy)
    # Si coincide, actualizamos a Hash inmediatamente para que la próxima vez sea seguro.
    if str(mesera.codigo).strip() == codigo_input:
        logger.info(f"Migrando contraseña de mesera {mesera.nombre} a hash seguro.")
        mesera.codigo = make_password(codigo_input)
        mesera.save()
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

        user.set_password(new_password)
        user.save()

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
        from django.contrib.auth.models import User, Group
        created_users = []
        
        # 1. Bartender
        group_bartender, _ = Group.objects.get_or_create(name='Bartender')
        if not User.objects.filter(username='barra').exists():
            u = User.objects.create_user('barra', 'barra@example.com', 'barra123')
            u.groups.add(group_bartender)
            created_users.append("barra (PASS: barra123)")
        else:
            # Force reset password
            u = User.objects.get(username='barra')
            u.set_password('barra123')
            u.save()
            created_users.append("barra (Reset Pass: barra123)")

        # 2. Prueba
        group_prueba, _ = Group.objects.get_or_create(name='Prueba')
        if not User.objects.filter(username='prueba').exists():
            u = User.objects.create_user('prueba', 'prueba@example.com', 'prueba123')
            u.groups.add(group_prueba)
            created_users.append("prueba (PASS: prueba123)")
        else:
            u = User.objects.get(username='prueba')
            u.set_password('prueba123')
            u.save()
            created_users.append("prueba (Reset Pass: prueba123)")

        # 3. Admin
        # 3. Admin
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
            created_users.append("admin (PASS: admin123)")
        else:
            u = User.objects.get(username='admin')
            u.set_password('admin123')
            u.is_staff = True
            u.is_superuser = True
            u.save()
            created_users.append("admin (Reset Pass: admin123)")

        
        # 4. Datos Iniciales (Mesas/Categorias)
        if Mesa.objects.count() == 0:
             for i in range(1, 21):
                Mesa.objects.get_or_create(numero=str(i), defaults={'estado': 'disponible'})
             Mesa.objects.get_or_create(numero="BARRA", defaults={'capacidad': 10})
             created_users.append("Mesas creadas")
        
        if Categoria.objects.count() == 0:
            Categoria.objects.create(nombre="Cervezas")
            Categoria.objects.create(nombre="Varios")
            created_users.append("Categorias creadas")

        return Response({
            "status": "success",
            "actions_performed": created_users
        })
    except Exception as e:
        return Response({"error": str(e)}, status=500)
