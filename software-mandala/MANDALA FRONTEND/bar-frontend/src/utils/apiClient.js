import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../apiConfig';

// Crear instancia de Axios con configuración base
const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 15000, // 15 segundos
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de peticiones para añadir el Token de forma automática
apiClient.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de respuestas para manejo global de errores
apiClient.interceptors.response.use(
    // Respuestas exitosas pasan sin modificación
    (response) => response,

    // Manejo de errores
    (error) => {
        // Error de red (sin conexión, timeout, etc.)
        if (!error.response) {
            if (error.code === 'ECONNABORTED') {
                toast.error('⏱️ La solicitud tardó demasiado. Verifica tu conexión.');
            } else if (error.message === 'Network Error') {
                toast.error('🌐 Sin conexión al servidor. Verifica que el backend esté corriendo.');
            } else {
                toast.error('❌ Error de conexión. Intenta de nuevo.');
            }
            return Promise.reject(error);
        }

        // Errores HTTP con respuesta del servidor
        const { status, data } = error.response;

        switch (status) {
            case 400:
                // Bad Request - mostrar mensaje del servidor si existe
                const message400 = data?.detail || data?.message || 'Solicitud inválida';
                toast.error(`⚠️ ${message400}`);
                break;

            case 401:
                toast.error('🔒 No autorizado. Por favor inicia sesión.');
                break;

            case 403:
                toast.error('🚫 No tienes permisos para realizar esta acción.');
                break;

            case 404:
                toast.error('🔍 Recurso no encontrado.');
                break;

            case 500:
                toast.error('💥 Error del servidor. Intenta más tarde.');
                break;

            case 503:
                toast.error('🔧 Servicio no disponible. El servidor está en mantenimiento.');
                break;

            default:
                // Otros errores
                const messageDefault = data?.detail || data?.message || 'Error desconocido';
                toast.error(`❌ ${messageDefault}`);
        }

        return Promise.reject(error);
    }
);

export default apiClient;
