from django.contrib.auth.models import User, Group
from django.db import transaction
from ..models import Mesa, Categoria
import logging

logger = logging.getLogger(__name__)

class SetupService:
    """
    Servicio para configuración inicial del sistema.
    Crea usuarios por defecto y datos iniciales.
    """
    
    # Configuración de usuarios por defecto
    DEFAULT_USERS = {
        'admin': {
            'email': 'yoinermoncadallanos@gmail.com',
            'password': 'admin123',
            'is_superuser': True,
            'is_staff': True,
            'groups': []
        },
        'barra': {
            'email': 'barra@mandala.com',
            'password': 'barra123',
            'is_superuser': False,
            'is_staff': False,
            'groups': ['Bartender']
        },
        'prueba': {
            'email': 'prueba@mandala.com',
            'password': 'prueba123',
            'is_superuser': False,
            'is_staff': False,
            'groups': ['Prueba']
        }
    }
    
    @staticmethod
    def _create_or_update_user(username, config):
        """
        Crea o actualiza un usuario con la configuración especificada.
        
        Args:
            username: Nombre de usuario
            config: Diccionario con configuración del usuario
            
        Returns:
            str: Mensaje de resultado
        """
        try:
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': config['email'],
                    'is_superuser': config['is_superuser'],
                    'is_staff': config['is_staff']
                }
            )
            
            # Actualizar password
            user.set_password(config['password'])
            user.is_superuser = config['is_superuser']
            user.is_staff = config['is_staff']
            user.save()
            
            # Asignar grupos
            for group_name in config['groups']:
                group, _ = Group.objects.get_or_create(name=group_name)
                user.groups.add(group)
            
            action = "creado" if created else "actualizado"
            logger.info(f"Usuario {username} {action} exitosamente")
            
            return f"{username} ({action.capitalize()} - PASS: {config['password']})"
            
        except Exception as e:
            logger.error(f"Error al crear/actualizar usuario {username}: {e}")
            return f"{username} (Error: {str(e)})"
    
    @staticmethod
    def setup_default_users():
        """
        Crea o actualiza todos los usuarios por defecto del sistema.
        
        Returns:
            list: Lista de mensajes de resultado
        """
        results = []
        
        logger.info("Iniciando configuración de usuarios por defecto...")
        
        for username, config in SetupService.DEFAULT_USERS.items():
            result = SetupService._create_or_update_user(username, config)
            results.append(result)
        
        logger.info(f"Configuración de usuarios completada: {len(results)} usuarios procesados")
        return results
    
    @staticmethod
    def setup_default_mesas():
        """
        Crea las mesas por defecto si no existen.
        
        Returns:
            str: Mensaje de resultado
        """
        if Mesa.objects.count() > 0:
            logger.info("Las mesas ya existen, omitiendo creación")
            return "Mesas ya existentes"
        
        try:
            with transaction.atomic():
                # Crear mesas numeradas del 1 al 20
                mesas_creadas = 0
                for i in range(1, 21):
                    Mesa.objects.create(
                        numero=str(i),
                        capacidad=4,  # Capacidad por defecto
                        estado='disponible'
                    )
                    mesas_creadas += 1
                
                # Crear mesa especial de barra
                Mesa.objects.create(
                    numero="BARRA",
                    capacidad=10,
                    estado='disponible'
                )
                mesas_creadas += 1
                
                logger.info(f"{mesas_creadas} mesas creadas exitosamente")
                return f"{mesas_creadas} mesas creadas"
                
        except Exception as e:
            logger.error(f"Error al crear mesas: {e}")
            return f"Error al crear mesas: {str(e)}"
    
    @staticmethod
    def setup_default_categorias():
        """
        Crea las categorías por defecto si no existen.
        
        Returns:
            str: Mensaje de resultado
        """
        if Categoria.objects.count() > 0:
            logger.info("Las categorías ya existen, omitiendo creación")
            return "Categorías ya existentes"
        
        categorias_default = [
            "Cervezas",
            "Licores",
            "Cócteles",
            "Bebidas sin Alcohol",
            "Comidas",
            "Varios"
        ]
        
        try:
            with transaction.atomic():
                for nombre in categorias_default:
                    Categoria.objects.create(nombre=nombre)
                
                logger.info(f"{len(categorias_default)} categorías creadas exitosamente")
                return f"{len(categorias_default)} categorías creadas"
                
        except Exception as e:
            logger.error(f"Error al crear categorías: {e}")
            return f"Error al crear categorías: {str(e)}"
    
    @staticmethod
    def fix_users_and_data():
        """
        Método principal que ejecuta toda la configuración inicial.
        Crea usuarios, mesas y categorías por defecto.
        
        Returns:
            list: Lista de mensajes de resultado de todas las operaciones
        """
        logger.info("=== Iniciando configuración inicial del sistema ===")
        
        results = []
        
        # 1. Configurar usuarios
        user_results = SetupService.setup_default_users()
        results.extend(user_results)
        
        # 2. Configurar mesas
        mesa_result = SetupService.setup_default_mesas()
        results.append(mesa_result)
        
        # 3. Configurar categorías
        categoria_result = SetupService.setup_default_categorias()
        results.append(categoria_result)
        
        logger.info("=== Configuración inicial completada ===")
        
        return results
