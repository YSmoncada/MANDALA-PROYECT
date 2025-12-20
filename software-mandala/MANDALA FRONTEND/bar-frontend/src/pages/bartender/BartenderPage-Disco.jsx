import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Clock, X, Loader2, Printer } from 'lucide-react';
import { API_URL } from '../../apiConfig';
import TicketPrinter from '../../components/TicketPrinter';

const BartenderPageDisco = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [empresaConfig, setEmpresaConfig] = useState(null);
    const [pedidoAImprimir, setPedidoAImprimir] = useState(null);
    const navigate = useNavigate();

    const fetchConfig = async () => {
        try {
            const res = await axios.get(`${API_URL}/config/`);
            if (res.data && res.data.length > 0) setEmpresaConfig(res.data[0]);
            else if (res.data && res.data.id) setEmpresaConfig(res.data);
        } catch (error) {
            console.error("Error al cargar config empresa:", error);
        }
    };

    const fetchPedidosPendientes = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/pedidos/?estado=pendiente`);
            setPedidos(response.data);
        } catch (error) {
            console.error("Error al cargar los pedidos pendientes:", error);
            toast.error('No se pudieron cargar los pedidos.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPedidosPendientes();
        fetchConfig();
        const interval = setInterval(fetchPedidosPendientes, 30000);
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
            await axios.patch(`${API_URL}/pedidos/${pedidoId}/`, { estado: nuevoEstado });
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
            toast.error('Error al actualizar el estado del pedido.');
        }
    };

    const handleDespacharProducto = async (pedidoId, itemId) => {
        try {
            const response = await axios.post(`${API_URL}/pedidos/${pedidoId}/despachar_producto/`, { item_id: itemId });
            toast.success("Producto marcado como listo");
            if (response.data.pedido_estado === 'despachado') {
                setPedidos(prev => prev.filter(p => p.id !== pedidoId));
            } else {
                fetchPedidosPendientes();
            }
        } catch (error) {
            console.error("Error al despachar producto:", error);
            toast.error("Error al marcar producto.");
        }
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 sm:p-8 text-white">
            <TicketPrinter pedido={pedidoAImprimir} empresaConfig={empresaConfig} />

            <div className="absolute inset-0 opacity-20 no-print">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
            </div>

            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 z-50 flex items-center gap-2 rounded-lg bg-[#441E73]/50 border border-[#6C3FA8] px-4 py-2 text-white hover:bg-[#441E73] transition-all backdrop-blur-md shadow-lg hover:scale-105 no-print"
            >
                <ArrowLeft size={18} />
                <span className="font-medium">Volver</span>
            </button>

            <div className="relative z-10 mx-auto max-w-7xl pt-20 sm:pt-0 no-print">
                <div className="text-center mb-10">
                    <h1 className="text-5xl md:text-6xl font-black mb-3 bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 bg-clip-text text-transparent">
                        Pedidos Pendientes
                    </h1>
                    <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mx-auto"></div>
                </div>

                {loading && pedidos.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto mb-4"></div>
                        <p className="text-green-300">Cargando pedidos...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pedidos.length > 0 ? pedidos.map(pedido => (
                            <div
                                key={pedido.id}
                                className="bg-gray-900/80 backdrop-blur-sm border border-purple-500/30 hover:border-green-400/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01]"
                            >
                                <div>
                                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-purple-800/50">
                                        <h2 className="font-bold text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                            Pedido #{pedido.id}
                                        </h2>
                                        <button
                                            onClick={() => handlePrint(pedido)}
                                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-purple-400 hover:text-white transition-all border border-white/5"
                                            title="Imprimir Ticket"
                                        >
                                            <Printer size={18} />
                                        </button>
                                    </div>
                                    <div className="space-y-1 mb-4">
                                        <p className="text-sm text-gray-300">Mesa: <span className="font-bold text-xl text-purple-300">{pedido.mesa_numero}</span></p>
                                        <p className="text-sm text-gray-400">Atiende: {pedido.mesera_nombre}</p>
                                        <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                            <Clock size={10} /> {new Date(pedido.fecha_hora).toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <ul className="space-y-2 mb-4">
                                        {pedido.productos_detalle.map((item, index) => (
                                            <li key={index} className="text-sm flex justify-between items-center group">
                                                <span className="text-white/80 group-hover:text-white transition-colors">
                                                    <span className="font-bold text-purple-400 mr-2">{item.cantidad}x</span>
                                                    {item.producto_nombre}
                                                </span>
                                                {item.cantidad - (item.cantidad_despachada || 0) > 0 && (
                                                    <button
                                                        onClick={() => handleDespacharProducto(pedido.id, item.id)}
                                                        className="p-1 bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white rounded transition-all"
                                                    >
                                                        <Check size={12} />
                                                    </button>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5">
                                    <button
                                        onClick={() => handleUpdateEstado(pedido.id, 'cancelado')}
                                        className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1"
                                    >
                                        <X size={14} /> Cancelar
                                    </button>
                                    <button
                                        onClick={() => handleUpdateEstado(pedido.id, 'despachado')}
                                        className="bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white border border-green-500/20 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1"
                                    >
                                        <Check size={14} /> Listo
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-20 bg-gray-900/30 rounded-3xl border border-dashed border-white/10">
                                <p className="text-gray-500 italic">No hay pedidos pendientes por ahora.</p>
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
        </div>
    );
};

export default BartenderPageDisco;
