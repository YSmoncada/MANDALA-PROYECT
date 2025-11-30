import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Clock, X, Loader2 } from 'lucide-react';
import { API_URL } from '../../apiConfig';

const BartenderPageDisco = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchPedidosPendientes = useCallback(async () => {
        try {
            setLoading(true);
            // Fetch both pending and in-process orders if possible. 
            // If the backend doesn't support multiple values, we might need to make two requests or fetch all.
            // For now, let's try to fetch 'pendiente' and if we want 'en_proceso' we might need to adjust.
            // Assuming the user wants to see what is pending.
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
        const interval = setInterval(fetchPedidosPendientes, 30000);
        return () => clearInterval(interval);
    }, [fetchPedidosPendientes]);

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

            // If we move to 'en_proceso' or 'despachado' or 'cancelado', it should be removed from 'pendiente' list
            // unless we want to keep 'en_proceso' visible. 
            // For now, removing it gives immediate feedback that it's "handled" from the pending queue.
            setPedidos(prevPedidos => prevPedidos.filter(p => p.id !== pedidoId));
        } catch (error) {
            console.error(`Error al actualizar el pedido ${pedidoId}:`, error);
            toast.error('Error al actualizar el estado del pedido.');
        }
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 sm:p-8 text-white">
            {/* Subtle background effects */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
            </div>

            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 z-50 flex items-center gap-2 rounded-lg bg-[#441E73]/50 border border-[#6C3FA8] px-4 py-2 text-white hover:bg-[#441E73] transition-all backdrop-blur-md shadow-lg hover:scale-105"
            >
                <ArrowLeft size={18} />
                <span className="font-medium">Volver</span>
            </button>

            <div className="relative z-10 mx-auto max-w-7xl pt-20 sm:pt-0">
                <div className="text-center mb-10">
                    <h1 className="text-5xl md:text-6xl font-black mb-3 bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 bg-clip-text text-transparent">
                        Pedidos Pendientes
                    </h1>
                    <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mx-auto"></div>
                </div>

                {loading && pedidos.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="inline-block p-4 bg-white/5 rounded-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
                        </div>
                        <p className="text-green-300 mt-4">Cargando pedidos...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pedidos.length > 0 ? pedidos.map(pedido => (
                            <div
                                key={pedido.id}
                                className="bg-gray-900/80 backdrop-blur-sm border border-purple-500/30 hover:border-green-400/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02]"
                            >
                                <div>
                                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-purple-800/50">
                                        <h2 className="font-bold text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                            Pedido #{pedido.id}
                                        </h2>
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <Clock size={14} />
                                            {new Date(pedido.fecha_hora).toLocaleTimeString()}
                                        </div>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <p className="text-sm text-gray-300">
                                            Mesa: <span className="font-bold text-xl text-purple-300">{pedido.mesa_numero}</span>
                                        </p>
                                        <p className="text-sm text-gray-300">
                                            Mesera: <span className="font-semibold text-purple-200">{pedido.mesera_nombre}</span>
                                        </p>
                                    </div>
                                    <ul className="space-y-2 text-gray-300 max-h-48 overflow-y-auto pr-2">
                                        {pedido.productos_detalle.map((item, index) => (
                                            <li key={index} className="text-sm flex justify-between bg-black/20 p-2 rounded">
                                                <span className="font-medium">{item.cantidad}x</span>
                                                <span className="flex-1 ml-2">{item.producto_nombre}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Action Buttons Grid */}
                                <div className="grid grid-cols-3 gap-2 mt-5">
                                    <button
                                        onClick={() => handleUpdateEstado(pedido.id, 'cancelado')}
                                        className="bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-600/30 font-bold py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all hover:scale-105"
                                        title="Cancelar Pedido"
                                    >
                                        <X size={20} />
                                        <span className="text-xs">Cancelar</span>
                                    </button>

                                    <button
                                        onClick={() => handleUpdateEstado(pedido.id, 'en_proceso')}
                                        className="bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 border border-yellow-600/30 font-bold py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all hover:scale-105"
                                        title="Marcar en Proceso"
                                    >
                                        <Loader2 size={20} className="animate-spin-slow" />
                                        <span className="text-xs">Procesar</span>
                                    </button>

                                    <button
                                        onClick={() => handleUpdateEstado(pedido.id, 'despachado')}
                                        className="bg-green-600/20 hover:bg-green-600/40 text-green-400 border border-green-600/30 font-bold py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all hover:scale-105"
                                        title="Despachar Pedido"
                                    >
                                        <Check size={20} />
                                        <span className="text-xs">Despachar</span>
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-16">
                                <div className="inline-block p-6 bg-gray-900/50 rounded-2xl border border-purple-500/20">
                                    <p className="text-gray-300 text-xl mb-2">✨ Todo despachado ✨</p>
                                    <p className="text-gray-500 text-sm">No hay pedidos pendientes</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BartenderPageDisco;
