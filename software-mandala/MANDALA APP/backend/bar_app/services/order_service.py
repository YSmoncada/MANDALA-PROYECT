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
    # Constantes de estado
    ESTADO_PENDIENTE = 'pendiente'
    ESTADO_DESPACHADO = 'despachado'
    ESTADO_FINALIZADA = 'finalizada'
    ESTADO_CANCELADO = 'cancelado'
    
    ESTADOS_ACTIVOS = [ESTADO_PENDIENTE, ESTADO_DESPACHADO]
    ESTADOS_CERRADOS = [ESTADO_CANCELADO, ESTADO_FINALIZADA]
    
    @staticmethod
    def _descontar_stock_pendiente(pedido):
        """
        Descuenta del stock la cantidad pendiente de despachar de cada item.
        Usado cuando un pedido pasa a estado 'despachado'.
        """
        items_actualizados = 0
        for item in pedido.items.select_related('producto'):
            pendiente_de_despacho = item.pendiente_despacho
            
            if pendiente_de_despacho > 0:
                producto = item.producto
                producto.stock -= pendiente_de_despacho
                producto.save(update_fields=['stock'])
                
                item.cantidad_despachada = item.cantidad
                item.save(update_fields=['cantidad_despachada'])
                items_actualizados += 1
        
        logger.info(f"Pedido #{pedido.id}: Stock descontado para {items_actualizados} items")
        return items_actualizados
    
    @staticmethod
    def _devolver_stock_despachado(pedido):
        """
        Devuelve al stock la cantidad que había sido despachada.
        Usado cuando un pedido se cancela.
        """
        items_revertidos = 0
        for item in pedido.items.select_related('producto'):
            if item.cantidad_despachada > 0:
                producto = item.producto
                producto.stock += item.cantidad_despachada
                producto.save(update_fields=['stock'])
                
                # Resetear contador para evitar doble devolución
                item.cantidad_despachada = 0
                item.save(update_fields=['cantidad_despachada'])
                items_revertidos += 1
        
        logger.info(f"Pedido #{pedido.id}: Stock devuelto para {items_revertidos} items")
        return items_revertidos
    
    @staticmethod
    def process_order_update(instance, previous_estado):
        """
        Maneja actualizaciones de estado:
        1. Si pasa a 'despachado': Descuenta stock de lo pendiente.
        2. Si pasa a 'cancelado': Devuelve stock de lo que se había despachado.
        """
        if instance.estado == previous_estado:
            return  # Sin cambio de estado
        
        with transaction.atomic():
            # CASO 1: COMPLETAR / DESPACHAR
            if instance.estado == OrderService.ESTADO_DESPACHADO and previous_estado != OrderService.ESTADO_DESPACHADO:
                logger.info(f"Pedido #{instance.id}: Cambiando a DESPACHADO desde {previous_estado}")
                OrderService._descontar_stock_pendiente(instance)

            # CASO 2: CANCELAR
            elif instance.estado == OrderService.ESTADO_CANCELADO and previous_estado != OrderService.ESTADO_CANCELADO:
                logger.warning(f"Pedido #{instance.id}: CANCELANDO desde {previous_estado}")
                OrderService._devolver_stock_despachado(instance)

    @staticmethod
    def add_products_to_existing_order(mesa_id, products_data, serializer_context):
        """
        Agrega productos a un pedido existente activo.
        """
        # Buscar pedido activo para esta mesa (del día actual)
        today = timezone.localdate()
        pedido_activo = Pedido.objects.filter(
            mesa_id=mesa_id,
            fecha_hora__date=today,
            estado__in=OrderService.ESTADOS_ACTIVOS
        ).select_related('mesa').order_by('-fecha_hora').first()

        if not pedido_activo:
            logger.warning(f"No se encontró pedido activo para mesa {mesa_id} con force_append=True.")
            return None

        logger.info(f"Agregando productos al pedido existente #{pedido_activo.id}")
        
        try:
            with transaction.atomic():
                # Bloquear el pedido para edición segura
                pedido = Pedido.objects.select_for_update().get(pk=pedido_activo.id)
                
                # Si el pedido estaba "despachado", marcar items viejos como despachados
                # para que no aparezcan como nuevos
                if pedido.estado == OrderService.ESTADO_DESPACHADO:
                    for old_item in pedido.items.all():
                        if old_item.cantidad_despachada < old_item.cantidad:
                            old_item.cantidad_despachada = old_item.cantidad
                            old_item.save(update_fields=['cantidad_despachada'])

                total_agregado = 0
                items_agregados = 0
                
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
                    pedido_producto.save(update_fields=['cantidad'])
                    
                    # Sumar al total
                    total_agregado += producto.precio * cantidad
                    items_agregados += 1

                # Actualizar total del pedido
                pedido.total += total_agregado
                
                # IMPORTANTE: Resetear estado a 'pendiente' para que el bartender lo vea de nuevo
                pedido.estado = OrderService.ESTADO_PENDIENTE
                pedido.save(update_fields=['total', 'estado'])
                
                logger.info(f"Pedido #{pedido.id}: Agregados {items_agregados} items, total agregado: ${total_agregado}")
                
                # Serializar y devolver
                serializer = PedidoSerializer(pedido, context=serializer_context)
                return Response(serializer.data, status=status.HTTP_200_OK)

        except Producto.DoesNotExist:
            logger.error(f"Producto no encontrado al agregar a pedido #{pedido_activo.id}")
            return Response(
                {"detail": "Uno o más productos no existen."}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error al agregar productos al pedido: {e}", exc_info=True)
            return Response(
                {"detail": "Error al actualizar el pedido existente."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @staticmethod
    def delete_order_history(queryset):
        """
        Elimina pedidos del historial y devuelve el stock despachado.
        """
        if not queryset.exists():
            return Response(
                {"detail": "No hay pedidos que coincidan con los filtros para eliminar."}, 
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            with transaction.atomic():
                pedidos_a_eliminar = list(queryset)
                count = len(pedidos_a_eliminar)

                for pedido in pedidos_a_eliminar:
                    # Devolver stock SOLO de lo que se haya despachado
                    OrderService._devolver_stock_despachado(pedido)
                
                # Después de revertir el stock, eliminamos los pedidos
                queryset.delete()
                
                logger.info(f"Eliminados {count} pedidos del historial")
                
            return Response(
                {"detail": f"Se eliminaron {count} pedidos exitosamente y se restauró el stock."}, 
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Error al intentar borrar el historial de pedidos: {e}", exc_info=True)
            return Response(
                {"detail": "Ocurrió un error al intentar eliminar el historial. No se realizaron cambios."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @staticmethod
    def despachar_producto(pedido, item_id):
        """
        Marca un producto específico de un pedido como despachado.
        Si todos los productos están despachados, cambia el estado del pedido a 'despachado'.
        """
        try:
            item = PedidoProducto.objects.select_related('producto').get(id=item_id, pedido=pedido)
        except PedidoProducto.DoesNotExist:
            logger.warning(f"Item {item_id} no encontrado en pedido #{pedido.id}")
            return {"error": "Producto no encontrado en este pedido", "status": status.HTTP_404_NOT_FOUND}

        try:
            with transaction.atomic():
                # Descontar stock del item si aún falta por despachar
                pendiente = item.pendiente_despacho
                if pendiente > 0:
                    producto = Producto.objects.select_for_update().get(pk=item.producto.id)
                    producto.stock -= pendiente
                    producto.save(update_fields=['stock'])
                    
                    logger.info(f"Item #{item.id}: Descontado {pendiente} unidades de {producto.nombre}")

                # Actualizar cantidad despachada
                item.cantidad_despachada = item.cantidad
                item.save(update_fields=['cantidad_despachada'])
                
                # Verificar si todos los productos del pedido han sido despachados
                all_dispatched = not pedido.items.filter(cantidad__gt=F('cantidad_despachada')).exists()
                
                if all_dispatched:
                    pedido.estado = OrderService.ESTADO_DESPACHADO
                    pedido.save(update_fields=['estado'])
                    msg = "Producto despachado. Pedido completado."
                    logger.info(f"Pedido #{pedido.id}: COMPLETADO - Todos los items despachados")
                else:
                    msg = "Producto despachado."
                    
            return {"detail": msg, "pedido_estado": pedido.estado, "status": status.HTTP_200_OK}
            
        except Exception as e:
            logger.error(f"Error al despachar producto: {e}", exc_info=True)
            return {"error": "Error interno al despachar producto", "status": status.HTTP_500_INTERNAL_SERVER_ERROR}

