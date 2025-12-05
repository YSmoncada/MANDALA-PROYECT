from django.core.management.base import BaseCommand
from bar_app.models import Pedido
from django.core.exceptions import ObjectDoesNotExist

class Command(BaseCommand):
    help = 'Elimina un pedido específico por su ID.'

    def add_arguments(self, parser):
        # Argumento posicional para el ID del pedido
        parser.add_argument('pedido_id', type=int, help='El ID del pedido que se desea eliminar.')

        # Argumento opcional para confirmar la acción
        parser.add_argument(
            '--confirmar',
            action='store_true',
            help='Confirma la eliminación del pedido especificado.',
        )

    def handle(self, *args, **options):
        pedido_id = options['pedido_id']

        if not options['confirmar']:
            self.stdout.write(self.style.WARNING(f'Esta acción es irreversible y eliminará el pedido con ID {pedido_id}.'))
            self.stdout.write(self.style.WARNING('Para confirmar, ejecuta el comando con la opción: --confirmar'))
            return

        num_deleted, _ = Pedido.objects.filter(pk=pedido_id).delete()
        if num_deleted > 0:
            self.stdout.write(self.style.SUCCESS(f'✅ Se eliminó exitosamente el pedido con ID {pedido_id}.'))
        else:
            self.stdout.write(self.style.ERROR(f'❌ No se encontró ningún pedido con el ID {pedido_id}.'))