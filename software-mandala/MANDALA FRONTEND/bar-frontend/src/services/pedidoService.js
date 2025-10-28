// src/services/pedidoService.js
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/pedidos/";

export const createPedido = async (pedidoData) => {
    try {
        const response = await axios.post(API_URL, pedidoData);
        return response.data;
    } catch (error) {
        console.error("Error al crear el pedido:", error.response?.data || error.message);
        throw error;
    }
};
