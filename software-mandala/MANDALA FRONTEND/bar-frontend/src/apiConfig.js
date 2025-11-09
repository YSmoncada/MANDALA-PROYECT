// src/apiConfig.js

// Detecta si estamos en modo de desarrollo en red local
const isNetwork = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// Usa la IP de la computadora si está en red, si no, usa localhost
const API_HOST = isNetwork ? window.location.hostname : '127.0.0.1';

// Exporta la URL completa de la API
export const API_URL = `http://${API_HOST}:8000/api`;