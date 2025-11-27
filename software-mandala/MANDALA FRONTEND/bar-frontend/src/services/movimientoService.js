import axios from "axios";
import { API_URL } from "../apiConfig";

const MOVIMIENTOS_API_URL = `${API_URL}/movimientos/`;

/**
 * Registra un nuevo movimiento de inventario (entrada o salida).
 * @param {object} movementData - Datos del movimiento.
 * @returns {Promise<object>} - Respuesta del servidor.
 */
export const createMovimiento = async (movementData) => {
    try {
        const response = await axios.post(MOVIMIENTOS_API_URL, movementData, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response;
    } catch (error) {
        console.error("Error en createMovimiento:", error);
        throw error;
    }
};
