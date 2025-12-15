import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User, Group

def ensure_user_and_password(username, password, is_superuser=False, group_name=None):
    try:
        # Get or Create User
        if is_superuser:
            if not User.objects.filter(username=username).exists():
                u = User.objects.create_superuser(username, f'{username}@example.com', password)
                print(f"Superuser '{username}' created.")
            else:
                u = User.objects.get(username=username)
                u.set_password(password)
                u.save()
                print(f"Superuser '{username}' password reset.")
        else:
            if not User.objects.filter(username=username).exists():
                u = User.objects.create_user(username, f'{username}@example.com', password)
                print(f"User '{username}' created.")
            else:
                u = User.objects.get(username=username)
                u.set_password(password)
                u.save()
                print(f"User '{username}' password reset.")
        
        # Assign Group if needed
        if group_name:
            group, _ = Group.objects.get_or_create(name=group_name)
            u.groups.add(group)
            print(f"User '{username}' added to group '{group_name}'.")
            
    except Exception as e:
        print(f"Error handling user '{username}': {e}")

if __name__ == '__main__':
    print("Resetting passwords for 'admin' and 'barra'...")
    ensure_user_and_password('admin', 'admin123', is_superuser=True)
    ensure_user_and_password('barra', 'barra123', is_superuser=False, group_name='Bartender')
    print("Done.")
