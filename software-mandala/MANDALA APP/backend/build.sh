#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input

# Ejecutar migraciones automáticamente en cada despliegue
python manage.py makemigrations
python manage.py migrate

# Opcional: Crear usuarios por defecto si no existen
# python manage.py create_default_users