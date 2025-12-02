import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, DollarSign, ShoppingBag, TrendingUp, Check, X, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../../apiConfig';

const HistorialPedidosPageDisco = () => {
    const [pedidos, setPedidos] = useState([]);
    const [meseras, setMeseras] = useState([]);
    const [meseraSeleccionada, setMeseraSeleccionada] = useState('');
    const [fechaSeleccionada, setFechaSeleccionada] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // YYYY-MM-DD
    });
    const [totalMostrado, setTotalMostrado] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch meseras once on mount
    useEffect(() => {
        const fetchMeseras = async () => {
            try {
                const response = await axios.get(`${API_URL}/meseras/`);
                setMeseras(response.data);
            } catch (error) {
                console.error('Error al cargar las meseras:', error);
            }
        };
        fetchMeseras();
    }, []);

    // Fetch pedidos whenever filters change
    useEffect(() => {
        const fetchPedidos = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (meseraSeleccionada) params.append('mesera', meseraSeleccionada);
                if (fechaSeleccionada) params.append('fecha', fechaSeleccionada);
                const response = await axios.get(`${API_URL}/pedidos/?${params.toString()}`);
                // Filter by exact local date (YYYY-MM-DD) using locale string to avoid timezone shifts
                const filtered = response.data.filter(pedido => {
                    const datePart = new Date(pedido.fecha_hora).toLocaleDateString('en-CA');
                    return datePart === fechaSeleccionada;
                });
                setPedidos(filtered);
            } catch (error) {
                console.error('Error al cargar los pedidos:', error);
                setPedidos([]);
            } finally {
                setLoading(false);
            }
        };

        if (meseraSeleccionada || fechaSeleccionada) {
            fetchPedidos();
        } else {
            setPedidos([]);
        }
    }, [meseraSeleccionada, fechaSeleccionada]);

    // Calculate total when pedidos change
    useEffect(() => {
        const total = pedidos.reduce((acc, p) => {
            // Only sum if status is NOT 'cancelado' and NOT 'pendiente'
            const estado = p.estado?.toLowerCase();
            if (estado !== 'cancelado' && estado !== 'pendiente') {
                return acc + parseFloat(p.total);
            }
            return acc;
        }, 0);
        setTotalMostrado(total);
    }, [pedidos]);

    const handleUpdateEstado = async (pedidoId, nuevoEstado) => {
        try {
            await axios.patch(`${API_URL}/pedidos/${pedidoId}/`, { estado: nuevoEstado });
            toast.success(`Pedido #${pedidoId} actualizado a ${nuevoEstado}`);
            // Update local state
            setPedidos(prev => prev.map(p =>
                p.id === pedidoId ? { ...p, estado: nuevoEstado } : p
            ));
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            toast.error('No se pudo actualizar el estado');
        }
    };

    const StatusSelector = ({ pedido }) => {
        const [isOpen, setIsOpen] = useState(false);
        const currentStatus = pedido.estado?.toLowerCase() || 'pendiente';

        const statusColors = {
            pendiente: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            despachado: 'bg-green-500/20 text-green-400 border-green-500/30',
            cancelado: 'bg-red-500/20 text-red-400 border-red-500/30',
            entregado: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            en_proceso: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        };

        const statusIcons = {
            pendiente: <Clock size={14} />,
            despachado: <Check size={14} />,
            cancelado: <X size={14} />,
            entregado: <Check size={14} />,
            en_proceso: <Clock size={14} />,
        };

        return (
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all hover:brightness-110 ${statusColors[currentStatus] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}
                >
                    {statusIcons[currentStatus]}
                    {currentStatus.replace('_', ' ')}
                </button>

                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                        <div className="absolute top-full left-0 mt-2 w-48 bg-[#1A1B2F] border border-purple-500/30 rounded-xl shadow-xl z-20 overflow-hidden backdrop-blur-xl">
                            {['pendiente', 'despachado', 'cancelado'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        handleUpdateEstado(pedido.id, status);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-white/5 transition-colors flex items-center gap-3 ${currentStatus === status ? 'text-white bg-white/10' : 'text-gray-400'}`}
                                >
                                    <span className={`p-1 rounded-md ${statusColors[status]}`}>
                                        {statusIcons[status]}
                                    </span>
                                    <span className="capitalize">{status.replace('_', ' ')}</span>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    };

    const getTituloTotal = () => {
        const nombreMesera = meseras.find(m => m.id == meseraSeleccionada)?.nombre;
        const fechaFormateada = fechaSeleccionada
            ? new Date(fechaSeleccionada + 'T00:00:00').toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
            : '';
        if (nombreMesera && fechaFormateada) return `Ventas de ${nombreMesera} el ${fechaFormateada}`;
        if (nombreMesera) return `Total de Ventas de ${nombreMesera}`;
        if (fechaFormateada) return `Total de Ventas para el ${fechaFormateada}`;
        return 'Seleccione un filtro para ver el total';
    };

    const limpiarFiltros = () => {
        setMeseraSeleccionada('');
        setFechaSeleccionada('');
        setPedidos([]);
    };

    const cantidadPedidos = pedidos.length;
    const promedioVenta = cantidadPedidos > 0 ? totalMostrado / cantidadPedidos : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 sm:p-8 text-white relative">
            {/* Background effects */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
            </div>

            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 z-50 flex items-center gap-2 rounded-lg bg-[#441E73]/50 border border-[#6C3FA8] px-4 py-2 text-white hover:bg-[#441E73] transition-all backdrop-blur-md shadow-lg hover:scale-105"
            >
                <ArrowLeft size={18} />
                <span className="font-medium">Volver</span>
            </button>

            <div className="relative z-10 max-w-6xl mx-auto pt-20 sm:pt-0">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-5xl md:text-6xl font-black mb-3 text-white drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                        Historial de Pedidos
                    </h1>
                    <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mx-auto"></div>
                </div>

                {/* Filters */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-6 mb-8 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Mesera Filter */}
                        <div className="w-full">
                            <label className="flex items-center gap-2 mb-2 text-xs sm:text-sm font-semibold text-white">
                                <User size={16} className="text-yellow-400" /> Mesera
                            </label>
                            <select
                                value={meseraSeleccionada}
                                onChange={e => setMeseraSeleccionada(e.target.value)}
                                className="bg-gray-900/80 backdrop-blur-sm border border-purple-500/30 text-white text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 sm:p-3"
                            >
                                <option value="">-- Todas --</option>
                                {meseras.map(m => (<option key={m.id} value={m.id}>{m.nombre}</option>))}
                            </select>
                        </div>

                        {/* Date Filter */}
                        <div className="w-full">
                            <label className="flex items-center gap-2 mb-2 text-xs sm:text-sm font-semibold text-white">
                                <Calendar size={16} className="text-yellow-400" /> Fecha
                            </label>
                            <input
                                type="date"
                                value={fechaSeleccionada}
                                onChange={e => setFechaSeleccionada(e.target.value)}
                                className="bg-gray-900/80 backdrop-blur-sm border border-purple-500/30 text-white text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 sm:p-3"
                            />
                        </div>

                        {/* Clear Button */}
                        <div className="w-full flex items-end">
                            <button
                                onClick={limpiarFiltros}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg w-full transition-all hover:scale-105 text-sm"
                            >
                                Limpiar Todo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                {pedidos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-yellow-500/20 rounded-lg">
                                    <ShoppingBag size={24} className="text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Total Pedidos</p>
                                    <p className="text-3xl font-black text-white">{cantidadPedidos}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <DollarSign size={24} className="text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Total Vendido</p>
                                    <p className="text-3xl font-black text-white">{totalMostrado.toLocaleString('es-CO')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <TrendingUp size={24} className="text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Promedio/Pedido</p>
                                    <p className="text-3xl font-black text-white">{promedioVenta.toLocaleString('es-CO', { maximumFractionDigits: 0 })}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Order List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block p-4 bg-white/5 rounded-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                        </div>
                        <p className="text-purple-300 mt-4">Cargando pedidos...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pedidos.length > 0 ? pedidos.map(pedido => (
                            <div key={pedido.id} className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-yellow-400/30 rounded-xl p-6 transition-all duration-300 hover:scale-[1.01]">
                                <div className="flex justify-between items-start mb-4 pb-3 border-b border-white/10">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h2 className="font-black text-2xl text-white">Pedido #{pedido.id}</h2>
                                            {/* Replaced static badge with StatusSelector */}
                                            <StatusSelector pedido={pedido} />
                                        </div>
                                        <p className="text-sm text-gray-400">Mesa: <span className="text-yellow-400 font-semibold">{pedido.mesa_numero}</span></p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">{new Date(pedido.fecha_hora).toLocaleDateString()}</p>
                                        <p className="text-sm text-gray-400">{new Date(pedido.fecha_hora).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-4">
                                    {pedido.productos_detalle.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-black/20 p-3 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-yellow-500/20 text-yellow-400 font-bold px-2 py-1 rounded text-sm">{item.cantidad}x</span>
                                                <span className="text-white font-medium">{item.producto_nombre}</span>
                                            </div>
                                            <span className="text-white font-bold">{(parseFloat(item.producto_precio) * item.cantidad).toLocaleString('es-CO')}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-white/10">
                                    <span className="text-gray-400 font-medium">Total del Pedido</span>
                                    <span className="text-3xl font-black text-white">{parseFloat(pedido.total).toLocaleString('es-CO')}</span>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-16">
                                <div className="inline-block p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
                                    <p className="text-gray-400 text-lg">
                                        {(() => {
                                            if (meseraSeleccionada && fechaSeleccionada) return 'No hay pedidos para esta mesera en la fecha seleccionada.';
                                            if (meseraSeleccionada) return 'No hay pedidos para esta mesera.';
                                            if (fechaSeleccionada) return 'No se encontraron pedidos para la fecha seleccionada.';
                                            return 'Seleccione una mesera o una fecha para ver los pedidos.';
                                        })()}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistorialPedidosPageDisco;
