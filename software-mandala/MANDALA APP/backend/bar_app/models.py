from django.db import models
from django.contrib.auth.models import User


class Categoria(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    imagen = models.ImageField(upload_to='categorias/', blank=True, null=True)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"
        ordering = ['nombre']


class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    imagen = models.ImageField(upload_to='productos/', blank=True, null=True)
    categoria_rel = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True, related_name='productos')
    stock = models.IntegerField(default=0)
    stock_minimo = models.IntegerField(default=0)
    stock_maximo = models.IntegerField(default=0)
    precio = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    unidad = models.CharField(max_length=50, blank=True, null=True)
    proveedor = models.CharField(max_length=100, blank=True, null=True)
    ubicacion = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"
        ordering = ['nombre']


class Mesera(models.Model):
    nombre = models.CharField(max_length=100)
    codigo = models.CharField(max_length=128, unique=True)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Mesera"
        verbose_name_plural = "Meseras"
        ordering = ['nombre']


class Mesa(models.Model):
    ESTADO_CHOICES = [
        ("disponible", "Disponible"),
        ("ocupada", "Ocupada")
    ]
    
    numero = models.CharField(max_length=10, unique=True)
    capacidad = models.IntegerField(default=1)
    estado = models.CharField(max_length=20, default="disponible", choices=ESTADO_CHOICES)

    def __str__(self):
        return f"Mesa {self.numero}"

    class Meta:
        verbose_name = "Mesa"
        verbose_name_plural = "Mesas"
        ordering = ['numero']


class Pedido(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),     # El bartender aún no lo ha preparado
        ('despachado', 'Despachado'),   # El bartender ya lo entregó
        ('finalizada', 'Finalizada'),   # La cuenta ha sido cerrada
        ('cancelado', 'Cancelado'),     # El pedido fue cancelado
    ]
    
    # El pedido puede ser de una mesera O de un usuario del sistema (admin/bartender)
    mesera = models.ForeignKey(Mesera, on_delete=models.CASCADE, null=True, blank=True)
    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    mesa = models.ForeignKey(Mesa, on_delete=models.CASCADE)
    fecha_hora = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        vendedor = self.mesera.nombre if self.mesera else (self.usuario.username if self.usuario else "Desconocido")
        return f"Pedido #{self.id} - {vendedor} - {self.fecha_hora}"

    class Meta:
        verbose_name = "Pedido"
        verbose_name_plural = "Pedidos"
        ordering = ['-fecha_hora']
        indexes = [
            models.Index(fields=['fecha_hora']),
            models.Index(fields=['estado']),
            models.Index(fields=['mesera']),
            models.Index(fields=['usuario']),
        ]


class PedidoProducto(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='items')
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cantidad_despachada = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.producto.nombre} x{self.cantidad} (Pedido #{self.pedido.id})"

    @property
    def subtotal(self):
        """Calcula el subtotal de este item"""
        return self.precio_unitario * self.cantidad

    @property
    def pendiente_despacho(self):
        """Cantidad pendiente de despachar"""
        return self.cantidad - self.cantidad_despachada

    class Meta:
        verbose_name = "Item de Pedido"
        verbose_name_plural = "Items de Pedidos"
        indexes = [
            models.Index(fields=['pedido', 'producto']),
        ]


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

    def __str__(self):
        return f"{self.tipo} - {self.producto.nombre} ({self.cantidad})"

    class Meta:
        verbose_name = "Movimiento de Inventario"
        verbose_name_plural = "Movimientos de Inventario"
        ordering = ['-fecha']
        indexes = [
            models.Index(fields=['producto', 'fecha']),
            models.Index(fields=['tipo', 'fecha']),
        ]


class EmpresaConfig(models.Model):
    nombre = models.CharField(max_length=100, default="")
    nit = models.CharField(max_length=50, blank=True, null=True)
    direccion = models.CharField(max_length=200, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    mensaje_footer = models.TextField(default="¡Gracias por su visita!")
    moneda = models.CharField(max_length=10, default="$")
    impuesto_porcentaje = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    def __str__(self):
        return self.nombre or "Configuración de Empresa"

    class Meta:
        verbose_name = "Configuración de Empresa"
        verbose_name_plural = "Configuración de Empresa"
