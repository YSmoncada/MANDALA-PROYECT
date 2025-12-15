import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User, Group

# 1. Ensure Groups Exist
bartender_group, created = Group.objects.get_or_create(name='Bartender')
if created:
    print("✅ Group 'Bartender' created.")
else:
    print("ℹ️ Group 'Bartender' already exists.")

# 2. Ensure Admin User Exists
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print("✅ Superuser 'admin' created with password 'admin123'.")
else:
    print("ℹ️ Superuser 'admin' already exists.")

# 3. Ensure Bartender User Exists
if not User.objects.filter(username='barra').exists():
    u = User.objects.create_user('barra', 'barra@example.com', 'barra123')
    bartender_group.user_set.add(u)
    print("✅ User 'barra' created with password 'barra123' and added to 'Bartender' group.")
else:
    print("ℹ️ User 'barra' already exists.")

print("Setup Complete.")
