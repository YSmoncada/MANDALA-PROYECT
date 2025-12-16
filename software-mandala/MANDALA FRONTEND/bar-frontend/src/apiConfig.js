// src/apiConfig.js

// La URL base de tu API desplegada en Render.
// Usamos `import.meta.env.VITE_API_URL` si está definida, si no, usamos la URL de producción directamente.
const API_URL = import.meta.env.VITE_API_URL || "https://mandala-proyect.onrender.com/api";

// Para desarrollo local, puedes crear un archivo .env.local en la raíz de tu proyecto frontend
// y añadir la línea: VITE_API_URL=http://127.0.0.1:8000/api

console.log('📡 Usando API URL:', API_URL);

// Exporta la URL completa de la API
export { API_URL };