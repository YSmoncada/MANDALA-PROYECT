from django.core.management.base import BaseCommand
from django.utils import timezone
from bar_app.models import Pedido, PedidoProducto, Producto, Mesera, Mesa
import random

class Command(BaseCommand):
    help = 'Crea un pedido de prueba en una fecha específica para testear filtros.'

    def handle(self, *args, **options):
        # 1. Obtener los componentes necesarios
        try:
            # Tomar cualquier mesera, mesa y producto que exista
            mesera = Mesera.objects.first()
            mesa = Mesa.objects.first()
            producto = Producto.objects.filter(stock__gt=0).first() # Un producto con stock

            if not all([mesera, mesa, producto]):
                self.stdout.write(self.style.ERROR('No se encontraron suficientes datos (mesera, mesa o producto con stock) para crear el pedido.'))
                return

        except (Mesera.DoesNotExist, Mesa.DoesNotExist, Producto.DoesNotExist):
            self.stdout.write(self.style.ERROR('Asegúrate de tener al menos una mesera, una mesa y un producto creados.'))
            return

        # 2. Definir los detalles del pedido
        cantidad = random.randint(1, 2)
        total_pedido = producto.precio * cantidad
        
        # La fecha deseada: 8 del mes y año actual.
        now = timezone.now()
        fecha_pedido = now.replace(day=8, hour=10, minute=30, second=0, microsecond=0)

        # 3. Crear el Pedido
        # auto_now_add se establece en la creación, así que lo creamos y luego lo actualizamos.
        pedido = Pedido.objects.create(
            mesera=mesera,
            mesa=mesa,
            estado='despachado', # Estado solicitado para pruebas
            total=total_pedido
        )

        # 4. Crear el PedidoProducto asociado
        PedidoProducto.objects.create(
            pedido=pedido,
            producto=producto,
            cantidad=cantidad
        )

        # 5. Actualizar la fecha del pedido a la fecha deseada
        pedido.fecha_hora = fecha_pedido
        pedido.save()
        
        self.stdout.write(self.style.SUCCESS(f'✅ Pedido de prueba creado exitosamente para la fecha: {fecha_pedido.strftime("%Y-%m-%d")}'))