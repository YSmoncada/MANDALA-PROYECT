from django.contrib.auth.models import User, Group
from ..models import Mesa, Categoria

class SetupService:
    @staticmethod
    def fix_users_and_data():
        created_users = []
        
        # 1. Bartender
        group_bartender, _ = Group.objects.get_or_create(name='Bartender')
        if not User.objects.filter(username='barra').exists():
            u = User.objects.create_user('barra', 'barra@example.com', 'barra123')
            u.groups.add(group_bartender)
            created_users.append("barra (PASS: barra123)")
        else:
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

        return created_users
