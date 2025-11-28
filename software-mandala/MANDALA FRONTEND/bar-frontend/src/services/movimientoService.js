import apiClient from "../utils/apiClient";

/**
 * Registra un nuevo movimiento de inventario (entrada o salida).
 * @param {object} movementData - Datos del movimiento.
 * @returns {Promise<object>} - Respuesta del servidor.
 */
export const createMovimiento = async (movementData) => {
    try {
        const response = await apiClient.post('/movimientos/', movementData);
        return response;
    } catch (error) {
        console.error("Error en createMovimiento:", error);
        throw error;
    }
};
