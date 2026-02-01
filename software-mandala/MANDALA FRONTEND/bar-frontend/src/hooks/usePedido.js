import { useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';

/**
 * Hook to manage mesa selection and order finalization.
 */
export const usePedido = () => {
    const [mesas, setMesas] = useState([]);
    const [selectedMesaId, setSelectedMesaId] = useState('');
    const [isTableLocked, setIsTableLocked] = useState(false);
    const [isLoadingMesas, setIsLoadingMesas] = useState(true);

    const fetchMesas = useCallback(async () => {
        try {
            setIsLoadingMesas(true);
            const response = await apiClient.get('/mesas/');
            setMesas(response.data);
            // Don't auto-select any mesa - let user choose explicitly
            // or let it be set from MisPedidosPage when adding to existing order
        } catch (error) {
            console.error("Error loading mesas:", error);
        } finally {
            setIsLoadingMesas(false);
        }
    }, []);

    useEffect(() => {
        fetchMesas();
    }, [fetchMesas]);

    const finalizarPedido = useCallback(async (pedidoData) => {
        try {
            await apiClient.post('/pedidos/', pedidoData);
            return { success: true, message: "¡Pedido finalizado y guardado con éxito!" };
        } catch (error) {
            console.error("Error finalizing order:", error.response?.data || error.message);
            let errorMessage = "Hubo un error al guardar el pedido. Por favor, inténtalo de nuevo.";
            
            // Priorizar el campo 'detail' que viene del backend
            if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail;
            } else if (error.response?.data && typeof error.response.data === 'object') {
                errorMessage = Object.entries(error.response.data)
                    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                    .join('\n');
            } else if (error.response?.data) {
                errorMessage = error.response.data;
            }
            
            return { success: false, message: errorMessage };
        }
    }, []);

    return { 
        mesas, 
        selectedMesaId, 
        setSelectedMesaId, 
        isLoadingMesas, 
        finalizarPedido, 
        isTableLocked, 
        setIsTableLocked,
        refreshMesas: fetchMesas
    };
};