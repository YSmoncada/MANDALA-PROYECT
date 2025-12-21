import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, DollarSign, ShoppingBag, TrendingUp, Check, X, Clock, AlertCircle, Printer, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../../apiConfig';
import TicketPrinter from '../../components/TicketPrinter';
import { usePedidosContext } from '../../context/PedidosContext';

const HistorialPedidosPageDisco = () => {
    const [pedidos, setPedidos] = useState([]);
    const [meseras, setMeseras] = useState([]);
    const [empresaConfig, setEmpresaConfig] = useState(null);
    const [pedidoAImprimir, setPedidoAImprimir] = useState(null);
    const [meseraSeleccionada, setMeseraSeleccionada] = useState('');
    const [fechaSeleccionada, setFechaSeleccionada] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [totalMostrado, setTotalMostrado] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { auth } = usePedidosContext();
    const { role, userRole } = auth;
    const isAdmin = role === 'admin' || userRole === 'admin';

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await axios.get(`${API_URL}/config/`);
                if (res.data && res.data.length > 0) setEmpresaConfig(res.data[0]);
                else if (res.data && res.data.id) setEmpresaConfig(res.data);
            } catch (error) { console.error(error); }
        };
        fetchConfig();

        const fetchVendedores = async () => {
            try {
                // Usamos el endpoint que trae a todos los que han vendido (meseras y sistema)
                const response = await axios.get(`${API_URL}/meseras/total-pedidos/`);
                // Mapeamos para tener una estructura consistente y prefijo para distinguir IDs
                const vendedores = response.data.map(v => ({
                    id: v.tipo === 'usuario' ? `u${v.mesera_id}` : `m${v.mesera_id}`,
                    realId: v.mesera_id,
                    nombre: v.mesera_nombre,
                    tipo: v.tipo
                }));
                setMeseras(vendedores);
            } catch (error) {
                console.error('Error al cargar los vendedores:', error);
            }
        };
        fetchVendedores();
    }, []);

    useEffect(() => {
        const fetchPedidos = async () => {
            setLoading(true);
            setPedidos([]);
            try {
                const params = new URLSearchParams();
                if (meseraSeleccionada) {
                    if (meseraSeleccionada.startsWith('u')) {
                        params.append('usuario', meseraSeleccionada.substring(1));
                    } else if (meseraSeleccionada.startsWith('m')) {
                        params.append('mesera', meseraSeleccionada.substring(1));
                    }
                }

                if (fechaSeleccionada) params.append('fecha', fechaSeleccionada);
                const response = await axios.get(`${API_URL}/pedidos/?${params.toString()}`);
                setPedidos(response.data);
            } catch (error) {
                console.error('Error al cargar los pedidos:', error);
                setPedidos([]);
            } finally {
                setLoading(false);
            }
        };

        if (meseraSeleccionada || fechaSeleccionada) fetchPedidos();
        else setPedidos([]);
    }, [meseraSeleccionada, fechaSeleccionada]);

    useEffect(() => {
        const total = pedidos.reduce((acc, p) => {
            const estado = p.estado?.toLowerCase();
            // Contamos como venta todo lo que no sea cancelado
            // (Pendiente y Despachado ya son ventas realizadas)
            if (estado !== 'cancelado') {
                return acc + parseFloat(p.total);
            }
            return acc;
        }, 0);
        setTotalMostrado(total);
    }, [pedidos]);

    const handlePrint = (pedido) => {
        setPedidoAImprimir(pedido);
        setTimeout(() => {
            window.print();
        }, 500);
    };

    const handleUpdateEstado = async (pedidoId, nuevoEstado) => {
        try {
            await axios.patch(`${API_URL}/pedidos/${pedidoId}/`, { estado: nuevoEstado });
            toast.success(`Pedido #${pedidoId} actualizado`);
            setPedidos(prev => prev.map(p =>
                p.id === pedidoId ? { ...p, estado: nuevoEstado } : p
            ));
        } catch (error) {
            toast.error('No se pudo actualizar');
        }
    };

    const handleBorrarHistorial = async () => {
        if (!window.confirm('¿Estás seguro de que deseas borrar este historial? Esta acción devolverá el stock y no se puede deshacer.')) {
            return;
        }

        try {
            const params = new URLSearchParams();
            if (meseraSeleccionada) params.append('mesera', meseraSeleccionada);
            if (fechaSeleccionada) params.append('fecha', fechaSeleccionada);

            await axios.delete(`${API_URL}/pedidos/borrar_historial/?${params.toString()}`);
            toast.success('Historial borrado correctamente');
            setPedidos([]);
            setTotalMostrado(0);
        } catch (error) {
            console.error('Error al borrar historial:', error);
            toast.error(error.response?.data?.detail || 'No se pudo borrar el historial');
        }
    };

    const StatusSelector = ({ pedido }) => {
        const [isOpen, setIsOpen] = useState(false);
        const currentStatus = pedido.estado?.toLowerCase() || 'pendiente';
        const colors = {
            pendiente: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            despachado: 'bg-green-500/20 text-green-400 border-green-500/30',
            cancelado: 'bg-red-500/20 text-red-400 border-red-500/30'
        };
        return (
            <div className="relative">
                <button onClick={() => setIsOpen(!isOpen)} className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all ${colors[currentStatus]}`}>
                    {currentStatus}
                </button>
                {isOpen && (
                    <div className="absolute top-full left-0 mt-2 w-32 bg-gray-900 border border-white/10 rounded-xl z-50 overflow-hidden shadow-2xl">
                        {['pendiente', 'despachado', 'cancelado'].map(s => (
                            <button key={s} onClick={() => { handleUpdateEstado(pedido.id, s); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-xs hover:bg-white/5 text-gray-300">
                                {s}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 p-4 sm:p-8 text-white relative">
            <TicketPrinter pedido={pedidoAImprimir} empresaConfig={empresaConfig} />

            <button onClick={() => navigate('/')} className="fixed top-6 left-6 z-50 flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-4 py-2 hover:bg-white/10 transition-all no-print">
                <ArrowLeft size={18} /> <span>Volver</span>
            </button>

            <div className="max-w-6xl mx-auto pt-16 no-print">
                <h1 className="text-4xl font-black mb-8 text-center text-white">Historial de Ventas</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Mesera</label>
                        <select value={meseraSeleccionada} onChange={e => setMeseraSeleccionada(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-purple-500 outline-none capitalize">
                            <option value="">-- Todos --</option>
                            {meseras.map(v => (
                                <option key={v.id} value={v.id}>
                                    {v.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Fecha</label>
                        <input type="date" value={fechaSeleccionada} onChange={e => setFechaSeleccionada(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-purple-500 outline-none" />
                    </div>
                    <div className="flex items-end">
                        <button onClick={() => { setMeseraSeleccionada(''); setFechaSeleccionada(''); setPedidos([]); }} className="w-full bg-white/5 hover:bg-white/10 py-3 rounded-xl text-sm transition-all font-bold">Limpiar</button>
                    </div>
                    {isAdmin && (
                        <div className="flex items-end">
                            <button
                                onClick={handleBorrarHistorial}
                                className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 font-bold"
                            >
                                <Trash2 size={16} /> Borrar Historial
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Total Ventas</p>
                        <p className="text-3xl font-black text-green-400">${totalMostrado.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Pedidos</p>
                        <p className="text-3xl font-black">{pedidos.length}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {pedidos.map(pedido => (
                        <div key={pedido.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-xl font-black">Pedido #{pedido.id}</h2>
                                    <StatusSelector pedido={pedido} />
                                </div>
                                <button onClick={() => handlePrint(pedido)} className="p-2 rounded-lg bg-white/5 hover:bg-purple-500 text-purple-400 hover:text-white transition-all border border-white/10">
                                    <Printer size={18} />
                                </button>
                            </div>
                            <div className="space-y-2 text-sm text-gray-400 mb-4">
                                <p>Mesa: <span className="text-white font-bold">{pedido.mesa_numero}</span> | Atendió: <span className="text-white">{pedido.mesera_nombre}</span></p>
                                <p>{new Date(pedido.fecha_hora).toLocaleString()}</p>
                            </div>
                            <div className="space-y-1 mb-4">
                                {pedido.productos_detalle.map((it, i) => (
                                    <div key={i} className="flex justify-between text-sm py-1 border-b border-white/5">
                                        <span><span className="font-bold text-purple-400">{it.cantidad}x</span> {it.producto_nombre}</span>
                                        <span className="text-white">${(it.cantidad * it.producto_precio).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-xs font-bold text-gray-500 uppercase">Total Cobrado</span>
                                <span className="text-2xl font-black text-white">${parseFloat(pedido.total).toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                    {pedidos.length === 0 && !loading && <p className="text-center text-gray-500 py-12">No hay resultados con los filtros aplicados.</p>}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; }
                }
            `}} />
        </div>
    );
};

export default HistorialPedidosPageDisco;
