// src/hooks/usePedido.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../apiConfig'; // Importar la URL centralizada

export const usePedido = () => {
    const [mesas, setMesas] = useState([]);
    const [selectedMesaId, setSelectedMesaId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchMesas = async () => {
            try {
                const response = await axios.get(`${API_URL}/mesas/`);
                setMesas(response.data);
                if (response.data.length > 0) {
                    setSelectedMesaId(response.data[0].id);
                }
            } catch (error) {
                console.error("Error al cargar las mesas:", error);
                alert("No se pudieron cargar las mesas. Asegúrate de que el servidor backend esté funcionando.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchMesas();
    }, []);

    const finalizarPedido = async (pedidoData) => {
        try {
            await axios.post(`${API_URL}/pedidos/`, pedidoData);
            return { success: true, message: "¡Pedido finalizado y guardado con éxito!" };
        } catch (error) {
            console.error("Error al finalizar el pedido:", error.response?.data || error.message);
            let errorMessage = "Hubo un error al guardar el pedido. Por favor, inténtalo de nuevo.";
            if (error.response && typeof error.response.data === 'object') {
                errorMessage = Object.entries(error.response.data)
                    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                    .join('\n');
            } else if (error.response?.data) {
                errorMessage = error.response.data;
            }
            return { success: false, message: `Error al guardar pedido:\n${errorMessage}` };
        }
    };

    return { mesas, selectedMesaId, setSelectedMesaId, isLoading, finalizarPedido };
};