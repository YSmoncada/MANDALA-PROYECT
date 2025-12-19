import axios from 'axios';

// La URL base de tu API desplegada en Render.
// Usamos `import.meta.env.VITE_API_URL` si está definida, si no, usamos la URL de producción directamente.
const API_URL = import.meta.env.VITE_API_URL || "https://mandala-proyect.onrender.com/api";

// Configuración global de axios para permitir el uso de sesiones/cookies
axios.defaults.withCredentials = true;

console.log('📡 Usando API URL:', API_URL);

// Exporta la URL completa de la API
export { API_URL };