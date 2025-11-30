import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import { API_URL } from '../../apiConfig';

const HistorialPedidosPageDisco = () => {
    const [pedidos, setPedidos] = useState([]);
    const [meseras, setMeseras] = useState([]);
    const [meseraSeleccionada, setMeseraSeleccionada] = useState('');
    const [fechaSeleccionada, setFechaSeleccionada] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [totalMostrado, setTotalMostrado] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMeseras = async () => {
            try {
                const response = await axios.get(`${API_URL}/meseras/`);
                setMeseras(response.data);
            } catch (error) {
                console.error("Error al cargar las meseras:", error);
            }
        };
        fetchMeseras();
    }, []);

    useEffect(() => {
        const fetchPedidos = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (meseraSeleccionada) params.append('mesera', meseraSeleccionada);
                if (fechaSeleccionada) {
                    const date = new Date(fechaSeleccionada);
                    const formattedDate = date.toISOString().split('T')[0];
                    params.append('fecha', formattedDate);
                }
                const response = await axios.get(`${API_URL}/pedidos/?${params.toString()}`);
                setPedidos(response.data);
            } catch (error) {
                console.error("Error al cargar los pedidos:", error);
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

    useEffect(() => {
        const totalCalculado = pedidos.reduce((acc, pedido) => acc + parseFloat(pedido.total), 0);
        setTotalMostrado(totalCalculado);
    }, [pedidos]);

    const getTituloTotal = () => {
        const nombreMesera = meseras.find(m => m.id == meseraSeleccionada)?.nombre;
        const fechaFormateada = fechaSeleccionada ? new Date(fechaSeleccionada + 'T00:00:00').toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

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

    // Calcular estadísticas
    const cantidadPedidos = pedidos.length;
    const promedioVenta = cantidadPedidos > 0 ? totalMostrado / cantidadPedidos : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 sm:p-8 text-white relative">
            {/* Subtle background effects */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
            </div>

            <button
                onClick={() => navigate("/")}
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

                {/* Filtros mejorados */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-white">
                                <User size={16} className="text-yellow-400" /> Mesera
                            </label>
                            <select
                                value={meseraSeleccionada}
                                onChange={(e) => setMeseraSeleccionada(e.target.value)}
                                className="bg-gray-900/80 backdrop-blur-sm border border-purple-500/30 text-white text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-3"
                            >
                                <option value="">-- Todas --</option>
                                {meseras.map((mesera) => (
                                    <option key={mesera.id} value={mesera.id}>{mesera.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-white">
                                <Calendar size={16} className="text-yellow-400" /> Fecha
                            </label>
                            <input
                                type="date"
                                value={fechaSeleccionada}
                                onChange={(e) => setFechaSeleccionada(e.target.value)}
                                className="bg-gray-900/80 backdrop-blur-sm border border-purple-500/30 text-white text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-3"
                            />
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={() => setFechaSeleccionada('')}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg w-full transition-all hover:scale-105"
                            >
                                Limpiar Fecha
                            </button>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={limpiarFiltros}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg w-full transition-all hover:scale-105"
                            >
                                Limpiar Todo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Estadísticas */}
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
                                    <p className="text-3xl font-black text-white">${totalMostrado.toLocaleString('es-CO')}</p>
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
                                    <p className="text-3xl font-black text-white">${promedioVenta.toLocaleString('es-CO', { maximumFractionDigits: 0 })}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Lista de Pedidos */}
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
                                        <h2 className="font-black text-2xl text-white mb-1">
                                            Pedido #{pedido.id}
                                        </h2>
                                        <p className="text-sm text-gray-400">Mesa: <span className="text-yellow-400 font-semibold">{pedido.mesa_numero}</span></p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">{new Date(pedido.fecha_hora).toLocaleDateString()}</p>
                                        <p className="text-sm text-gray-400">{new Date(pedido.fecha_hora).toLocaleTimeString()}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    {pedido.productos_detalle.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center bg-black/20 p-3 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-yellow-500/20 text-yellow-400 font-bold px-2 py-1 rounded text-sm">
                                                    {item.cantidad}x
                                                </span>
                                                <span className="text-white font-medium">{item.producto_nombre}</span>
                                            </div>
                                            <span className="text-white font-bold">
                                                ${(parseFloat(item.producto_precio) * item.cantidad).toLocaleString('es-CO')}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t border-white/10">
                                    <span className="text-gray-400 font-medium">Total del Pedido</span>
                                    <span className="text-3xl font-black text-white">
                                        ${parseFloat(pedido.total).toLocaleString('es-CO')}
                                    </span>
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
