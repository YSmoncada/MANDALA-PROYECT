from django.core.management.base import BaseCommand
from bar_app.models import Pedido

class Command(BaseCommand):
    help = 'Elimina todos los pedidos de la base de datos de forma permanente.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--confirmar',
            action='store_true',
            help='Confirma la eliminación de todos los pedidos.',
        )

    def handle(self, *args, **options):
        if not options['confirmar']:
            self.stdout.write(self.style.WARNING('Esta acción es irreversible y eliminará todos los pedidos.'))
            self.stdout.write(self.style.WARNING('Para confirmar, ejecuta el comando con la opción: --confirmar'))
            return

        num_pedidos, _ = Pedido.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(f'Se eliminaron exitosamente {num_pedidos} pedidos.'))