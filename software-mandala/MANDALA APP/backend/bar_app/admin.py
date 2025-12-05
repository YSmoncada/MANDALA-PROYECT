from django.contrib import admin
from .models import Producto, Mesera, Mesa, Pedido, PedidoProducto, Movimiento

admin.site.register(Producto)
admin.site.register(Mesera)
admin.site.register(Mesa)
admin.site.register(Pedido)
admin.site.register(PedidoProducto)
admin.site.register(Movimiento)
