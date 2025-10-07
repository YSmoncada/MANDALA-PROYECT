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
    producto = ProductoSerializer(read_only=True)  # Para lectura
    producto_id = serializers.PrimaryKeyRelatedField(
        queryset=Producto.objects.all(), 
        write_only=True, 
        source='producto'
    )

    class Meta:
        model = PedidoProducto
        fields = ['producto', 'producto_id', 'cantidad']
class PedidoSerializer(serializers.ModelSerializer):
    productos = PedidoProductoSerializer(many=True, write_only=True)
    productos_detalle = PedidoProductoSerializer(source='pedidoproducto_set', many=True, read_only=True)

    class Meta:
        model = Pedido
        fields = '__all__'

    def create(self, validated_data):
        productos_data = validated_data.pop('productos', [])
        pedido = Pedido.objects.create(**validated_data)
        total = 0
        for item in productos_data:
            producto = item['producto']  
            cantidad = item['cantidad']
            PedidoProducto.objects.create(pedido=pedido, producto=producto, cantidad=cantidad)
            total += producto.precio * cantidad
        pedido.total = total
        pedido.save()
        return pedido

class MesaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mesa
        fields = '__all__'
