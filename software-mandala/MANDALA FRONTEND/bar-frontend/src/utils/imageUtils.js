import { API_URL } from '../apiConfig';

export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Formato de imagen no válido. Use JPEG, PNG, GIF o WebP.');
  }

  if (file.size > maxSize) {
    throw new Error('La imagen es demasiado grande. Máximo 5MB.');
  }

  return true;
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // Si es un data URL o ya es una URL completa (Cloudinary, S3, etc.)
  if (imagePath.startsWith('data:') || imagePath.startsWith('http')) {
    return imagePath;
  }

  // Si no comienza con /, agregarlo
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  // Usar la URL base de la API (quitando el sufijo /api si existe) para construir la URL de la imagen
  // Esto asume que las imágenes se sirven desde la raíz del backend o una carpeta estática relativa
  const baseUrl = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;

  return `${baseUrl}${path}`;
};

export const createImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
