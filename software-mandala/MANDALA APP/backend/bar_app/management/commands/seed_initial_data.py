from django.core.management.base import BaseCommand
from bar_app.models import Categoria, Mesa, Producto

class Command(BaseCommand):
    help = 'Carga datos iniciales (Mesas y Categorías) para una base de datos nueva'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('--- Iniciando carga de datos base ---'))

        # 1. Crear Categorías Básicas
        categorias_base = ['Cervezas', 'Cocteles', 'Licores', 'Bebidas_sin_alcohol', 'Varios', 'Comida']
        for cat_nombre in categorias_base:
            cat, created = Categoria.objects.get_or_create(nombre=cat_nombre)
            if created:
                self.stdout.write(f'- Categoría creada: {cat_nombre}')
        
        # 2. Crear Mesas (1 a 20)
        for i in range(1, 21):
            numero = str(i)
            mesa, created = Mesa.objects.get_or_create(numero=numero)
            # Asegurar que esté disponible si se acaba de crear
            if created:
                mesa.estado = 'disponible'
                mesa.save()
                # No imprimimos 20 líneas para no ensuciar el log, solo resumen al final
        
        self.stdout.write(f'- Se aseguraron Mesas del 1 al 20.')

        # 3. Crear Mesas Especiales (Barra, VIP)
        Mesa.objects.get_or_create(numero="BARRA", defaults={'capacidad': 10})
        Mesa.objects.get_or_create(numero="VIP", defaults={'capacidad': 10})
        self.stdout.write(f'- Mesas especiales BARRA y VIP verificadas.')

        self.stdout.write(self.style.SUCCESS('--- Carga de datos base finalizada ---'))
