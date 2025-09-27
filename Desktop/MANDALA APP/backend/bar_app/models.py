from django.db import models

class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    categoria = models.CharField(max_length=50, blank=True, null=True)  # ✅ NUEVO
    stock = models.IntegerField(default=0)
    stock_minimo = models.IntegerField(default=0)
    stock_maximo = models.IntegerField(default=0)
    precio = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    unidad = models.CharField(max_length=50, blank=True, null=True)
    proveedor = models.CharField(max_length=100, blank=True, null=True)
    ubicacion = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.nombre




class Pedido(models.Model):
    fecha = models.DateTimeField(auto_now_add=True)
    productos = models.ManyToManyField(Producto, through='PedidoProducto')

    def total(self):
        return sum(item.cantidad * item.producto.precio for item in self.pedidoproducto_set.all())

    def __str__(self):
        return f"Pedido #{self.id} - {self.fecha}"


class PedidoProducto(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()

class Movimiento(models.Model):
    TIPOS_MOVIMIENTO = [
        ("entrada", "Entrada"),
        ("salida", "Salida"),
    ]

    MOTIVOS = [
        ("Compra", "Compra"),
        ("Consumo", "Consumo"),
        ("Devolución", "Devolución"),
        ("Ajuste", "Ajuste"),
        ("Venta", "Venta"),
    ]

    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name="movimientos")
    tipo = models.CharField(max_length=10, choices=TIPOS_MOVIMIENTO)
    cantidad = models.PositiveIntegerField()
    motivo = models.CharField(max_length=20, choices=MOTIVOS)
    usuario = models.CharField(max_length=100)
    fecha = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Si es nuevo movimiento (no update)
        if not self.pk:
            if self.tipo == "entrada":
                self.producto.stock += self.cantidad
            elif self.tipo == "salida":
                if self.producto.stock < self.cantidad:
                    raise ValueError("❌ Stock insuficiente para realizar la salida.")
                self.producto.stock -= self.cantidad
            self.producto.save()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.tipo} - {self.producto.nombre} ({self.cantidad})"

