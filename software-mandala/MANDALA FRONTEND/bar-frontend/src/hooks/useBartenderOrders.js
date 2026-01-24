import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../utils/apiClient';
import toast from 'react-hot-toast';

/**
 * Hook optimized with React Query to manage bartender order fulfillment logic.
 */
export const useBartenderOrders = () => {
    const queryClient = useQueryClient();

    // Query for pending orders
    const { 
        data: pedidos = [], 
        isLoading: loading,
        refetch: refresh
    } = useQuery({
        queryKey: ['pedidos', 'pendiente'],
        queryFn: async () => {
            const response = await apiClient.get('/pedidos/?estado=pendiente');
            return response.data;
        },
        refetchInterval: 30000, // Auto-refresh every 30 seconds
    });

    // Query for company config
    const { data: empresaConfig } = useQuery({
        queryKey: ['config'],
        queryFn: async () => {
            const res = await apiClient.get('/config/');
            if (res.data && res.data.length > 0) return res.data[0];
            return res.data;
        },
        staleTime: 1000 * 60 * 60, // Cache for 1 hour
    });

    // Mutation to update order status (despachado, cancelado, etc.)
    const updateStatusMutation = useMutation({
        mutationFn: async ({ pedidoId, nuevoEstado }) => {
            const response = await apiClient.patch(`/pedidos/${pedidoId}/`, { estado: nuevoEstado });
            return { pedidoId, nuevoEstado, data: response.data };
        },
        onSuccess: ({ pedidoId, nuevoEstado }) => {
            let actionLabel = nuevoEstado === 'despachado' ? 'completado' : nuevoEstado;
            if (nuevoEstado === 'cancelado') actionLabel = 'cancelado';
            
            toast.success(`Pedido #${pedidoId} ${actionLabel}.`);
            
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['pedidos', 'pendiente'] });
        },
        onError: (error, { pedidoId }) => {
            console.error(`Error updating order ${pedidoId}:`, error);
            toast.error("No se pudo actualizar el estado del pedido.");
        }
    });

    // Mutation to dispatch a single product
    const dispatchProductMutation = useMutation({
        mutationFn: async ({ pedidoId, itemId }) => {
            const response = await apiClient.post(`/pedidos/${pedidoId}/despachar_producto/`, { item_id: itemId });
            return { pedidoId, data: response.data };
        },
        onSuccess: ({ data }) => {
            toast.success("Producto marcado como listo");
            
            // If the whole order is now dispatched, invalidate queries
            // Otherwise, we could optimistically update but refreshing is safer
            queryClient.invalidateQueries({ queryKey: ['pedidos', 'pendiente'] });
        },
        onError: (error) => {
            console.error("Error dispatching product:", error);
            toast.error("Error al marcar producto como listo.");
        }
    });

    return {
        pedidos,
        loading,
        empresaConfig,
        refresh,
        updateOrderStatus: (pedidoId, nuevoEstado) => updateStatusMutation.mutate({ pedidoId, nuevoEstado }),
        dispatchProduct: (pedidoId, itemId) => dispatchProductMutation.mutate({ pedidoId, itemId }),
        isUpdating: updateStatusMutation.isPending || dispatchProductMutation.isPending
    };
};
