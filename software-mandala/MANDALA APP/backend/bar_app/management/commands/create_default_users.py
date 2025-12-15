from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = 'Crea usuarios por defecto para Admin y Bartender'

    def handle(self, *args, **kwargs):
        # Crear usuario Admin
        if not User.objects.filter(username='admin').exists():
            User.objects.create_user(
                username='admin',
                password='admin123',
                is_staff=True,
                is_superuser=True
            )
            self.stdout.write(self.style.SUCCESS('✓ Usuario admin creado exitosamente'))
        else:
            self.stdout.write(self.style.WARNING('Usuario admin ya existe'))

        # Crear usuario Bartender
        if not User.objects.filter(username='barra').exists():
            User.objects.create_user(
                username='barra',
                password='barra123'
            )
            self.stdout.write(self.style.SUCCESS('✓ Usuario barra creado exitosamente'))
        else:
            self.stdout.write(self.style.WARNING('Usuario barra ya existe'))

        self.stdout.write(self.style.SUCCESS('\nCredenciales:'))
        self.stdout.write('Admin - username: admin, password: admin123')
        self.stdout.write('Bartender - username: barra, password: barra123')
