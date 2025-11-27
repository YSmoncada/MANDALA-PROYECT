from rest_framework import serializers
from .models import Producto, Movimiento, Pedido, PedidoProducto, Mesa, Mesera
from django.utils import timezone

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
    mesera_nombre = serializers.CharField(source='mesera.nombre', read_only=True)
    mesa_numero = serializers.CharField(source='mesa.numero', read_only=True)
    
    # Add custom method fields for date and time
    fecha = serializers.SerializerMethodField()
    hora = serializers.SerializerMethodField()

    class Meta:
        model = Pedido
        fields = [
            'id', 'mesera', 'mesa', 'estado', 'productos',
            'productos_detalle', 'mesera_nombre', 'mesa_numero',
            'total', 'fecha_hora', 'fecha', 'hora'
        ]
        read_only_fields = [
            'fecha_hora', 'productos_detalle', 
            'mesera_nombre', 'mesa_numero',
            'fecha', 'hora'
        ]

    def get_fecha(self, obj):
        """Convert fecha_hora to local date"""
        if obj.fecha_hora:
            local_dt = timezone.localtime(obj.fecha_hora)
            return local_dt.date()
        return None

    def get_hora(self, obj):
        """Convert fecha_hora to local time"""
        if obj.fecha_hora:
            local_dt = timezone.localtime(obj.fecha_hora)
            return local_dt.time()
        return None

    # Remove the previous fecha and hora fields
    # fecha = serializers.DateField(source='fecha_hora', format='%Y-%m-%d', read_only=True)
    # hora = serializers.TimeField(source='fecha_hora', format='%H:%M:%S', read_only=True)

    def create(self, validated_data):
        productos_data = validated_data.pop('productos', [])

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

        # Asignar el total y crear el pedido con los datos validados
        validated_data['total'] = total
        pedido = Pedido.objects.create(**validated_data)

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
