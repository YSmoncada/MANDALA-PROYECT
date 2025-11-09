// src/services/pedidoService.js
import axios from "axios";
import { API_URL } from "../apiConfig"; // Importar la URL centralizada
const PEDIDOS_API_URL = `${API_URL}/pedidos/`;

export const createPedido = async (pedidoData) => {
    try {
        const response = await axios.post(PEDIDOS_API_URL, pedidoData);
        return response.data;
    } catch (error) {
        console.error("Error al crear el pedido:", error.response?.data || error.message);
        throw error;
    }
};
