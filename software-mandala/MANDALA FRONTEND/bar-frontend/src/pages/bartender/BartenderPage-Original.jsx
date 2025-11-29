import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { API_URL } from '../../apiConfig';
const BartenderPage = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
        // Opcional: Refrescar pedidos cada 30 segundos
        const interval = setInterval(fetchPedidosPendientes, 30000);
        return () => clearInterval(interval);
    }, [fetchPedidosPendientes]);

    const handleDespacharPedido = async (pedidoId) => {
        try {
            await axios.patch(`${API_URL}/pedidos/${pedidoId}/`, { estado: 'despachado' });
            toast.success(`Pedido #${pedidoId} despachado.`);
            // Actualizar la lista de pedidos en la UI
            setPedidos(prevPedidos => prevPedidos.filter(p => p.id !== pedidoId));
        } catch (error) {
            console.error(`Error al despachar el pedido ${pedidoId}:`, error);
            toast.error('Error al despachar el pedido.');
        }
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-[#0E0D23] to-[#511F86] p-4 sm:p-8 text-white">
            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 z-10 flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white shadow-lg transition-colors hover:bg-purple-700"
            >
                <ArrowLeft size={18} />
                Volver al Inicio
            </button>

            <div className="mx-auto max-w-6xl pt-20 sm:pt-0">
                <h1 className="text-4xl font-bold text-center mb-8">Pedidos Pendientes</h1>

                {loading && pedidos.length === 0 ? (
                    <p className="text-center">Cargando pedidos...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pedidos.length > 0 ? pedidos.map(pedido => (
                            <div key={pedido.id} className="bg-[#2B0D49]/80 border border-[#6C3FA8] rounded-xl p-4 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-center mb-3 border-b border-purple-800 pb-2">
                                        <h2 className="font-bold text-xl">Pedido #{pedido.id}</h2>
                                        <span className="text-sm text-gray-400">{new Date(pedido.fecha_hora).toLocaleTimeString()}</span>
                                    </div>
                                    <p className="text-sm mb-1">Mesa: <span className="font-semibold text-lg">{pedido.mesa_numero}</span></p>
                                    <p className="text-sm mb-3">Mesera: <span className="font-semibold">{pedido.mesera_nombre}</span></p>
                                    <ul className="space-y-1 text-gray-300 max-h-48 overflow-y-auto pr-2">
                                        {pedido.productos_detalle.map((item, index) => (
                                            <li key={index} className="text-sm flex justify-between">
                                                <span>{item.cantidad} x {item.producto_nombre}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button
                                    onClick={() => handleDespacharPedido(pedido.id)}
                                    className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                                >
                                    <Check size={18} />
                                    Marcar como Despachado
                                </button>
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-10">
                                <p className="text-gray-300 text-lg">No hay pedidos pendientes por ahora.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BartenderPage;