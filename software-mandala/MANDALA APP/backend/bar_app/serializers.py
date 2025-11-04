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

    def validate_codigo(self, value):
        """
        Verifica que el código de la mesera sea único.
        """
        if Mesera.objects.filter(codigo=value).exists():
            raise serializers.ValidationError("Ya existe una mesera con este código.")
        return value

# Serializer para CREAR un pedido (recibe IDs)
class PedidoProductoWriteSerializer(serializers.Serializer):
    producto_id = serializers.PrimaryKeyRelatedField(
        queryset=Producto.objects.all(),
        source='producto'
    )
    cantidad = serializers.IntegerField(min_value=1)

# Serializer para LEER un pedido (muestra detalles)
class PedidoProductoReadSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    producto_precio = serializers.DecimalField(source='producto.precio', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = PedidoProducto
        fields = ['cantidad', 'producto_nombre', 'producto_precio']

class PedidoSerializer(serializers.ModelSerializer):
    productos = PedidoProductoWriteSerializer(many=True, write_only=True)
    productos_detalle = PedidoProductoReadSerializer(source='pedidoproducto_set', many=True, read_only=True)
    
    # Campos de solo lectura para mostrar el nombre de la mesera y el número de mesa
    mesera_nombre = serializers.CharField(source='mesera.nombre', read_only=True)
    mesa_numero = serializers.CharField(source='mesa.numero', read_only=True)

    class Meta:
        model = Pedido
        # Definimos explícitamente los campos para evitar conflictos.
        fields = [
            'id', 
            'mesera', # Campo de escritura para el ID de la mesera
            'mesa',   # Campo de escritura para el ID de la mesa
            'estado', 
            'productos', # Campo de escritura para la lista de productos
            'productos_detalle', # Campo de lectura
            'mesera_nombre',     # Campo de lectura
            'mesa_numero',       # Campo de lectura
            'total', 'fecha_hora'
        ]
        read_only_fields = ['fecha_hora', 'productos_detalle', 'mesera_nombre', 'mesa_numero']

    def create(self, validated_data):
        productos_data = validated_data.pop('productos', [])
        # Extraemos mesera y mesa explícitamente
        mesera = validated_data.pop('mesera')
        mesa = validated_data.pop('mesa')
        
        total = 0
        for item in productos_data:
            producto = item['producto'] # 'producto' ya es la instancia de Producto gracias a source='producto' en PedidoProductoSerializer
            cantidad = item['cantidad']
            total += producto.precio * cantidad
            
            # Descontar stock
            if producto.stock < cantidad:
                raise serializers.ValidationError(f"❌ Stock insuficiente para el producto {producto.nombre}.")
            producto.stock -= cantidad
            producto.save()
        
        # CORRECCIÓN: Asignar el total ANTES de crear el pedido.
        pedido = Pedido.objects.create(mesera=mesera, mesa=mesa, total=total, **validated_data) # Se crea el pedido con el total ya calculado
        
        # Crear los registros de PedidoProducto después de que el pedido ya tiene un ID.
        for item in productos_data:
            PedidoProducto.objects.create(pedido=pedido, producto=item['producto'], cantidad=item['cantidad'])
            
        return pedido

class MesaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mesa
        fields = '__all__'

    def validate_numero(self, value):
        """
        Verifica que el número de la mesa sea único.
        """
        # self.instance es el objeto que se está actualizando, si aplica.
        if Mesa.objects.filter(numero=value).exclude(pk=getattr(self.instance, 'pk', None)).exists():
            raise serializers.ValidationError("Ya existe una mesa con este número.")
        return value


# --- Serializer para el Reporte de Ventas por Mesera ---

class MeseraTotalPedidosSerializer(serializers.Serializer):
    mesera_id = serializers.IntegerField(read_only=True)
    mesera_nombre = serializers.CharField(read_only=True)
    total_vendido = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
