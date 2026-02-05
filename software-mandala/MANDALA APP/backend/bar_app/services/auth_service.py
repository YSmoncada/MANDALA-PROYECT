from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password, make_password
from rest_framework.authtoken.models import Token
from ..models import Mesera
import logging

logger = logging.getLogger(__name__)

class AuthService:
    @staticmethod
    def login_user(request, username, password):
        user = authenticate(request, username=username, password=password)
        
        if user:
            login(request, user) # Establish session
            
            # Determine role
            if user.is_superuser:
                role = 'admin'
            elif user.groups.filter(name='Bartender').exists():
                role = 'bartender'
            elif user.groups.filter(name='Prueba').exists():
                role = 'prueba'
            else:
                role = 'admin' # Default fallback
            
            token, _ = Token.objects.get_or_create(user=user)
            
            return {
                'success': True,
                'role': role,
                'token': token.key,
                'username': user.username,
                'user_id': user.id,
                'detail': f'Bienvenido {user.username}'
            }
            
        return {'success': False, 'detail': 'Credenciales inválidas'}

    @staticmethod
    def verify_mesera_code(mesera, codigo_input):
        codigo_input = str(codigo_input).strip()
        
        # 1. Intentar validar como Hash (Seguro)
        if check_password(codigo_input, mesera.codigo):
            return True
        
        # 2. Fallback: Intentar validar como Texto Plano (Legacy)
        if str(mesera.codigo).strip() == codigo_input:
            logger.info(f"Migrando contraseña de mesera {mesera.nombre} a hash seguro.")
            mesera.codigo = make_password(codigo_input)
            mesera.save()
            return True
            
        return False

    @staticmethod
    def change_user_password(user, new_password):
        user.set_password(new_password)
        user.save()
        return True

    @staticmethod
    def change_mesera_code(mesera, new_code):
        mesera.codigo = make_password(str(new_code).strip())
        mesera.save()
        return True
