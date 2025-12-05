from django.core.management.base import BaseCommand
from bar_app.models import Pedido, Mesa

class Command(BaseCommand):
    help = 'Borra todo el historial de pedidos y libera las mesas'

    def handle(self, *args, **kwargs):
        # Borrar todos los pedidos
        count, _ = Pedido.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(f'Se borraron {count} pedidos.'))

        # Restablecer estado de mesas
        mesas_count = Mesa.objects.update(estado='disponible')
        self.stdout.write(self.style.SUCCESS(f'Se restablecieron {mesas_count} mesas a "disponible".'))
