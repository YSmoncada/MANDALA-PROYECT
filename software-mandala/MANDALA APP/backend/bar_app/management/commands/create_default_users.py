from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group


class Command(BaseCommand):
    help = 'Crea usuarios por defecto para Admin, Bartender y Prueba'

    def handle(self, *args, **kwargs):
        # Asegurar que existan los grupos
        group_bartender, _ = Group.objects.get_or_create(name='Bartender')
        group_prueba, _ = Group.objects.get_or_create(name='Prueba')

        # Definir los usuarios a crear/actualizar
        users_to_create = [
            {
                'username': 'admin',
                'password': 'admin123',
                'is_staff': True,
                'is_superuser': True,
                'groups': []
            },
            {
                'username': 'barra',
                'password': 'barra123',
                'is_staff': False,
                'is_superuser': False,
                'groups': [group_bartender]
            },
            {
                'username': 'prueba',
                'password': 'prueba123',
                'is_staff': False,
                'is_superuser': False,
                'groups': [group_prueba]
            }
        ]

        self.stdout.write(self.style.SUCCESS('--- Configurando usuarios del sistema ---'))

        for u_data in users_to_create:
            user, created = User.objects.get_or_create(username=u_data['username'])
            user.set_password(u_data['password'])
            user.is_staff = u_data['is_staff']
            user.is_superuser = u_data['is_superuser']
            user.save()

            # Asignar grupos
            if u_data['groups']:
                user.groups.set(u_data['groups'])
            
            status = "creado" if created else "actualizado"
            self.stdout.write(self.style.SUCCESS(f'* Usuario {u_data["username"]} {status} exitosamente (Pass: {u_data["password"]})'))

        self.stdout.write(self.style.SUCCESS('--- Configuración finalizada ---'))
