from django.db import transaction, models
from django.db.models import F
from django.utils import timezone
from datetime import timedelta
from ..models import Pedido, PedidoProducto, Producto, Mesa
from ..serializers import PedidoSerializer
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

class OrderService:
    @staticmethod
    def process_order_update(instance, previous_estado):
        """
        Maneja actualizaciones de estado:
        1. Si pasa a 'despachado': Descuenta stock de lo pendiente.
        2. Si pasa a 'cancelado': Devuelve stock de lo que se había despachado.
        """
        with transaction.atomic():
            # CASO 1: COMPLETAR / DESPACHAR
            if instance.estado == 'despachado' and previous_estado != 'despachado':
                # Actualizar cada item para que esté totalmente despachado y DESCONTAR STOCK
                for item in instance.pedidoproducto_set.all():
                    pendiente_de_despacho = item.cantidad - item.cantidad_despachada
                    
                    if pendiente_de_despacho > 0:
                        producto = item.producto
                        producto.stock -= pendiente_de_despacho
                        producto.save()
                        
                        item.cantidad_despachada = item.cantidad
                        item.save()

            # CASO 2: CANCELAR
            elif instance.estado == 'cancelado' and previous_estado != 'cancelado':
                # Devolver al inventario SOLO lo que se había despachado/descontado
                for item in instance.pedidoproducto_set.all():
                    if item.cantidad_despachada > 0:
                        producto = item.producto
                        producto.stock += item.cantidad_despachada
                        producto.save()
                        
                        # Resetear contador para evitar doble devolución si se borra el historial después
                        item.cantidad_despachada = 0
                        item.save()

    @staticmethod
    def add_products_to_existing_order(mesa_id, products_data, serializer_context):
        # Buscar un pedido activo para esta mesa (pendiente, despachado o en_proceso)
        # Excluimos cancelado y finalizada
        # Y filtramos por FECHA ACTUAL para no tomar pedidos viejos olvidados
        today = timezone.localdate()
        pedido_activo = Pedido.objects.filter(
            mesa_id=mesa_id,
            fecha_hora__date=today
        ).exclude(
            estado__in=['cancelado', 'finalizada']
        ).order_by('-fecha_hora').first()

        if not pedido_activo:
            logger.warning(f"No se encontró pedido activo para mesa {mesa_id} con force_append=True.")
            return None

        logger.info(f"Agregando productos al pedido existente #{pedido_activo.id}")
        
        try:
            with transaction.atomic():
                # Bloquear el pedido para edición segura
                pedido = Pedido.objects.select_for_update().get(pk=pedido_activo.id)
                
                # Si el pedido estaba "despachado", significa que todo lo anterior ya fue entregado.
                # Debemos asegurar que los items existentes estén marcados como despachados
                # ANTES de agregar lo nuevo, para que no aparezcan como nuevos.
                if pedido.estado == 'despachado':
                    for old_item in pedido.pedidoproducto_set.all():
                        if old_item.cantidad_despachada < old_item.cantidad:
                            old_item.cantidad_despachada = old_item.cantidad
                            old_item.save()

                total_agregado = 0
                
                for item in products_data:
                    producto_id = item.get('producto_id')
                    cantidad = int(item.get('cantidad', 0))
                    
                    if cantidad <= 0:
                        continue

                    producto = Producto.objects.select_for_update().get(pk=producto_id)
                    
                    # Buscar si el producto ya está en el pedido
                    pedido_producto, created = PedidoProducto.objects.get_or_create(
                        pedido=pedido,
                        producto=producto,
                        defaults={
                            'cantidad': 0,
                            'precio_unitario': producto.precio
                        }
                    )
                    
                    # Actualizar cantidad en el pedido
                    pedido_producto.cantidad += cantidad
                    pedido_producto.save()
                    
                    # Sumar al total
                    total_agregado += producto.precio * cantidad

                # Actualizar total del pedido
                pedido.total += total_agregado
                
                # IMPORTANTE: Resetear estado a 'pendiente' para que el bartender lo vea de nuevo
                # Solo si no estaba ya pendiente, para asegurar que se note el cambio
                pedido.estado = 'pendiente'
                pedido.save()
                
                # Serializar y devolver
                serializer = PedidoSerializer(pedido, context=serializer_context)
                return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error al agregar productos al pedido: {e}")
            return Response(
                {"detail": "Error al actualizar el pedido existente."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @staticmethod
    def delete_order_history(queryset):
        if not queryset.exists():
            return Response({"detail": "No hay pedidos que coincidan con los filtros para eliminar."}, status=status.HTTP_404_NOT_FOUND)

        try:
            with transaction.atomic():
                pedidos_a_eliminar = list(queryset) # Convertir a lista para poder contar
                count = len(pedidos_a_eliminar)

                for pedido in pedidos_a_eliminar:
                    # Por cada pedido, devolvemos el stock SOLO de lo que se haya despachado
                    for item in pedido.pedidoproducto_set.all():
                        if item.cantidad_despachada > 0:
                            producto = item.producto
                            producto.stock += item.cantidad_despachada
                            producto.save()
                
                # Después de revertir el stock, eliminamos los pedidos.
                queryset.delete()
                
            return Response({"detail": f"Se eliminaron {count} pedidos exitosamente y se restauró el stock."}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error al intentar borrar el historial de pedidos: {e}")
            return Response({"detail": "Ocurrió un error al intentar eliminar el historial. No se realizaron cambios."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @staticmethod
    def despachar_producto(pedido, item_id):
        try:
            item = PedidoProducto.objects.get(id=item_id, pedido=pedido)
        except PedidoProducto.DoesNotExist:
             return {"error": "Producto no encontrado en este pedido", "status": status.HTTP_404_NOT_FOUND}

        try:
            with transaction.atomic():
                # Descontar stock del item si aún falta por despachar
                pendiente = item.cantidad - item.cantidad_despachada
                if pendiente > 0:
                    item.producto.stock -= pendiente
                    item.producto.save()

                # Actualizar cantidad despachada
                item.cantidad_despachada = item.cantidad
                item.save()
                
                # Verificar si todos los productos del pedido han sido despachados completely
                # (usamos item.cantidad <= item.cantidad_despachada para ser seguros)
                all_dispatched = not pedido.pedidoproducto_set.filter(cantidad__gt=models.F('cantidad_despachada')).exists()
                
                if all_dispatched:
                    pedido.estado = 'despachado'
                    pedido.save()
                    msg = "Producto despachado. Pedido completado."
                else:
                    msg = "Producto despachado."
                    
            return {"detail": msg, "pedido_estado": pedido.estado, "status": status.HTTP_200_OK}
            
        except Exception as e:
            logger.error(f"Error al despachar producto: {e}")
            return {"error": "Error interno al despachar producto", "status": status.HTTP_500_INTERNAL_SERVER_ERROR}
