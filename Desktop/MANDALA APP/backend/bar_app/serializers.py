from rest_framework import serializers
from .models import *

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'


class MovimientoProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovimientoProducto
        fields = '__all__'
        extra_kwargs = {
            'fecha': {'read_only': True}
        }
        