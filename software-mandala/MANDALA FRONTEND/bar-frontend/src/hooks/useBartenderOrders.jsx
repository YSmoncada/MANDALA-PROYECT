import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';
import toast from 'react-hot-toast';

/**
 * Hook to manage bartender orders logic and state.
 * Handles fetching pending orders, updating status, and dispatching products.
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
            console.error("Error al cargar config empresa:", error);
        }
    }, []);

    const fetchPedidosPendientes = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            const response = await apiClient.get('/pedidos/?estado=pendiente');
            setPedidos(response.data);
        } catch (error) {
            console.error("Error al cargar los pedidos pendientes:", error);
            toast.error("Error al cargar pedidos pendientes");
        } finally {
            if (showLoading) setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPedidosPendientes();
        fetchConfig();
        
        // Auto-refresh every 30 seconds
        const interval = setInterval(() => fetchPedidosPendientes(false), 30000);
        return () => clearInterval(interval);
    }, [fetchPedidosPendientes, fetchConfig]);

    const handlePrint = useCallback((pedido) => {
        setPedidoAImprimir(pedido);
        setTimeout(() => {
            window.print();
        }, 500);
    }, []);

    const handleUpdateEstado = useCallback(async (pedidoId, nuevoEstado) => {
        try {
            await apiClient.patch(`/pedidos/${pedidoId}/`, { estado: nuevoEstado });
            
            let mensaje = '';
            switch (nuevoEstado) {
                case 'despachado': mensaje = 'despachado'; break;
                case 'cancelado': mensaje = 'cancelado'; break;
                case 'en_proceso': mensaje = 'en preparación'; break;
                default: mensaje = 'actualizado';
            }
            
            toast.success(`Pedido #${pedidoId} ${mensaje}.`);
            setPedidos(prevPedidos => prevPedidos.filter(p => p.id !== pedidoId));
        } catch (error) {
            console.error(`Error al actualizar el pedido ${pedidoId}:`, error);
            toast.error('Error al actualizar el pedido');
        }
    }, []);

    const handleDespacharProducto = useCallback(async (pedidoId, itemId) => {
        try {
            const response = await apiClient.post(`/pedidos/${pedidoId}/despachar_producto/`, { item_id: itemId });
            toast.success("Producto marcado como listo");
            
            if (response.data.pedido_estado === 'despachado') {
                setPedidos(prev => prev.filter(p => p.id !== pedidoId));
            } else {
                fetchPedidosPendientes(false);
            }
        } catch (error) {
            console.error("Error al despachar producto:", error);
            toast.error("Error al despachar producto");
        }
    }, [fetchPedidosPendientes]);

    const handleCancelarPedido = useCallback(async (pedidoId) => {
        toast((t) => (
            <div className="bg-[#1A103C] text-white p-5 rounded-xl shadow-lg border border-red-700/50 max-w-sm">
                <p className="font-bold text-lg mb-2 capitalize">Cancelar Pedido</p>
                <p className="text-sm text-gray-300 mb-4">
                    ¿Estás seguro de que deseas <span className="text-red-400 font-bold">cancelar</span> el pedido #{pedidoId}?
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            await handleUpdateEstado(pedidoId, 'cancelado');
                        }}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition text-xs uppercase"
                    >
                        Sí, cancelar
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition text-xs uppercase"
                    >
                        No
                    </button>
                </div>
            </div>
        ), { duration: 6000 });
    }, [handleUpdateEstado]);

    return {
        pedidos,
        loading,
        empresaConfig,
        pedidoAImprimir,
        handlePrint,
        handleUpdateEstado,
        handleDespacharProducto,
        handleCancelarPedido,
        refresh: fetchPedidosPendientes
    };
};
