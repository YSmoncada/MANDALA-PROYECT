from rest_framework import serializers
from .models import Producto, Movimiento, Pedido, PedidoProducto, Mesa, Mesera, EmpresaConfig
from django.utils import timezone
from django.contrib.auth.models import User

class ProductoSerializer(serializers.ModelSerializer):
    imagen = serializers.ImageField(required=False, allow_null=True)
    
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
        fields = ['id', 'nombre', 'codigo']
        extra_kwargs = {
            'codigo': {'write_only': True}
        }

    def validate_codigo(self, value):
        """
        Verifica que el código de la mesera sea único.
        """
        if Mesera.objects.filter(codigo=value).exists():
            raise serializers.ValidationError("Ya existe una mesera con este código.")
        return value

class PedidoProductoWriteSerializer(serializers.Serializer):
    producto_id = serializers.PrimaryKeyRelatedField(
        queryset=Producto.objects.all(),
        source='producto'
    )
    cantidad = serializers.IntegerField(min_value=1)

class PedidoProductoReadSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    producto_precio = serializers.SerializerMethodField()
    
    def get_producto_precio(self, obj):
        if obj.precio_unitario and obj.precio_unitario > 0:
            return obj.precio_unitario
        return obj.producto.precio

    class Meta:
        model = PedidoProducto
        fields = ['id', 'cantidad', 'cantidad_despachada', 'producto_nombre', 'producto_precio']

class PedidoSerializer(serializers.ModelSerializer):
    productos = PedidoProductoWriteSerializer(many=True, write_only=True)
    productos_detalle = PedidoProductoReadSerializer(source='pedidoproducto_set', many=True, read_only=True)
    mesa_numero = serializers.CharField(source='mesa.numero', read_only=True)
    mesera_nombre = serializers.SerializerMethodField()
    mesera = serializers.PrimaryKeyRelatedField(queryset=Mesera.objects.all(), required=False, allow_null=True)
    usuario = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, allow_null=True)
    
    fecha = serializers.SerializerMethodField()
    hora = serializers.SerializerMethodField()
 
    class Meta:
        model = Pedido
        fields = [
            'id', 'mesera', 'usuario', 'mesa', 'estado', 'productos',
            'productos_detalle', 'mesera_nombre', 'mesa_numero',
            'total', 'fecha_hora', 'fecha', 'hora'
        ]
        read_only_fields = [
            'fecha_hora', 'productos_detalle', 
            'mesera_nombre', 'mesa_numero',
            'fecha', 'hora'
        ]

    def get_mesera_nombre(self, obj):
        if obj.mesera:
            return obj.mesera.nombre
        if obj.usuario:
            return obj.usuario.username.upper()
        return "N/A"

    def get_fecha(self, obj):
        if obj.fecha_hora:
            local_dt = timezone.localtime(obj.fecha_hora)
            return local_dt.date()
        return None

    def get_hora(self, obj):
        if obj.fecha_hora:
            local_dt = timezone.localtime(obj.fecha_hora)
            return local_dt.time()
        return None

    def create(self, validated_data):
        productos_data = validated_data.pop('productos', [])
        total = 0
        for item in productos_data:
            producto = item['producto']
            cantidad = item['cantidad']
            total += producto.precio * cantidad
            # if producto.stock < cantidad:
            #     raise serializers.ValidationError(f"❌ Stock insuficiente para el producto {producto.nombre}.")
            # producto.stock -= cantidad
            # producto.save()

        validated_data['total'] = total
        pedido = Pedido.objects.create(**validated_data)
        for item in productos_data:
            PedidoProducto.objects.create(
                pedido=pedido,
                producto=item['producto'],
                cantidad=item['cantidad'],
                precio_unitario=item['producto'].precio
            )
        return pedido

from datetime import timedelta

class MesaSerializer(serializers.ModelSerializer):
    ocupada_por = serializers.SerializerMethodField()
    ocupada_por_id = serializers.SerializerMethodField()
    ocupada_por_tipo = serializers.SerializerMethodField()

    class Meta:
        model = Mesa
        fields = ['id', 'numero', 'capacidad', 'estado', 'ocupada_por', 'ocupada_por_id', 'ocupada_por_tipo']

    def get_active_order(self, obj):
        # Helper: Busca el primer pedido activo (no finalizado ni cancelado)
        # Limitamos a pedidos recientes (últimas 24h) para evitar bloqueos por pedidos viejos
        cutoff = timezone.now() - timedelta(hours=24)
        return obj.pedido_set.filter(
            estado__in=['pendiente', 'despachado'],
            fecha_hora__gte=cutoff
        ).first()

    def get_ocupada_por(self, obj):
        order = self.get_active_order(obj)
        if order:
            if order.mesera:
                return order.mesera.nombre
            elif order.usuario:
                return order.usuario.username.upper()
        return None

    def get_ocupada_por_id(self, obj):
        order = self.get_active_order(obj)
        if order:
            if order.mesera:
                return f"m{order.mesera.id}"
            elif order.usuario:
                return f"u{order.usuario.id}"
        return None

    def get_ocupada_por_tipo(self, obj):
        order = self.get_active_order(obj)
        if order:
            if order.mesera:
                return 'mesera'
            elif order.usuario:
                return 'usuario'
        return None

    def validate_numero(self, value):
        if Mesa.objects.filter(numero=value).exclude(pk=getattr(self.instance, 'pk', None)).exists():
            raise serializers.ValidationError("Ya existe una mesa con este número.")
        return value

class MeseraTotalPedidosSerializer(serializers.Serializer):
    mesera_id = serializers.IntegerField(read_only=True)
    mesera_nombre = serializers.CharField(read_only=True)
    total_vendido = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    tipo = serializers.CharField(read_only=True)

class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'role', 'is_active']

    def get_role(self, obj):
        if obj.is_superuser:
            return "admin"
        if obj.groups.filter(name='Bartender').exists():
            return "bartender"
        return "usuario"

class EmpresaConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmpresaConfig
        fields = '__all__'
