from django.db.models.signals import pre_save, pre_delete
from django.dispatch import receiver
from .models import Producto
import os
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


@receiver(pre_save, sender=Producto)
def delete_old_image_on_update(sender, instance, **kwargs):
    """
    Elimina la imagen anterior cuando se actualiza un producto con una nueva imagen
    """
    if not instance.pk:
        # Es una nueva instancia, no hay imagen anterior que eliminar
        return
    
    try:
        # Obtener la instancia actual de la base de datos
        old_instance = Producto.objects.get(pk=instance.pk)
        old_image = old_instance.imagen
        new_image = instance.imagen
        
        # Condiciones para eliminar imagen anterior:
        # 1. Hay imagen anterior
        # 2. Y (no hay nueva imagen O la nueva imagen es diferente)
        if old_image and (not new_image or old_image != new_image):
            delete_image_file(old_image)
            logger.info(f"Imagen anterior eliminada para producto {instance.nombre}")
            
    except Producto.DoesNotExist:
        # La instancia no existe en la DB, es nueva
        pass
    except Exception as e:
        logger.error(f"Error en signal pre_save: {e}")


@receiver(pre_delete, sender=Producto)
def delete_image_on_product_delete(sender, instance, **kwargs):
    """
    Elimina la imagen cuando se elimina un producto
    """
    if instance.imagen:
        delete_image_file(instance.imagen)
        logger.info(f"Imagen eliminada al eliminar producto {instance.nombre}")


def delete_image_file(image_field):
    """
    Función helper para eliminar físicamente el archivo de imagen
    """
    if not image_field:
        return
        
    try:
        # Construir la ruta completa del archivo
        image_path = os.path.join(settings.MEDIA_ROOT, str(image_field))
        
        # Verificar si el archivo existe y eliminarlo
        if os.path.exists(image_path):
            os.remove(image_path)
            logger.info(f"✅ Imagen eliminada automáticamente: {image_path}")
            print(f"✅ Imagen eliminada automáticamente: {image_path}")
        else:
            logger.warning(f"⚠️ Imagen no encontrada para eliminar: {image_path}")
            
    except PermissionError as e:
        logger.error(f"❌ Sin permisos para eliminar imagen: {image_path} - {e}")
    except Exception as e:
        logger.error(f"❌ Error al eliminar imagen automáticamente: {e}")

# Signal adicional para manejar casos donde se actualiza solo el campo imagen a vacío
@receiver(pre_save, sender=Producto)
def handle_image_field_cleared(sender, instance, **kwargs):
    """
    Maneja el caso donde se limpia el campo imagen (se pone en blanco/null)
    """
    if not instance.pk:
        return
        
    try:
        old_instance = Producto.objects.get(pk=instance.pk)
        
        # Si había imagen y ahora no hay (campo limpiado)
        if old_instance.imagen and not instance.imagen:
            delete_image_file(old_instance.imagen)
            logger.info(f"Imagen eliminada al limpiar campo para producto {instance.nombre}")
            
    except Producto.DoesNotExist:
        pass
    except Exception as e:
        logger.error(f"Error en signal handle_image_field_cleared: {e}")
