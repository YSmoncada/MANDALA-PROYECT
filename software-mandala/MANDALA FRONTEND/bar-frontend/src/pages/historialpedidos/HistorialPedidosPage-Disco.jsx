import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, DollarSign, ShoppingBag, TrendingUp, Check, X, Clock, AlertCircle, Printer, Trash2, Table } from 'lucide-react';
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
        const d = new Date();
        const offset = d.getTimezoneOffset();
        const localDate = new Date(d.getTime() - (offset * 60 * 1000));
        return localDate.toISOString().split('T')[0];
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
                    id: v.tipo === 'usuario' ? `u${v.mesera_id || v.id}` : `m${v.mesera_id || v.id}`,
                    realId: v.mesera_id || v.id,
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
                setPedidos(Array.isArray(response.data) ? response.data : []);
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
        if (!Array.isArray(pedidos)) {
            setTotalMostrado(0);
            return;
        }
        const total = pedidos.reduce((acc, p) => {
            const estado = p.estado?.toLowerCase();
            // Contamos como venta todo lo que no sea cancelado
            // (Pendiente y Despachado ya son ventas realizadas)
            if (estado !== 'cancelado') {
                return acc + parseFloat(p.total || 0);
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
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white selection:bg-purple-500/30 overflow-x-hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
            {/* Background Glows matching Home-Disco and Pedidos-Disco */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
            </div>

            <TicketPrinter pedido={pedidoAImprimir} empresaConfig={empresaConfig} />

            <main className="flex-1 p-3 pt-24 pb-20 sm:p-8 relative z-10">
                <button
                    onClick={() => navigate('/')}
                    className="fixed top-6 left-6 z-50 flex items-center gap-2 rounded-xl bg-[#441E73]/60 backdrop-blur-xl border border-[#6C3FA8] px-4 py-2 hover:bg-[#A944FF]/20 transition-all no-print shadow-lg hover:scale-105"
                >
                    <ArrowLeft size={18} /> <span className="font-bold uppercase tracking-wider text-xs">Volver</span>
                </button>

                <div className="max-w-6xl mx-auto no-print">
                    <h1 className="text-4xl sm:text-5xl font-black mb-12 text-center text-white tracking-tight drop-shadow-[0_0_15px_rgba(168,85,247,0.3)] uppercase">
                        Historial de Ventas
                    </h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 bg-[#441E73]/60 backdrop-blur-xl p-6 rounded-2xl border border-[#6C3FA8] shadow-2xl">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#A944FF] uppercase tracking-widest ml-1">Vendedor</label>
                            <div className="relative">
                                <select
                                    value={meseraSeleccionada}
                                    onChange={e => setMeseraSeleccionada(e.target.value)}
                                    className="w-full bg-[#2B0D49] border border-[#6C3FA8] rounded-xl p-3 text-sm focus:ring-[#A944FF] focus:border-[#A944FF] outline-none capitalize appearance-none cursor-pointer hover:bg-[#2B0D49]/80 transition-all"
                                >
                                    <option value="">-- Todos --</option>
                                    {meseras.map(v => (
                                        <option key={v.id} value={v.id}>
                                            {v.nombre}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                    <svg className="w-4 h-4 text-[#8A7BAF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#A944FF] uppercase tracking-widest ml-1">Fecha</label>
                            <input
                                type="date"
                                value={fechaSeleccionada}
                                onChange={e => setFechaSeleccionada(e.target.value)}
                                className="w-full bg-[#2B0D49] border border-[#6C3FA8] rounded-xl p-3 text-sm focus:ring-[#A944FF] focus:border-[#A944FF] outline-none text-white hover:bg-[#2B0D49]/80 transition-all"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => { setMeseraSeleccionada(''); setFechaSeleccionada(''); setPedidos([]); }}
                                className="w-full h-[46px] bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs transition-all font-bold uppercase tracking-widest"
                            >
                                Limpiar
                            </button>
                        </div>
                        {isAdmin && (
                            <div className="flex items-end">
                                <button
                                    onClick={handleBorrarHistorial}
                                    className="w-full h-[46px] bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl text-xs transition-all flex items-center justify-center gap-2 font-bold uppercase tracking-widest"
                                >
                                    <Trash2 size={16} /> Borrar Todo
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        <div className="bg-[#441E73]/80 backdrop-blur-xl p-6 rounded-2xl border border-[#6C3FA8] shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-50"></div>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-2 bg-green-400/10 rounded-lg">
                                    <DollarSign className="text-green-400" size={18} />
                                </div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total Ventas</p>
                            </div>
                            <p className="text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                                <span className="text-green-400 text-2xl mr-1">$</span>
                                {Number(totalMostrado || 0).toLocaleString()}
                            </p>
                        </div>

                        <div className="bg-[#441E73]/80 backdrop-blur-xl p-6 rounded-2xl border border-[#6C3FA8] shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A944FF] to-transparent opacity-50"></div>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-2 bg-[#A944FF]/10 rounded-lg">
                                    <ShoppingBag className="text-[#A944FF]" size={18} />
                                </div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Pedidos Realizados</p>
                            </div>
                            <p className="text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(169,68,255,0.2)]">
                                {Array.isArray(pedidos) ? pedidos.length : 0}
                                <span className="text-[#A944FF] text-lg ml-2 font-bold uppercase">Uds</span>
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {Array.isArray(pedidos) && pedidos.map(pedido => (
                            <div key={pedido.id} className="bg-[#441E73]/60 backdrop-blur-xl border border-[#6C3FA8] rounded-2xl p-6 hover:bg-[#441E73]/80 transition-all group shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#A944FF] to-[#FF4BC1]"></div>

                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                        <h2 className="text-2xl font-black tracking-tight">PEDIDO #{pedido.id}</h2>
                                        <div className="flex items-center gap-2">
                                            <StatusSelector pedido={pedido} />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handlePrint(pedido)}
                                        className="p-3 rounded-xl bg-[#A944FF]/10 hover:bg-[#A944FF] text-[#A944FF] hover:text-white transition-all border border-[#A944FF]/20 shadow-lg"
                                    >
                                        <Printer size={18} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-[#C2B6D9]">
                                            <div className="p-1.5 bg-white/5 rounded-md">
                                                <Table size={14} />
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-wider">Detalles de Mesa</span>
                                        </div>
                                        <div className="bg-[#2B0D49] border border-[#6C3FA8]/30 rounded-xl p-4 space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-xs text-[#C2B6D9]">Ubicación</span>
                                                <span className="text-sm font-bold text-white">Mesa #{pedido.mesa_numero}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-xs text-[#C2B6D9]">Vendedor</span>
                                                <span className="text-sm font-medium text-white capitalize">{pedido.mesera_nombre}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-xs text-[#C2B6D9]">Fecha y Hora</span>
                                                <span className="text-sm text-gray-400 font-mono">{pedido.fecha_hora ? new Date(pedido.fecha_hora).toLocaleString() : 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-[#C2B6D9]">
                                            <div className="p-1.5 bg-white/5 rounded-md">
                                                <ShoppingBag size={14} />
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-wider">Productos Consumidos</span>
                                        </div>
                                        <div className="bg-[#2B0D49] border border-[#6C3FA8]/30 rounded-xl p-4 space-y-2">
                                            {Array.isArray(pedido.productos_detalle) && pedido.productos_detalle.map((it, i) => (
                                                <div key={i} className="flex justify-between text-sm py-1.5 border-b border-white/5 last:border-0 items-center">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-6 h-6 flex items-center justify-center bg-[#A944FF]/20 text-[#A944FF] rounded text-[10px] font-bold">{it.cantidad}x</span>
                                                        <span className="text-gray-300 text-xs font-medium">{it.producto_nombre}</span>
                                                    </div>
                                                    <span className="text-white font-bold text-xs">${(it.cantidad * (it.producto_precio || 0)).toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-6 border-t border-[#6C3FA8]/30">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-[#A944FF] uppercase tracking-widest">Total del Pedido</span>
                                        <span className="text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                                            <span className="text-base text-[#A944FF] mr-1 font-bold">$</span>
                                            {parseFloat(pedido.total || 0).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="opacity-50 group-hover:opacity-100 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter text-[#C2B6D9]">
                                        <TrendingUp size={12} className="text-green-400" /> Venta Confirmada
                                    </div>
                                </div>
                            </div>
                        ))}
                        {(Array.isArray(pedidos) ? pedidos.length : 0) === 0 && !loading && (
                            <div className="text-center py-20 bg-[#441E73]/20 rounded-3xl border border-dashed border-[#6C3FA8]/50">
                                <div className="p-4 bg-[#A944FF]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <AlertCircle className="text-[#A944FF]" size={32} />
                                </div>
                                <p className="text-[#C2B6D9] font-bold uppercase tracking-widest text-sm">No hay resultados</p>
                                <p className="text-gray-500 text-xs mt-2">Intenta ajustar los filtros de búsqueda</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

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
