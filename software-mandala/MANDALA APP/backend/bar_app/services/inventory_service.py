from django.db import transaction
from django.db import models
from django.shortcuts import get_object_or_404
from ..models import Producto, Movimiento
from decimal import Decimal
from rest_framework import status
from rest_framework.response import Response
from ..serializers import MovimientoSerializer, ProductoSerializer

class InventoryService:
    @staticmethod
    def create_movement(data):
        producto_id = data.get('producto') or data.get('producto_id')
        tipo = (data.get('tipo') or '').lower()
        cantidad_raw = data.get('cantidad')

        if not producto_id or tipo not in ('entrada', 'salida') or not cantidad_raw:
            return Response({'detail': 'Payload inválido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cantidad = Decimal(str(cantidad_raw))
            if cantidad <= 0:
                raise ValueError
        except Exception:
            return Response({'detail': 'Cantidad inválida'}, status=status.HTTP_400_BAD_REQUEST)

        producto = get_object_or_404(Producto, pk=producto_id)

        with transaction.atomic():
            producto = Producto.objects.select_for_update().get(pk=producto.pk)
            nuevo_stock = producto.stock + cantidad if tipo == 'entrada' else producto.stock - cantidad
            if nuevo_stock < 0:
                return Response({'detail': 'Stock insuficiente'}, status=status.HTTP_400_BAD_REQUEST)

            # Construir kwargs seguros para crear Movimiento
            mov_kwargs = {
                'producto': producto,
                'tipo': tipo,
                'cantidad': cantidad,
            }

            # El campo en el modelo es 'motivo'
            descripcion_val = data.get('descripcion') or data.get('motivo') or data.get('detalle') or data.get('observacion')
            if descripcion_val:
                mov_kwargs['motivo'] = descripcion_val

            movimiento = Movimiento.objects.create(**mov_kwargs)

            producto.stock = nuevo_stock
            producto.save()

        producto.refresh_from_db()
        mov_ser = MovimientoSerializer(movimiento)
        prod_ser = ProductoSerializer(producto)
        return Response({'movimiento': mov_ser.data, 'producto': prod_ser.data}, status=status.HTTP_201_CREATED)
