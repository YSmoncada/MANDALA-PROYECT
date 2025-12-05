from django.core.management.base import BaseCommand
from django.conf import settings
from bar_app.models import Producto
import os


class Command(BaseCommand):
    help = 'Limpia imágenes huérfanas (archivos que no están asociados a ningún producto)'
    
    def handle(self, *args, **options):
        """
        Busca y elimina archivos de imagen que no están asociados a ningún producto
        """
        productos_media_path = os.path.join(settings.MEDIA_ROOT, 'productos')
        
        if not os.path.exists(productos_media_path):
            self.stdout.write(self.style.WARNING('No existe el directorio de productos'))
            return
        
        # Obtener todas las imágenes referenciadas en la base de datos
        imagenes_bd = set()
        for producto in Producto.objects.exclude(imagen__isnull=True).exclude(imagen=''):
            imagen_path = str(producto.imagen).replace('productos/', '')
            imagenes_bd.add(imagen_path)
        
        # Obtener todos los archivos en el directorio
        archivos_directorio = set()
        for archivo in os.listdir(productos_media_path):
            archivo_path = os.path.join(productos_media_path, archivo)
            if os.path.isfile(archivo_path):
                archivos_directorio.add(archivo)
        
        # Encontrar archivos huérfanos
        archivos_huerfanos = archivos_directorio - imagenes_bd
        
        eliminados = 0
        for archivo_huerfano in archivos_huerfanos:
            try:
                archivo_completo = os.path.join(productos_media_path, archivo_huerfano)
                os.remove(archivo_completo)
                eliminados += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Eliminado: {archivo_huerfano}')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error eliminando {archivo_huerfano}: {e}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'Proceso completado. {eliminados} archivos eliminados.')
        )
