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
        """
        Autentica un usuario del sistema (admin/bartender/prueba).
        
        Args:
            request: HttpRequest object
            username: Nombre de usuario
            password: Contraseña
            
        Returns:
            dict: Resultado con success, role, token y detalles
        """
        # Validar inputs
        if not username or not password:
            logger.warning("Intento de login sin username o password")
            return {'success': False, 'detail': 'Usuario y contraseña son requeridos'}
        
        # Sanitizar username
        username = str(username).strip().lower()
        
        # Intentar autenticar
        user = authenticate(request, username=username, password=password)
        
        if user:
            if not user.is_active:
                logger.warning(f"Intento de login de usuario inactivo: {username}")
                return {'success': False, 'detail': 'Usuario inactivo'}
            
            login(request, user)  # Establish session
            
            # Determine role
            if user.is_superuser:
                role = 'admin'
            elif user.groups.filter(name='Bartender').exists():
                role = 'bartender'
            elif user.groups.filter(name='Prueba').exists():
                role = 'prueba'
            else:
                role = 'admin'  # Default fallback
            
            # Get or create token
            token, created = Token.objects.get_or_create(user=user)
            
            logger.info(f"Login exitoso: {username} (role: {role})")
            
            return {
                'success': True,
                'role': role,
                'token': token.key,
                'username': user.username,
                'user_id': user.id,
                'detail': f'Bienvenido {user.username}'
            }
        
        # Login fallido
        logger.warning(f"Intento de login fallido para usuario: {username}")
        return {'success': False, 'detail': 'Credenciales inválidas'}

    @staticmethod
    def verify_mesera_code(mesera, codigo_input):
        """
        Verifica el código PIN de una mesera.
        Soporta migración automática de texto plano a hash.
        
        Args:
            mesera: Objeto Mesera
            codigo_input: Código ingresado por el usuario
            
        Returns:
            bool: True si el código es correcto, False en caso contrario
        """
        if not codigo_input:
            logger.warning(f"Intento de verificación sin código para mesera {mesera.nombre}")
            return False
        
        codigo_input = str(codigo_input).strip()
        
        # 1. Intentar validar como Hash (Seguro)
        if check_password(codigo_input, mesera.codigo):
            logger.info(f"Código verificado exitosamente para mesera: {mesera.nombre}")
            return True
        
        # 2. Fallback: Intentar validar como Texto Plano (Legacy)
        if str(mesera.codigo).strip() == codigo_input:
            logger.info(f"Migrando contraseña de mesera {mesera.nombre} a hash seguro")
            mesera.codigo = make_password(codigo_input)
            mesera.save(update_fields=['codigo'])
            return True
        
        logger.warning(f"Código incorrecto para mesera: {mesera.nombre}")
        return False

    @staticmethod
    def change_user_password(user, new_password):
        """
        Cambia la contraseña de un usuario del sistema.
        
        Args:
            user: Objeto User
            new_password: Nueva contraseña
            
        Returns:
            bool: True si se cambió exitosamente
        """
        if not new_password or len(str(new_password).strip()) < 4:
            logger.error(f"Intento de cambiar contraseña con password inválido para {user.username}")
            raise ValueError("La contraseña debe tener al menos 4 caracteres")
        
        user.set_password(new_password)
        user.save(update_fields=['password'])
        
        # Invalidar token anterior para forzar re-login
        Token.objects.filter(user=user).delete()
        
        logger.info(f"Contraseña cambiada exitosamente para usuario: {user.username}")
        return True

    @staticmethod
    def change_mesera_code(mesera, new_code):
        """
        Cambia el código PIN de una mesera.
        
        Args:
            mesera: Objeto Mesera
            new_code: Nuevo código PIN
            
        Returns:
            bool: True si se cambió exitosamente
        """
        new_code_str = str(new_code).strip()
        
        if len(new_code_str) < 4:
            logger.error(f"Intento de cambiar código con PIN inválido para {mesera.nombre}")
            raise ValueError("El código debe tener al menos 4 caracteres")
        
        mesera.codigo = make_password(new_code_str)
        mesera.save(update_fields=['codigo'])
        
        logger.info(f"Código PIN cambiado exitosamente para mesera: {mesera.nombre}")
        return True

