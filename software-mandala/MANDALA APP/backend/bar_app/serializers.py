from rest_framework import serializers
from .models import Producto, Movimiento, Pedido, PedidoProducto, Mesa, Mesera

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'
        
class MovimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movimiento
        fields = '__all__'

class MeseraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mesera
        fields = '__all__'

        
class PedidoProductoSerializer(serializers.ModelSerializer):
    # Para lectura, muestra el detalle del producto
    producto = ProductoSerializer(read_only=True) 
    # Para escritura, recibe solo el ID del producto
    producto_id = serializers.PrimaryKeyRelatedField(
        queryset=Producto.objects.all(), 
        write_only=True, 
        source='producto'
    )
    # Campos adicionales para mostrar en el historial de pedidos
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    producto_precio = serializers.DecimalField(source='producto.precio', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = PedidoProducto
        fields = ['producto', 'producto_id', 'cantidad', 'producto_nombre', 'producto_precio']

class PedidoSerializer(serializers.ModelSerializer):
    productos = PedidoProductoSerializer(many=True, write_only=True)
    productos_detalle = PedidoProductoSerializer(source='pedidoproducto_set', many=True, read_only=True)
    
    # Campos de solo lectura para mostrar el nombre de la mesera y el número de mesa
    mesera_nombre = serializers.CharField(source='mesera.nombre', read_only=True)
    mesa_numero = serializers.CharField(source='mesa.numero', read_only=True)

    class Meta:
        model = Pedido
        fields = '__all__'
        read_only_fields = ['total', 'fecha_hora'] # total y fecha_hora se calculan en el backend

    def create(self, validated_data):
        productos_data = validated_data.pop('productos', [])
        pedido = Pedido.objects.create(**validated_data)
        total = 0
        for item in productos_data:
            producto = item['producto'] # 'producto' ya es la instancia de Producto gracias a source='producto' en PedidoProductoSerializer
            cantidad = item['cantidad']
            PedidoProducto.objects.create(pedido=pedido, producto=producto, cantidad=cantidad)
            total += producto.precio * cantidad
            
            # Descontar stock
            if producto.stock < cantidad:
                raise serializers.ValidationError(f"❌ Stock insuficiente para el producto {producto.nombre}.")
            producto.stock -= cantidad
            producto.save()

            # Aquí podrías crear un Movimiento de tipo 'salida' si lo deseas
            # from .models import Movimiento
            # Movimiento.objects.create(
            #     producto=producto,
            #     tipo='salida',
            #     cantidad=cantidad,
            #     motivo='Venta',
            #     usuario=pedido.mesera.nombre # O el usuario autenticado
            # )

        pedido.total = total
        pedido.save()
        return pedido

class MesaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mesa
        fields = '__all__'
