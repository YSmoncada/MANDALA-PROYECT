#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input

# Ejecutar migraciones automáticamente en cada despliegue
python manage.py migrate

# Opcional: Crear usuarios por defecto si no existen
echo "--- Ejecutando creación de usuarios por defecto ---"
python manage.py create_default_users

# Opcional: Cargar datos iniciales (Mesas/Categorías) si es una DB nueva
echo "--- Ejecutando carga de datos iniciales ---"
python manage.py seed_initial_data