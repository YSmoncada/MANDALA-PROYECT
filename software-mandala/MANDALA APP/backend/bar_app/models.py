from django.db import models

class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    imagen = models.ImageField(upload_to='productos/', blank=True, null=True)
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

    @property
    def imagen_url(self):
        """
        Devuelve la URL completa de la imagen desde Cloudinary.
        Si no hay imagen, devuelve una cadena vacía.
        """
        if self.imagen and hasattr(self.imagen, 'url'):
            return self.imagen.url
        return ""

class Mesera(models.Model):
    nombre = models.CharField(max_length=100)
    codigo = models.CharField(max_length=10, unique=True)

class Mesa(models.Model):
    numero = models.CharField(max_length=10)
    capacidad = models.IntegerField(default=1)
    estado = models.CharField(max_length=20, default="disponible", choices=[("disponible", "Disponible"), ("ocupada", "Ocupada")])  # disponible, ocupada

class Pedido(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),     # El bartender aún no lo ha preparado
        ('despachado', 'Despachado'),   # El bartender ya lo entregó
        ('finalizada', 'Finalizada'),   # La cuenta ha sido cerrada
        ('cancelado', 'Cancelado'),     # El pedido fue cancelado
    ]
    mesera = models.ForeignKey(Mesera, on_delete=models.CASCADE)
    mesa = models.ForeignKey(Mesa, on_delete=models.CASCADE)
    fecha_hora = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

 
    def __str__(self):
        return f"Pedido #{self.id} - {self.fecha_hora}"

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
