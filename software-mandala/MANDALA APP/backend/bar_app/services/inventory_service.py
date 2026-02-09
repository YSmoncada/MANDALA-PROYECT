from django.db import transaction
from django.db import models
from django.shortcuts import get_object_or_404
from ..models import Producto, Movimiento
from decimal import Decimal, InvalidOperation
from rest_framework import status
from rest_framework.response import Response
from ..serializers import MovimientoSerializer, ProductoSerializer
import logging

logger = logging.getLogger(__name__)

class InventoryService:
    # Constantes de tipos de movimiento
    TIPO_ENTRADA = 'entrada'
    TIPO_SALIDA = 'salida'
    
    TIPOS_VALIDOS = [TIPO_ENTRADA, TIPO_SALIDA]
    
    @staticmethod
    def create_movement(data, user=None):
        """
        Crea un movimiento de inventario (entrada o salida).
        
        Args:
            data: Diccionario con datos del movimiento
            user: Usuario que realiza el movimiento (opcional)
            
        Returns:
            Response: Respuesta HTTP con el movimiento creado o error
        """
        # Extraer y validar datos
        producto_id = data.get('producto') or data.get('producto_id')
        tipo = (data.get('tipo') or '').lower()
        cantidad_raw = data.get('cantidad')
        motivo = data.get('descripcion') or data.get('motivo') or data.get('detalle') or data.get('observacion')
        usuario_nombre = data.get('usuario') or (user.username if user else 'Sistema')

        # Validaciones básicas
        if not producto_id:
            logger.warning("Intento de crear movimiento sin producto_id")
            return Response({'detail': 'El ID del producto es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        
        if tipo not in InventoryService.TIPOS_VALIDOS:
            logger.warning(f"Intento de crear movimiento con tipo inválido: {tipo}")
            return Response(
                {'detail': f'Tipo inválido. Debe ser "{InventoryService.TIPO_ENTRADA}" o "{InventoryService.TIPO_SALIDA}"'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not cantidad_raw:
            logger.warning("Intento de crear movimiento sin cantidad")
            return Response({'detail': 'La cantidad es requerida'}, status=status.HTTP_400_BAD_REQUEST)

        # Validar y convertir cantidad
        try:
            cantidad = Decimal(str(cantidad_raw))
            if cantidad <= 0:
                raise ValueError("La cantidad debe ser mayor a cero")
        except (InvalidOperation, ValueError) as e:
            logger.warning(f"Cantidad inválida en movimiento: {cantidad_raw}")
            return Response({'detail': 'La cantidad debe ser un número positivo'}, status=status.HTTP_400_BAD_REQUEST)

        # Obtener producto
        producto = get_object_or_404(Producto, pk=producto_id)

        try:
            with transaction.atomic():
                # Bloquear producto para actualización segura
                producto = Producto.objects.select_for_update().get(pk=producto.pk)
                
                # Calcular nuevo stock
                if tipo == InventoryService.TIPO_ENTRADA:
                    nuevo_stock = producto.stock + cantidad
                else:  # salida
                    nuevo_stock = producto.stock - cantidad
                
                # Validar stock suficiente para salidas
                if nuevo_stock < 0:
                    logger.warning(f"Stock insuficiente para {producto.nombre}: stock actual={producto.stock}, cantidad solicitada={cantidad}")
                    return Response(
                        {'detail': f'Stock insuficiente. Stock actual: {producto.stock}'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Crear movimiento
                movimiento = Movimiento.objects.create(
                    producto=producto,
                    tipo=tipo,
                    cantidad=int(cantidad),
                    motivo=motivo or 'Sin especificar',
                    usuario=usuario_nombre
                )

                # Actualizar stock del producto
                producto.stock = nuevo_stock
                producto.save(update_fields=['stock'])
                
                logger.info(f"Movimiento creado: {tipo.upper()} de {cantidad} unidades de {producto.nombre} por {usuario_nombre}")

        except Exception as e:
            logger.error(f"Error al crear movimiento de inventario: {e}", exc_info=True)
            return Response(
                {'detail': 'Error interno al procesar el movimiento'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Refrescar datos y serializar
        producto.refresh_from_db()
        mov_ser = MovimientoSerializer(movimiento)
        prod_ser = ProductoSerializer(producto)
        
        return Response(
            {
                'movimiento': mov_ser.data, 
                'producto': prod_ser.data,
                'nuevo_stock': producto.stock
            }, 
            status=status.HTTP_201_CREATED
        )

