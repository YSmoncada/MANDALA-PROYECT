// src/services/pedidoService.js
import apiClient from "../utils/apiClient";

export const createPedido = async (pedidoData) => {
    try {
        const response = await apiClient.post("/pedidos/", pedidoData);
        return response.data;
    } catch (error) {
        console.error("Error al crear el pedido:", error.response?.data || error.message);
        throw error;
    }
};
