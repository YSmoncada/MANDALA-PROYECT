import { useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';
import toast from 'react-hot-toast';

/**
 * Hook to manage bartender order fulfillment logic.
 */
export const useBartenderOrders = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [empresaConfig, setEmpresaConfig] = useState(null);
    const [pedidoAImprimir, setPedidoAImprimir] = useState(null);

    const fetchConfig = useCallback(async () => {
        try {
            const res = await apiClient.get('/config/');
            if (res.data && res.data.length > 0) setEmpresaConfig(res.data[0]);
            else if (res.data && res.data.id) setEmpresaConfig(res.data);
        } catch (error) {
            console.error("Error loading company config:", error);
        }
    }, []);

    const fetchPedidosPendientes = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            const response = await apiClient.get('/pedidos/?estado=pendiente');
            setPedidos(response.data);
        } catch (error) {
            console.error("Error loading pending orders:", error);
            toast.error("Error al sincronizar pedidos.");
        } finally {
            if (showLoading) setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPedidosPendientes();
        fetchConfig();
        
        // Polling for new orders every 30 seconds
        const interval = setInterval(() => fetchPedidosPendientes(false), 30000);
        return () => clearInterval(interval);
    }, [fetchPedidosPendientes, fetchConfig]);

    const handlePrint = (pedido) => {
        setPedidoAImprimir(pedido);
        setTimeout(() => {
            window.print();
        }, 500);
    };

    const updateOrderStatus = async (pedidoId, nuevoEstado) => {
        try {
            await apiClient.patch(`/pedidos/${pedidoId}/`, { estado: nuevoEstado });
            
            let actionLabel = nuevoEstado === 'despachado' ? 'completado' : nuevoEstado;
            if (nuevoEstado === 'cancelado') actionLabel = 'cancelado';
            
            toast.success(`Pedido #${pedidoId} ${actionLabel}.`);
            // Optimistic update
            setPedidos(prev => prev.filter(p => p.id !== pedidoId));
        } catch (error) {
            console.error(`Error updating order ${pedidoId}:`, error);
            toast.error("No se pudo actualizar el estado.");
        }
    };

    const dispatchProduct = async (pedidoId, itemId) => {
        try {
            const response = await apiClient.post(`/pedidos/${pedidoId}/despachar_producto/`, { item_id: itemId });
            toast.success("Producto marcado como listo");
            
            // If the whole order is now dispatched, remove it from list
            if (response.data.pedido_estado === 'despachado') {
                setPedidos(prev => prev.filter(p => p.id !== pedidoId));
            } else {
                // Refresh data to update progress
                fetchPedidosPendientes(false);
            }
        } catch (error) {
            console.error("Error dispatching product:", error);
            toast.error("Error al marcar producto.");
        }
    };

    return {
        pedidos,
        loading,
        empresaConfig,
        pedidoAImprimir,
        refresh: () => fetchPedidosPendientes(true),
        handlePrint,
        updateOrderStatus,
        dispatchProduct
    };
};
