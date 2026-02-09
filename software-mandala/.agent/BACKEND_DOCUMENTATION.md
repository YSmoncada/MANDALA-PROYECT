# 📚 DOCUMENTACIÓN COMPLETA DEL BACKEND - MANDALA PROYECT

## 🏗️ ARQUITECTURA GENERAL

Tu backend está construido con **Django REST Framework** y sigue una arquitectura en capas bien organizada:

```
backend/
├── backend/              # Configuración principal del proyecto Django
│   ├── settings.py      # Configuración global
│   ├── urls.py          # Rutas principales de la API
│   └── wsgi.py          # Servidor WSGI
│
├── bar_app/             # Aplicación principal
│   ├── models.py        # Modelos de base de datos (ORM)
│   ├── serializers.py   # Serialización de datos (JSON ↔ Python)
│   ├── authentication.py # Sistema de autenticación personalizado
│   │
│   ├── services/        # Lógica de negocio (Capa de servicios)
│   │   ├── auth_service.py
│   │   ├── order_service.py
│   │   ├── inventory_service.py
│   │   └── setup_service.py
│   │
│   └── views/           # Controladores de API (Endpoints)
│       ├── auth_views.py
│       ├── order_views.py
│       ├── inventory_views.py
│       ├── mesera_views.py
│       ├── report_views.py
│       └── core_views.py
```

---

## 📊 MODELOS DE BASE DE DATOS (models.py)

Los modelos definen la estructura de tu base de datos. Cada clase representa una tabla.

### 1️⃣ **Categoria**

```python
class Categoria(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    imagen = models.ImageField(upload_to='categorias/', blank=True, null=True)
```

**¿Qué hace?** Organiza los productos en categorías (Bebidas, Comidas, etc.)

---

### 2️⃣ **Producto**

```python
class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    imagen = models.ImageField(upload_to='productos/', blank=True, null=True)
    categoria_rel = models.ForeignKey(Categoria, ...)
    stock = models.IntegerField(default=0)
    stock_minimo = models.IntegerField(default=0)
    stock_maximo = models.IntegerField(default=0)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    unidad = models.CharField(max_length=50)
    proveedor = models.CharField(max_length=100)
    ubicacion = models.CharField(max_length=100)
```

**¿Qué hace?** Representa cada producto del inventario con toda su información.

---

### 3️⃣ **Mesera**

```python
class Mesera(models.Model):
    nombre = models.CharField(max_length=100)
    codigo = models.CharField(max_length=128, unique=True)  # PIN hasheado
```

**¿Qué hace?** Representa a las meseras del sistema. El código es un PIN encriptado.

---

### 4️⃣ **Mesa**

```python
class Mesa(models.Model):
    numero = models.CharField(max_length=10)
    capacidad = models.IntegerField(default=1)
    estado = models.CharField(max_length=20, default="disponible")
```

**¿Qué hace?** Representa las mesas del restaurante/bar.

---

### 5️⃣ **Pedido** (El más importante)

```python
class Pedido(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),     # Bartender no lo ha preparado
        ('despachado', 'Despachado'),   # Bartender ya lo entregó
        ('finalizada', 'Finalizada'),   # Cuenta cerrada
        ('cancelado', 'Cancelado'),     # Pedido cancelado
    ]

    mesera = models.ForeignKey(Mesera, null=True, blank=True)
    usuario = models.ForeignKey(User, null=True, blank=True)  # Admin/Bartender
    mesa = models.ForeignKey(Mesa)
    fecha_hora = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES)
    total = models.DecimalField(max_digits=10, decimal_places=2)
```

**¿Qué hace?** Representa un pedido completo. Puede ser creado por una mesera O por un usuario del sistema (admin/bartender).

---

### 6️⃣ **PedidoProducto** (Tabla intermedia)

```python
class PedidoProducto(models.Model):
    pedido = models.ForeignKey(Pedido)
    producto = models.ForeignKey(Producto)
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    cantidad_despachada = models.PositiveIntegerField(default=0)
```

**¿Qué hace?** Conecta pedidos con productos. Un pedido puede tener múltiples productos.

---

### 7️⃣ **Movimiento**

```python
class Movimiento(models.Model):
    TIPOS_MOVIMIENTO = [("entrada", "Entrada"), ("salida", "Salida")]
    MOTIVOS = ["Compra", "Consumo", "Devolución", "Ajuste", "Venta"]

    producto = models.ForeignKey(Producto)
    tipo = models.CharField(max_length=10, choices=TIPOS_MOVIMIENTO)
    cantidad = models.PositiveIntegerField()
    motivo = models.CharField(max_length=20, choices=MOTIVOS)
    usuario = models.CharField(max_length=100)
    fecha = models.DateTimeField(auto_now_add=True)
```

**¿Qué hace?** Registra entradas y salidas de inventario para auditoría.

---

### 8️⃣ **EmpresaConfig**

```python
class EmpresaConfig(models.Model):
    nombre = models.CharField(max_length=100)
    nit = models.CharField(max_length=50)
    direccion = models.CharField(max_length=200)
    telefono = models.CharField(max_length=20)
    mensaje_footer = models.TextField(default="¡Gracias por su visita!")
    moneda = models.CharField(max_length=10, default="$")
    impuesto_porcentaje = models.DecimalField(max_digits=5, decimal_places=2)
```

**¿Qué hace?** Configuración de la empresa para facturas y reportes.

---

## 🔄 SERIALIZERS (serializers.py)

Los serializers convierten los modelos de Python a JSON (y viceversa) para la API REST.

### **ProductoSerializer**

Convierte objetos `Producto` a JSON para enviar al frontend.

### **PedidoSerializer** (El más complejo)

```python
class PedidoSerializer(serializers.ModelSerializer):
    productos = PedidoProductoWriteSerializer(many=True, write_only=True)  # Para crear
    productos_detalle = PedidoProductoReadSerializer(...)  # Para leer
    mesera_nombre = serializers.SerializerMethodField()
    fecha = serializers.SerializerMethodField()
    hora = serializers.SerializerMethodField()
```

**Funciones importantes:**

- `create()`: Crea un pedido nuevo con sus productos y calcula el total
- `get_mesera_nombre()`: Retorna el nombre de la mesera o usuario que creó el pedido

### **MesaSerializer**

```python
class MesaSerializer(serializers.ModelSerializer):
    ocupada_por = serializers.SerializerMethodField()
    ocupada_por_id = serializers.SerializerMethodField()
    ocupada_por_tipo = serializers.SerializerMethodField()
```

**Funciones importantes:**

- `get_active_order()`: Busca si la mesa tiene un pedido activo HOY
- `get_ocupada_por()`: Retorna quién tiene la mesa ocupada

---

## 🛣️ RUTAS DE LA API (urls.py)

```python
# RUTAS PRINCIPALES:

# 1. AUTENTICACIÓN
POST /api/login/                          # Login admin/bartender
POST /api/verificar-codigo-mesera/        # Verificar PIN de mesera

# 2. CRUD CON VIEWSETS (REST completo)
GET/POST    /api/productos/               # Listar/Crear productos
GET/PUT/DEL /api/productos/{id}/          # Ver/Editar/Eliminar producto

GET/POST    /api/pedidos/                 # Listar/Crear pedidos
GET/PUT/DEL /api/pedidos/{id}/            # Ver/Editar/Eliminar pedido
POST        /api/pedidos/{id}/despachar_producto/  # Despachar un item
DELETE      /api/pedidos/borrar_historial/         # Borrar historial

GET/POST    /api/mesas/                   # Listar/Crear mesas
GET/PUT/DEL /api/mesas/{id}/              # Ver/Editar/Eliminar mesa

GET/POST    /api/meseras/                 # Listar/Crear meseras
GET/PUT/DEL /api/meseras/{id}/            # Ver/Editar/Eliminar mesera
POST        /api/meseras/{id}/cambiar-codigo/  # Cambiar PIN

GET/POST    /api/usuarios/                # Listar/Crear usuarios
POST        /api/usuarios/{id}/cambiar-password/  # Cambiar contraseña

GET/POST    /api/movimientos/             # Listar/Crear movimientos inventario

GET/POST    /api/config/                  # Configuración empresa

# 3. REPORTES
GET /api/meseras/total-pedidos/           # Total vendido por mesera/usuario
GET /api/reportes/ventas-diarias/         # Reporte de ventas por día
GET /api/total-pedidos-mesera-hoy/        # Total de hoy por mesera
```

---

## 🎯 VISTAS (CONTROLADORES)

### **auth_views.py** - Autenticación

#### `LoginView` (APIView)

```python
POST /api/login/
Body: { "username": "admin", "password": "admin123" }
```

**¿Qué hace?**

1. Recibe username y password
2. Llama a `AuthService.login_user()`
3. Retorna token, role y datos del usuario

#### `verificar_codigo_mesera` (función)

```python
POST /api/verificar-codigo-mesera/
Body: { "mesera_id": 1, "codigo": "1234" }
```

**¿Qué hace?**

1. Verifica el PIN de la mesera
2. Soporta migración automática de texto plano a hash
3. Usa `AuthService.verify_mesera_code()`

#### `UserViewSet` (ViewSet)

**Endpoints:**

- `GET /api/usuarios/` - Lista usuarios
- `POST /api/usuarios/` - Crea usuario
- `POST /api/usuarios/{id}/cambiar-password/` - Cambia contraseña

---

### **order_views.py** - Gestión de Pedidos

#### `PedidoViewSet` (ViewSet)

**Método `create()`:**

```python
POST /api/pedidos/
Body: {
  "mesa": 1,
  "mesera": 2,
  "productos": [
    {"producto_id": 5, "cantidad": 2},
    {"producto_id": 8, "cantidad": 1}
  ],
  "force_append": false  // Si es true, agrega a pedido existente
}
```

**¿Qué hace?**

1. Si `force_append=true`: Agrega productos a pedido existente (usa `OrderService`)
2. Si no: Valida que no haya pedido activo en esa mesa HOY
3. Crea el pedido nuevo con sus productos

**Método `perform_update()`:**

```python
PUT /api/pedidos/{id}/
Body: { "estado": "despachado" }
```

**¿Qué hace?**

1. Actualiza el estado del pedido
2. Llama a `OrderService.process_order_update()` para manejar stock

**Acción `despachar_producto()`:**

```python
POST /api/pedidos/{id}/despachar_producto/
Body: { "item_id": 15 }
```

**¿Qué hace?**

1. Marca un producto específico como despachado
2. Descuenta stock
3. Si todos están despachados, cambia pedido a "despachado"

**Acción `borrar_historial()`:**

```python
DELETE /api/pedidos/borrar_historial/?mesera=2&fecha=2026-02-09
```

**¿Qué hace?**

1. Elimina pedidos según filtros
2. Devuelve stock al inventario

---

### **inventory_views.py** - Inventario

#### `ProductoViewSet`

CRUD completo de productos (GET, POST, PUT, DELETE)

#### `MovimientoViewSet`

```python
POST /api/movimientos/
Body: {
  "producto": 5,
  "tipo": "entrada",  // o "salida"
  "cantidad": 10,
  "motivo": "Compra"
}
```

**¿Qué hace?**
Delega a `InventoryService.create_movement()` para actualizar stock.

---

### **mesera_views.py** - Gestión de Meseras

#### `MeseraViewSet`

**Acción `cambiar_codigo()`:**

```python
POST /api/meseras/{id}/cambiar-codigo/
Body: { "codigo": "5678" }
```

**¿Qué hace?**

1. Solo admin puede cambiar PINs
2. Hashea el nuevo código con `AuthService.change_mesera_code()`

---

### **report_views.py** - Reportes

#### `MeseraTotalPedidosView`

```python
GET /api/meseras/total-pedidos/?fecha=2026-02-09
```

**¿Qué hace?**

1. Calcula total vendido por cada mesera
2. Calcula total vendido por cada usuario del sistema
3. Retorna lista combinada

#### `ReporteVentasDiariasView`

```python
GET /api/reportes/ventas-diarias/?start_date=2026-02-01&end_date=2026-02-09
```

**¿Qué hace?**
Agrupa pedidos por fecha y suma totales (para reportes DIAN).

---

### **core_views.py** - Funcionalidades Core

#### `MesaViewSet`

CRUD de mesas con validación de número único.

#### `EmpresaConfigViewSet`

Gestión de configuración de la empresa.

---

## 🔧 SERVICIOS (LÓGICA DE NEGOCIO)

Los servicios contienen la lógica compleja separada de las vistas.

### **auth_service.py** - Autenticación

#### `AuthService.login_user(request, username, password)`

**¿Qué hace?**

1. Autentica usuario con Django
2. Determina el rol (admin/bartender/prueba)
3. Crea/obtiene token de autenticación
4. Retorna datos del usuario

#### `AuthService.verify_mesera_code(mesera, codigo_input)`

**¿Qué hace?**

1. Verifica PIN hasheado
2. Si está en texto plano (legacy), lo migra a hash automáticamente

#### `AuthService.change_user_password(user, new_password)`

Cambia contraseña de usuario del sistema.

#### `AuthService.change_mesera_code(mesera, new_code)`

Cambia y hashea PIN de mesera.

---

### **order_service.py** - Lógica de Pedidos

#### `OrderService.process_order_update(instance, previous_estado)`

**¿Qué hace?**

1. **Si pasa a 'despachado'**: Descuenta stock de productos pendientes
2. **Si pasa a 'cancelado'**: Devuelve stock de lo despachado

```python
# CASO 1: DESPACHAR
if instance.estado == 'despachado':
    for item in pedido.items:
        pendiente = item.cantidad - item.cantidad_despachada
        producto.stock -= pendiente  # Descuenta
        item.cantidad_despachada = item.cantidad

# CASO 2: CANCELAR
elif instance.estado == 'cancelado':
    for item in pedido.items:
        producto.stock += item.cantidad_despachada  # Devuelve
```

#### `OrderService.add_products_to_existing_order(mesa_id, products_data, context)`

**¿Qué hace?**

1. Busca pedido activo en la mesa HOY
2. Si el pedido estaba "despachado", marca items viejos como despachados
3. Agrega nuevos productos al pedido
4. Actualiza total
5. Resetea estado a "pendiente" para que bartender lo vea

#### `OrderService.delete_order_history(queryset)`

**¿Qué hace?**

1. Devuelve stock de productos despachados
2. Elimina pedidos del historial

#### `OrderService.despachar_producto(pedido, item_id)`

**¿Qué hace?**

1. Descuenta stock del producto
2. Marca item como despachado
3. Si todos los items están despachados, cambia pedido a "despachado"

---

### **inventory_service.py** - Lógica de Inventario

#### `InventoryService.create_movement(data)`

**¿Qué hace?**

1. Valida datos (producto, tipo, cantidad)
2. Usa transacción atómica para seguridad
3. Si es "entrada": `stock += cantidad`
4. Si es "salida": `stock -= cantidad` (valida que no sea negativo)
5. Crea registro de movimiento para auditoría

---

## 🔐 AUTENTICACIÓN (authentication.py)

### `GlobalAuthentication`

```python
class GlobalAuthentication(TokenAuthentication, SessionAuthentication, BasicAuthentication):
    def enforce_csrf(self, request):
        return  # Bypass CSRF
```

**¿Qué hace?**
Combina 3 métodos de autenticación:

1. **Token**: Para API (frontend React)
2. **Session**: Para navegador
3. **Basic**: Para herramientas de desarrollo

### `IsSuperUser`

```python
class IsSuperUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and (request.user.is_superuser or request.user.is_staff))
```

**¿Qué hace?**
Permiso personalizado que solo permite acceso a admin/staff.

---

## 🔄 FLUJO COMPLETO DE UN PEDIDO

### 1️⃣ **Crear Pedido**

```
Frontend → POST /api/pedidos/
         ↓
PedidoViewSet.create()
         ↓
Valida mesa disponible
         ↓
PedidoSerializer.create()
         ↓
- Crea Pedido
- Crea PedidoProducto por cada item
- Calcula total
         ↓
Retorna pedido creado (estado: "pendiente")
```

### 2️⃣ **Bartender Despacha Producto**

```
Frontend → POST /api/pedidos/{id}/despachar_producto/
         ↓
PedidoViewSet.despachar_producto()
         ↓
OrderService.despachar_producto()
         ↓
- Descuenta stock
- Marca item.cantidad_despachada = cantidad
- Si todos despachados → pedido.estado = "despachado"
         ↓
Retorna estado actualizado
```

### 3️⃣ **Agregar Productos a Pedido Existente**

```
Frontend → POST /api/pedidos/ (con force_append=true)
         ↓
PedidoViewSet.create()
         ↓
OrderService.add_products_to_existing_order()
         ↓
- Busca pedido activo en mesa
- Marca items viejos como despachados (si estaba despachado)
- Agrega nuevos productos
- Actualiza total
- Resetea estado a "pendiente"
         ↓
Retorna pedido actualizado
```

### 4️⃣ **Finalizar Pedido (Cerrar Cuenta)**

```
Frontend → PUT /api/pedidos/{id}/
         ↓
Body: { "estado": "finalizada" }
         ↓
PedidoViewSet.perform_update()
         ↓
OrderService.process_order_update()
         ↓
(No hace nada especial, solo cambia estado)
         ↓
Mesa queda disponible
```

### 5️⃣ **Cancelar Pedido**

```
Frontend → PUT /api/pedidos/{id}/
         ↓
Body: { "estado": "cancelado" }
         ↓
OrderService.process_order_update()
         ↓
- Devuelve stock de productos despachados
- Resetea cantidad_despachada a 0
         ↓
Mesa queda disponible
```

---

## 📊 FILTROS DE PEDIDOS

El sistema usa `DjangoFilterBackend` con `PedidoFilter`:

```python
# Filtrar por mesera
GET /api/pedidos/?mesera=2

# Filtrar por usuario
GET /api/pedidos/?usuario=1

# Filtrar por estado
GET /api/pedidos/?estado=pendiente

# Filtrar por fecha
GET /api/pedidos/?fecha=2026-02-09

# Filtrar pedidos del sistema (sin mesera)
GET /api/pedidos/?sistema=true

# Combinar filtros
GET /api/pedidos/?mesera=2&estado=pendiente&fecha=2026-02-09
```

---

## 🔒 SEGURIDAD

### **Hashing de PINs**

- Los códigos de meseras se guardan hasheados con `make_password()`
- Se verifica con `check_password()`
- Migración automática de texto plano a hash

### **Tokens de Autenticación**

- Cada usuario tiene un token único
- Se envía en header: `Authorization: Token abc123...`

### **Permisos**

- `IsSuperUser`: Solo admin/staff
- `AllowAny`: Acceso público
- `GlobalAuthentication`: Requiere autenticación

### **Transacciones Atómicas**

- Operaciones críticas usan `transaction.atomic()`
- Si falla algo, se revierte todo (rollback)

---

## 🎯 PUNTOS CLAVE DEL DISEÑO

### ✅ **Separación de Responsabilidades**

- **Models**: Estructura de datos
- **Serializers**: Conversión JSON ↔ Python
- **Views**: Endpoints de API
- **Services**: Lógica de negocio compleja

### ✅ **Manejo de Stock Inteligente**

- No se descuenta al crear pedido (solo al despachar)
- Se devuelve al cancelar
- Transacciones atómicas previenen inconsistencias

### ✅ **Flexibilidad de Usuarios**

- Meseras con PIN
- Admin/Bartender con usuario/contraseña
- Ambos pueden crear pedidos

### ✅ **Prevención de Duplicados**

- Valida que no haya pedido activo en mesa (del mismo día)
- `force_append` permite agregar a pedido existente

### ✅ **Auditoría**

- Movimientos de inventario registrados
- Timestamps automáticos
- Índices en campos clave para performance

---

## 🚀 RESUMEN EJECUTIVO

Tu backend es un **sistema robusto de gestión de bar/restaurante** con:

1. **Gestión de Inventario**: Productos, categorías, stock, movimientos
2. **Sistema de Pedidos**: Creación, despacho, finalización, cancelación
3. **Multi-Usuario**: Meseras (PIN) y Staff (usuario/contraseña)
4. **Reportes**: Ventas por mesera, ventas diarias, totales
5. **Seguridad**: Autenticación con tokens, PINs hasheados, permisos
6. **Integridad**: Transacciones atómicas, validaciones, auditoría

**Arquitectura**: Capas bien definidas (Models → Serializers → Services → Views)
**Performance**: Índices en BD, select_related, prefetch_related
**Escalabilidad**: Servicios reutilizables, código modular

---

¿Necesitas que profundice en alguna parte específica? 🎯
