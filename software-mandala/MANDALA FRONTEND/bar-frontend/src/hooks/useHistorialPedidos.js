import { useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';
import toast from 'react-hot-toast';

/**
 * Hook to manage order history logic, filtering, and printing.
 */
export const useHistorialPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [vendedores, setVendedores] = useState([]);
    const [empresaConfig, setEmpresaConfig] = useState(null);
    const [pedidoAImprimir, setPedidoAImprimir] = useState(null);
    const [vendedorSeleccionado, setVendedorSeleccionado] = useState('');
    const [fechaSeleccionada, setFechaSeleccionada] = useState(() => {
        const d = new Date();
        const offset = d.getTimezoneOffset();
        const localDate = new Date(d.getTime() - (offset * 60 * 1000));
        return localDate.toISOString().split('T')[0];
    });
    const [loading, setLoading] = useState(true);

    const fetchConfig = useCallback(async () => {
        try {
            const res = await apiClient.get('/config/');
            if (res.data && res.data.length > 0) setEmpresaConfig(res.data[0]);
            else if (res.data && res.data.id) setEmpresaConfig(res.data);
        } catch (error) { 
            console.error('Error loading config:', error); 
        }
    }, []);

    const fetchVendedores = useCallback(async () => {
        try {
            const response = await apiClient.get('/meseras/total-pedidos text-white/');
            // Endpoint fix: The slash at the end might be needed or not depending on URLs
            // Let's use the standard one from the original code
            const res = await apiClient.get('/meseras/total-pedidos/');
            const mapped = res.data.map(v => ({
                id: v.tipo === 'usuario' ? `u${v.mesera_id || v.id}` : `m${v.mesera_id || v.id}`,
                realId: v.mesera_id || v.id,
                nombre: v.mesera_nombre,
                tipo: v.tipo
            }));
            setVendedores(mapped);
        } catch (error) {
            console.error('Error loading sellers:', error);
        }
    }, []);

    const fetchPedidos = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (vendedorSeleccionado) {
                if (vendedorSeleccionado.startsWith('u')) {
                    params.append('usuario', vendedorSeleccionado.substring(1));
                } else if (vendedorSeleccionado.startsWith('m')) {
                    params.append('mesera', vendedorSeleccionado.substring(1));
                }
            }
            if (fechaSeleccionada) params.append('fecha', fechaSeleccionada);
            
            const response = await apiClient.get(`/pedidos/?${params.toString()}`);
            setPedidos(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error loading orders:', error);
            setPedidos([]);
            toast.error("Error al cargar los pedidos.");
        } finally {
            setLoading(false);
        }
    }, [vendedorSeleccionado, fechaSeleccionada]);

    useEffect(() => {
        fetchConfig();
        fetchVendedores();
    }, [fetchConfig, fetchVendedores]);

    useEffect(() => {
        if (vendedorSeleccionado || fechaSeleccionada) {
            fetchPedidos();
        } else {
            setPedidos([]);
            setLoading(false);
        }
    }, [vendedorSeleccionado, fechaSeleccionada, fetchPedidos]);

    const handlePrint = useCallback((pedido) => {
        setPedidoAImprimir(pedido);
        setTimeout(() => {
            window.print();
        }, 500);
    }, []);

    const handleUpdateEstado = useCallback(async (pedidoId, nuevoEstado) => {
        try {
            await apiClient.patch(`/pedidos/${pedidoId}/`, { estado: nuevoEstado });
            toast.success(`Pedido #${pedidoId} actualizado a ${nuevoEstado}`);
            setPedidos(prev => prev.map(p =>
                p.id === pedidoId ? { ...p, estado: nuevoEstado } : p
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('No se pudo actualizar el estado.');
        }
    }, []);

    const handleBorrarHistorial = useCallback(async () => {
        toast((t) => (
            <div className="bg-[#1A103C] text-white p-5 rounded-xl shadow-lg border border-purple-700/50 max-w-sm">
                <p className="font-bold text-lg mb-2 capitalize">Borrar Historial</p>
                <p className="text-sm text-gray-300 mb-4">
                    ¿Estás seguro de que deseas borrar este historial? Esta acción devolverá el stock y <span className="text-pink-400 font-bold">no se puede deshacer</span>.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                const params = new URLSearchParams();
                                if (vendedorSeleccionado) {
                                    if (vendedorSeleccionado.startsWith('u')) params.append('usuario', vendedorSeleccionado.substring(1));
                                    else params.append('mesera', vendedorSeleccionado.substring(1));
                                }
                                if (fechaSeleccionada) params.append('fecha', fechaSeleccionada);

                                await apiClient.delete(`/pedidos/borrar_historial/?${params.toString()}`);
                                toast.success('Historial eliminado y stock restaurado.');
                                setPedidos([]);
                            } catch (error) {
                                console.error('Error clearing history:', error);
                                toast.error('Error al intentar borrar el historial.');
                            }
                        }}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition text-xs uppercase"
                    >
                        Sí, borrar
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition text-xs uppercase"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        ), { duration: 6000 });
    }, [vendedorSeleccionado, fechaSeleccionada]);

    const totalVentas = (Array.isArray(pedidos) ? pedidos : []).reduce((acc, p) => {
        const estado = p.estado?.toLowerCase();
        if (estado === 'despachado' || estado === 'finalizada') {
            return acc + parseFloat(p.total || 0);
        }
        return acc;
    }, 0);

    return {
        pedidos,
        vendedores,
        loading,
        totalVentas,
        fechaSeleccionada,
        vendedorSeleccionado,
        pedidoAImprimir,
        empresaConfig,
        setFechaSeleccionada,
        setVendedorSeleccionado,
        handlePrint,
        handleUpdateEstado,
        handleBorrarHistorial,
        refresh: fetchPedidos
    };
};
