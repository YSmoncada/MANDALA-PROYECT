import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Plus, Clock, Check, X, Loader2 } from 'lucide-react';
import { API_URL } from '../../apiConfig';
import { usePedidosContext } from '../../context/PedidosContext';
import HeaderPedidosDisco from '../pedidospage/HeaderPedidos-Disco';

const MisPedidosPageDisco = () => {
    const { auth, setSelectedMesaId } = usePedidosContext();
    const { mesera, meseraId, codigoConfirmado, handleLogout } = auth;
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!mesera || !codigoConfirmado) {
            navigate('/login-disco');
            return;
        }

        const fetchMisPedidos = async () => {
            try {
                const response = await axios.get(`${API_URL}/pedidos/?mesera=${meseraId}`);

                // Obtener fecha actual
                const hoy = new Date();

                // Filtrar pedidos del día actual
                const pedidosHoy = response.data.filter(p => {
                    const fecha = new Date(p.fecha_hora);
                    return (
                        fecha.getDate() === hoy.getDate() &&
                        fecha.getMonth() === hoy.getMonth() &&
                        fecha.getFullYear() === hoy.getFullYear()
                    );
                });

                // Ordenar por fecha descendente
                const sorted = pedidosHoy.sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora));

                setPedidos(sorted);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMisPedidos();
        const interval = setInterval(fetchMisPedidos, 15000);
        return () => clearInterval(interval);
    }, [mesera, meseraId, codigoConfirmado, navigate]);

    const handleAgregarProductos = (mesaId) => {
        setSelectedMesaId(mesaId);
        navigate('/login-disco');
    };

    const getStatusBadge = (estado) => {
        const statusColors = {
            pendiente: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            despachado: 'bg-green-500/20 text-green-400 border-green-500/30',
            cancelado: 'bg-red-500/20 text-red-400 border-red-500/30',
            entregado: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            en_proceso: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        };
        const statusIcons = {
            pendiente: <Clock size={12} />,
            despachado: <Check size={12} />,
            cancelado: <X size={12} />,
            entregado: <Check size={12} />,
            en_proceso: <Loader2 size={12} className="animate-spin" />,
        };
        const st = estado?.toLowerCase() || 'pendiente';
        return (
            <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold border ${statusColors[st] || 'bg-gray-500/20 text-gray-400'}`}>
                {statusIcons[st]} {st.replace('_', ' ')}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
            <HeaderPedidosDisco mesera={mesera} onLogout={handleLogout} codigoConfirmado={codigoConfirmado} />

            <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-8 pt-24">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-black mb-3 text-white">
                        Mis Pedidos de Hoy
                    </h1>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block p-4 bg-white/5 rounded-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                        </div>
                        <p className="mt-4">Cargando tus pedidos...</p>
                    </div>
                ) : pedidos.length === 0 ? (
                    <div className="text-center py-16 bg-purple-900/20 rounded-3xl border border-purple-500/30 backdrop-blur-sm">
                        <ShoppingBag size={48} className="mx-auto text-purple-400 mb-4" />
                        <p className="text-xl font-bold mb-2">No tienes pedidos hoy</p>
                        <button
                            onClick={() => navigate('/login-disco')}
                            className="mt-4 px-6 py-3 bg-purple-600 rounded-xl font-bold text-white hover:scale-105 transition-transform"
                        >
                            Crear Nuevo Pedido
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pedidos.map(pedido => (
                            <div key={pedido.id} className="bg-purple-950/40 backdrop-blur-md border border-purple-700/40 rounded-2xl p-6">
                                <div className="flex justify-between items-start mb-4 pb-3 border-b border-purple-700/30">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h2 className="font-bold text-xl">Pedido #{pedido.id}</h2>
                                            {getStatusBadge(pedido.estado)}
                                        </div>
                                        <p className="text-sm">
                                            Mesa: <span className="text-pink-400 font-bold">{pedido.mesa_numero}</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs">{new Date(pedido.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        <p className="text-xs">{new Date(pedido.fecha_hora).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-6 max-h-40 overflow-y-auto pr-2">
                                    {pedido.productos_detalle.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-purple-900/40 p-2 rounded-lg text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="bg-purple-600/30 text-purple-400 font-bold px-1.5 py-0.5 rounded text-xs">{item.cantidad}x</span>
                                                <span>{item.producto_nombre}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-purple-700/30 mb-4">
                                    <span className="text-sm">Total</span>
                                    <span className="text-2xl font-black">${parseFloat(pedido.total).toLocaleString('es-CO')}</span>
                                </div>

                                <button
                                    onClick={() => handleAgregarProductos(pedido.mesa)}
                                    className="w-full py-3 bg-purple-700 hover:bg-purple-500 text-white rounded-xl font-bold text-sm uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus size={16} />
                                    Agregar Productos
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MisPedidosPageDisco;
