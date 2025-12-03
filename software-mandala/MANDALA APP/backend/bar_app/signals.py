# from django.db.models.signals import pre_save, pre_delete
# from django.dispatch import receiver
# from .models import Producto
# import os
# from django.conf import settings
import logging

logger = logging.getLogger(__name__)

# Ya no se necesita la lógica para eliminar imágenes locales,
# ya que ahora se almacenan en Cloudinary como una URL.
