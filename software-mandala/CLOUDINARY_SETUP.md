# 📸 Guía de Configuración de Cloudinary para Subida de Imágenes

## ✅ Cambios Realizados

### 1. **Backend - Django Settings** (`backend/settings.py`)
Se agregaron las siguientes configuraciones:

```python
# Cloudinary Configuration
cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key=os.environ.get('CLOUDINARY_API_KEY'),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET'),
    secure=True
)

# Media Files Configuration
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Use Cloudinary for media storage in production
if not DEBUG:
    DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
```

### 2. **Installed Apps**
Se agregaron a `INSTALLED_APPS`:
- `cloudinary_storage`
- `cloudinary`

### 3. **Modelo Producto**
El campo `imagen` ya está configurado como `ImageField`:
```python
imagen = models.ImageField(upload_to='productos/', blank=True, null=True)
```

## 🔑 Configuración de Variables de Entorno

### **Paso 1: Obtener Credenciales de Cloudinary**

1. Ve a [Cloudinary](https://cloudinary.com/) y crea una cuenta gratuita (si no tienes una)
2. Una vez dentro del dashboard, encontrarás tus credenciales:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### **Paso 2: Configurar Variables de Entorno en Render**

Para tu backend en Render:

1. Ve a tu servicio en Render Dashboard
2. Click en **"Environment"** en el menú lateral
3. Agrega las siguientes variables de entorno:

```
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

4. Click en **"Save Changes"**
5. Render automáticamente redesplegará tu aplicación

### **Paso 3: Configurar Variables de Entorno Localmente**

Para desarrollo local, crea un archivo `.env` en la raíz del proyecto backend:

```env
# .env
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
DEBUG=True
```

**Nota:** Asegúrate de que `.env` esté en tu `.gitignore` para no subir credenciales a GitHub.

Para cargar las variables de entorno en desarrollo, instala `python-dotenv`:

```bash
pip install python-dotenv
```

Y agrega al inicio de `settings.py`:

```python
from dotenv import load_dotenv
load_dotenv()
```

## 🚀 Desplegar los Cambios

### **En Render:**

1. Haz commit de los cambios:
```bash
git add .
git commit -m "Configurar Cloudinary para subida de imágenes"
git push origin main
```

2. Render detectará los cambios y redesplegará automáticamente

3. Verifica que las variables de entorno estén configuradas en Render

### **Verificar que Funciona:**

1. Ve a tu aplicación frontend
2. Intenta subir una imagen a un producto
3. La imagen debería subirse a Cloudinary y mostrarse correctamente
4. Puedes verificar en tu dashboard de Cloudinary que las imágenes se están subiendo

## 🔍 Solución de Problemas

### **Error: "La configuración para subir imágenes no está completa"**
- ✅ **Solución:** Verifica que las variables de entorno de Cloudinary estén configuradas en Render
- Revisa que los nombres de las variables sean exactamente: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

### **Las imágenes no se muestran en el frontend**
- Verifica que el backend esté retornando URLs completas de Cloudinary
- Revisa la consola del navegador para ver si hay errores de CORS
- Asegúrate de que las URLs de Cloudinary sean accesibles públicamente

### **Error 500 al subir imagen**
- Revisa los logs de Render para ver el error específico
- Verifica que Pillow esté instalado: `pip install Pillow`
- Confirma que las credenciales de Cloudinary sean correctas

## 📝 Notas Importantes

1. **Cloudinary Gratis:** El plan gratuito de Cloudinary incluye:
   - 25 GB de almacenamiento
   - 25 GB de ancho de banda mensual
   - Suficiente para proyectos pequeños y medianos

2. **Formato de Imágenes:** Cloudinary optimiza automáticamente las imágenes

3. **Seguridad:** Las credenciales de Cloudinary deben mantenerse secretas y nunca subirse a GitHub

4. **Producción vs Desarrollo:** 
   - En producción (`DEBUG=False`), las imágenes se suben a Cloudinary
   - En desarrollo (`DEBUG=True`), las imágenes se guardan localmente en `/media/`

## ✨ Próximos Pasos

Una vez configuradas las variables de entorno en Render:

1. ✅ El backend podrá recibir imágenes
2. ✅ Las imágenes se subirán automáticamente a Cloudinary
3. ✅ El frontend recibirá las URLs de Cloudinary para mostrar las imágenes
4. ✅ Las imágenes estarán disponibles globalmente con CDN de Cloudinary

---

**¿Necesitas ayuda?** Revisa los logs de Render o la consola del navegador para más detalles sobre cualquier error.
