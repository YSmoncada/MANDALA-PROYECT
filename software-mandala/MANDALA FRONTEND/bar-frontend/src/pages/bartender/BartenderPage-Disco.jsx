import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../../utils/apiClient';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Check, Clock, X, Loader2, Printer, RefreshCw } from 'lucide-react';
import TicketPrinter from '../../components/TicketPrinter';
import PageLayout from '../../components/PageLayout';
import { UI_CLASSES } from '../../constants/ui';

const BartenderPageDisco = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [empresaConfig, setEmpresaConfig] = useState(null);
    const [pedidoAImprimir, setPedidoAImprimir] = useState(null);
    const navigate = useNavigate();

    const fetchConfig = async () => {
        try {
            const res = await apiClient.get('/config/');
            if (res.data && res.data.length > 0) setEmpresaConfig(res.data[0]);
            else if (res.data && res.data.id) setEmpresaConfig(res.data);
        } catch (error) {
            console.error("Error al cargar config empresa:", error);
        }
    };

    const fetchPedidosPendientes = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            const response = await apiClient.get('/pedidos/?estado=pendiente');
            setPedidos(response.data);
        } catch (error) {
            console.error("Error al cargar los pedidos pendientes:", error);
        } finally {
            if (showLoading) setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPedidosPendientes();
        fetchConfig();
        const interval = setInterval(() => fetchPedidosPendientes(false), 30000);
        return () => clearInterval(interval);
    }, [fetchPedidosPendientes]);

    const handlePrint = (pedido) => {
        setPedidoAImprimir(pedido);
        setTimeout(() => {
            window.print();
        }, 500);
    };

    const handleUpdateEstado = async (pedidoId, nuevoEstado) => {
        try {
            // Si se cancela el pedido, devolvemos los productos al inventario
            if (nuevoEstado === 'cancelado') {
                const pedidoACancelar = pedidos.find(p => p.id === pedidoId);
                if (pedidoACancelar && pedidoACancelar.productos_detalle) {
                    const devoluciones = pedidoACancelar.productos_detalle.map(item => {
                        // Intentamos obtener el ID del producto (puede venir como objeto o ID directo)
                        const productoId = item.producto?.id || item.producto || item.producto_id;
                        if (!productoId) return null;

                        return apiClient.put(`/productos/${productoId}/stock`, {
                            cantidad: item.cantidad,
                            accion: 'sumar' // 'sumar' devuelve el stock
                        });
                    });
                    await Promise.all(devoluciones);
                }
            }

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
        }
    };

    const handleDespacharProducto = async (pedidoId, itemId) => {
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
        }
    };

    return (
        <PageLayout title="Pedidos Pendientes">
            <TicketPrinter pedido={pedidoAImprimir} empresaConfig={empresaConfig} />

            <div className="max-w-7xl mx-auto pb-20 no-print">
                {/* Header Actions */}
                <div className="flex justify-end mb-8 gap-4 px-4 sm:px-0">
                    <button
                        onClick={() => fetchPedidosPendientes(true)}
                        className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all shadow-lg active:scale-95"
                        title="Actualizar pedidos"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>

                {loading && pedidos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-6"></div>
                        <p className="text-emerald-400 font-black tracking-[0.3em] text-xs">BUSCANDO PEDIDOS...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0">
                        {pedidos.length > 0 ? pedidos.map(pedido => (
                            <div
                                key={pedido.id}
                                className={`${UI_CLASSES.glassCard} hover:border-emerald-500/40 p-5 flex flex-col justify-between transition-all duration-300 transform hover:translate-y-[-4px] active:scale-[0.98]`}
                            >
                                <div>
                                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
                                        <h2 className="font-black text-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent italic">
                                            #{pedido.id}
                                        </h2>
                                        <button
                                            onClick={() => handlePrint(pedido)}
                                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-emerald-400 hover:text-white transition-all border border-white/5 shadow-lg"
                                            title="Imprimir Ticket"
                                        >
                                            <Printer size={18} />
                                        </button>
                                    </div>
                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Mesa</span>
                                            <span className="font-black text-2xl text-white">{pedido.mesa_numero}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Atiende</span>
                                            <span className="text-sm font-bold text-gray-300 uppercase">{pedido.mesera_nombre}</span>
                                        </div>
                                        <p className="text-[10px] text-gray-500 flex items-center justify-end gap-1 font-mono">
                                            <Clock size={10} /> {new Date(pedido.fecha_hora).toLocaleTimeString()}
                                        </p>
                                    </div>

                                    <div className="space-y-3 mb-6 bg-black/20 p-4 rounded-xl border border-white/5">
                                        {pedido.productos_detalle.map((item, index) => (
                                            <div key={index} className="flex justify-between items-start group">
                                                <div className="flex gap-3">
                                                    <span className="font-black text-emerald-400 text-lg">x{item.cantidad}</span>
                                                    <span className="text-sm font-bold text-white uppercase mt-1 leading-tight">{item.producto_nombre}</span>
                                                </div>
                                                {item.cantidad - (item.cantidad_despachada || 0) > 0 && (
                                                    <button
                                                        onClick={() => handleDespacharProducto(pedido.id, item.id)}
                                                        className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-lg transition-all border border-emerald-500/20 shadow-lg"
                                                    >
                                                        <Check size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    <button
                                        onClick={() => handleUpdateEstado(pedido.id, 'cancelado')}
                                        className={`${UI_CLASSES.buttonDanger} text-xs py-3 uppercase tracking-tighter`}
                                    >
                                        <X size={16} /> Cancelar
                                    </button>
                                    <button
                                        onClick={() => handleUpdateEstado(pedido.id, 'despachado')}
                                        className={`${UI_CLASSES.buttonSuccess} text-xs py-3 uppercase tracking-tighter bg-emerald-600`}
                                    >
                                        <Check size={16} /> Completar
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-32 bg-white/5 rounded-[40px] border-2 border-dashed border-white/10">
                                <p className="text-gray-500 font-black tracking-widest uppercase text-xs">No hay pedidos pendientes por ahora</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .no-print { display: none !important; }
                }
            `}} />
        </PageLayout>
    );
};

export default BartenderPageDisco;
