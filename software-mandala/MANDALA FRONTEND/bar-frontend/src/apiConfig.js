// src/apiConfig.js

// Intentar usar la variable de entorno primero
const envApiUrl = import.meta.env.VITE_API_URL;

// Si no hay variable de entorno, usar la lógica de auto-detección como fallback
let API_URL;

if (envApiUrl) {
    // Usar la URL de la variable de entorno
    API_URL = envApiUrl;
    console.log('📡 Usando API URL desde variable de entorno:', API_URL);
} else {
    // Fallback: Detectar automáticamente (comportamiento original)
    const isNetwork = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const API_HOST = isNetwork ? window.location.hostname : '127.0.0.1';
    API_URL = `http://${API_HOST}:8000/api`;
    console.log('📡 Auto-detectando API URL:', API_URL);
}

// Exporta la URL completa de la API
export { API_URL };