import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderPedidosDisco from '../pedidospage/HeaderPedidos-Disco';
import { usePedidosContext } from '../../context/PedidosContext';
import { DollarSign, TrendingUp, TrendingDown, Calendar, FileText, PieChart, ArrowLeft, Receipt, ExternalLink, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import PUCDisco from './components/PUC-Disco';
import { API_URL } from '../../apiConfig';

export default function ContabilidadDisco() {
    const { auth } = usePedidosContext();
    const { mesera, codigoConfirmado, handleLogout } = auth;
    const [activeTab, setActiveTab] = useState('dashboard');
    const [ventasDiarias, setVentasDiarias] = useState([]);
    const [pedidosRecientes, setPedidosRecientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingReporte, setLoadingReporte] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [ventasRes, pedidosRes] = await Promise.all([
                axios.get(`${API_URL}/reportes/ventas-diarias/`),
                axios.get(`${API_URL}/pedidos/?limit=10`)
            ]);

            // Safety checks
            const rawVentas = Array.isArray(ventasRes.data) ? ventasRes.data : [];
            const safeVentas = rawVentas.filter(v => v && typeof v === 'object');

            const rawPedidos = pedidosRes.data.results ? pedidosRes.data.results : (Array.isArray(pedidosRes.data) ? pedidosRes.data : []);
            const safePedidos = rawPedidos.filter(p => p && typeof p === 'object');

            setVentasDiarias(safeVentas);
            setPedidosRecientes(safePedidos);
        } catch (error) {
            console.error("Error cargando dashboard:", error);
            setVentasDiarias([]);
            setPedidosRecientes([]);
        } finally {
            setLoading(false);
        }
    };

    // Calculate Totals safely
    const totalVentas = ventasDiarias.reduce((acc, curr) => {
        const val = parseFloat(curr?.total_ventas || 0);
        return acc + (isNaN(val) ? 0 : val);
    }, 0);

    // Estimating standard expenses/taxes for visualization if real data is missing
    const totalImpuestos = totalVentas > 0 ? totalVentas - (totalVentas / 1.08) : 0;
    const gananciaEstimada = totalVentas > 0 ? totalVentas / 1.08 : 0;

    const formatCurrency = (val) => {
        if (val === null || val === undefined || isNaN(val)) return "$ 0";
        try {
            return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
        } catch (e) {
            return "$ 0";
        }
    };

    const stats = [
        { title: "Ventas Totales", value: formatCurrency(totalVentas), icon: <DollarSign size={24} />, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
        { title: "Impuestos (Est. 8%)", value: formatCurrency(totalImpuestos), icon: <TrendingDown size={24} />, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
        { title: "Venta Neta (Base)", value: formatCurrency(gananciaEstimada), icon: <TrendingUp size={24} />, color: "text-[#A944FF]", bg: "bg-[#A944FF]/10", border: "border-[#A944FF]/20" },
    ];

    const tabs = [
        { id: 'dashboard', label: 'Panel', icon: <PieChart size={18} /> },
        { id: 'reportes', label: 'Reportes DIAN', icon: <Receipt size={18} /> },
        { id: 'puc', label: 'Plan de Cuentas (PUC)', icon: <FileText size={18} /> },
    ];

    useEffect(() => {
        if (activeTab === 'reportes' && ventasDiarias.length === 0) {
            fetchDashboardData();
        }
    }, [activeTab]);

    const fetchReporteVentas = fetchDashboardData;

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white selection:bg-purple-500/30">
            {/* Background Glows */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Back Button */}
            <button
                onClick={() => navigate("/")}
                className="absolute top-6 left-6 z-50 flex items-center gap-2 rounded-lg bg-[#441E73]/50 border border-[#6C3FA8] px-4 py-2 text-white hover:bg-[#441E73] transition-all backdrop-blur-md shadow-lg hover:scale-105"
            >
                <ArrowLeft size={18} />
                <span className="font-medium">Volver</span>
            </button>

            <div className="flex-1 p-8 pt-20 relative z-10 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(169,68,255,0.5)]">Contabilidad</h1>
                        <p className="text-[#C2B6D9]">Resumen financiero y movimientos</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex bg-[#2B0D49]/60 p-1 rounded-xl border border-[#6C3FA8]/30 backdrop-blur-md">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === tab.id
                                        ? 'bg-[#A944FF] text-white shadow-lg shadow-[#A944FF]/30'
                                        : 'text-[#C2B6D9] hover:text-white hover:bg-[#441E73]/50'
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="hidden md:flex items-center gap-2 bg-[#2B0D49]/60 px-4 py-2 rounded-xl border border-[#6C3FA8]/30 backdrop-blur-md">
                            <Calendar size={18} className="text-[#A944FF]" />
                            <span className="text-sm font-bold text-white">Hoy, {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                        </div>
                    </div>
                </div>

                {activeTab === 'dashboard' && (
                    <div className="animate-fadeIn space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className={`p-6 rounded-2xl backdrop-blur-md border ${stat.border} ${stat.bg} flex items-center gap-4 transition-transform hover:scale-[1.02]`}>
                                    <div className={`p-3 rounded-xl bg-black/20 ${stat.color}`}>
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <p className="text-[#C2B6D9] text-sm font-medium">{stat.title}</p>
                                        <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Simple CSS Bar Chart */}
                            <div className="bg-[#1A103C]/80 backdrop-blur-xl border border-[#6C3FA8]/30 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <PieChart size={20} className="text-[#A944FF]" />
                                    Ventas de los Últimos Días
                                </h3>

                                {ventasDiarias.length > 0 ? (
                                    <div className="flex items-end gap-2 h-64 pb-2 border-b border-gray-700/50">
                                        {ventasDiarias.slice(0, 7).reverse().map((dia, idx) => {
                                            const total = parseFloat(dia.total_ventas || 0);
                                            // Calculate max value safely
                                            const maxVal = Math.max(...ventasDiarias.map(d => parseFloat(d.total_ventas || 0)), 1); // Avoid 0 or -Infinity

                                            // Handle potential edge cases
                                            let heightPerc = (total / maxVal) * 100;
                                            if (isNaN(heightPerc) || heightPerc < 0) heightPerc = 0;

                                            return (
                                                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                                                    <div
                                                        className="w-full bg-gradient-to-t from-[#A944FF] to-[#FF4BC1] rounded-t-lg opacity-80 group-hover:opacity-100 transition-all relative min-h-[4px]"
                                                        style={{ height: `${heightPerc}%` }}
                                                    >
                                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                                            {formatCurrency(total)}
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 rotate-0 truncate w-full text-center">
                                                        {new Date(dia.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' })}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="h-64 flex items-center justify-center text-gray-500">
                                        No hay datos de ventas recientes
                                    </div>
                                )}
                            </div>

                            {/* Recent Orders List */}
                            <div className="bg-[#1A103C]/80 backdrop-blur-xl border border-[#6C3FA8]/30 rounded-2xl p-6 flex flex-col">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Receipt size={20} className="text-green-400" />
                                    Pedidos Recientes
                                </h3>

                                <div className="flex-1 overflow-y-auto max-h-[300px] pr-2 space-y-3 custom-scrollbar">
                                    {pedidosRecientes.length > 0 ? pedidosRecientes.map(pedido => (
                                        <div key={pedido.id} className="bg-black/20 p-4 rounded-xl border border-[#6C3FA8]/10 hover:border-[#A944FF]/30 transition-colors flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-white">Pedido #{pedido.id}</p>
                                                <p className="text-xs text-gray-400">{new Date(pedido.fecha_hora).toLocaleDateString()} - {new Date(pedido.fecha_hora).toLocaleTimeString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-[#A944FF]">{formatCurrency(pedido.total)}</p>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${pedido.estado === 'despachado' ? 'bg-green-500/20 text-green-300' :
                                                    pedido.estado === 'pendiente' ? 'bg-yellow-500/20 text-yellow-300' :
                                                        'bg-gray-700 text-gray-300'
                                                    }`}>
                                                    {pedido.estado}
                                                </span>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-center text-gray-500 py-10">No hay pedidos registrados</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'reportes' && (
                    <div className="animate-fadeIn space-y-6">
                        <div className="bg-[#441E73]/30 border border-[#A944FF]/20 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                    <Receipt size={20} className="text-[#A944FF]" />
                                    Solución Gratuita DIAN
                                </h3>
                                <p className="text-[#C2B6D9] text-sm max-w-2xl">
                                    Utiliza estos valores para realizar tu <strong>Factura Global Diaria</strong> o <strong>Nota Crédito</strong> en el software gratuito.
                                    Al final del día, consolida las ventas POS en un solo documento electrónico si utilizas el modelo de Factura Global.
                                </p>
                            </div>
                            <a
                                href="https://facturaciongratuitadian.dian.gov.co/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="whitespace-nowrap flex items-center gap-2 bg-[#104a28] hover:bg-[#156035] text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-green-900/30 border border-green-500/30"
                            >
                                Ingresar a DIAN
                                <ExternalLink size={16} />
                            </a>
                        </div>

                        <div className="bg-[#1A103C]/80 backdrop-blur-xl border border-[#6C3FA8]/30 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-[#6C3FA8]/20 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-white">Datos para Facturación Global</h2>
                                <button onClick={fetchReporteVentas} className="text-xs bg-[#A944FF]/20 text-[#A944FF] px-3 py-1 rounded hover:bg-[#A944FF]/40 transition">Refrescar Datos</button>
                            </div>

                            {loadingReporte ? (
                                <div className="p-12 text-center text-[#A944FF]">Cargando reporte...</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-[#2B0D49] text-[#C2B6D9] text-xs uppercase tracking-wider">
                                            <tr>
                                                <th className="p-4">Fecha</th>
                                                <th className="p-4 text-left">Concepto Sugerido</th>
                                                <th className="p-4 text-right">Base Imponible (Sin Imp.)</th>
                                                <th className="p-4 text-right">Impuesto (INC 8%)</th>
                                                <th className="p-4 text-right">Total a Pagar</th>
                                                <th className="p-4 text-center">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#6C3FA8]/10 text-sm">
                                            {ventasDiarias.length > 0 ? ventasDiarias.map((dia, idx) => {
                                                const total = parseFloat(dia.total_ventas);
                                                const base = total / 1.08;
                                                const impuesto = total - base;

                                                return (
                                                    <tr key={idx} className="hover:bg-[#A944FF]/5 transition-colors text-gray-300">
                                                        <td className="p-4 font-bold text-white whitespace-nowrap">{dia.fecha}</td>
                                                        <td className="p-4 text-sm italic text-gray-400">
                                                            Ventas generales del día {dia.fecha} (Consumo POS)
                                                        </td>
                                                        <td className="p-4 text-right font-mono text-[#A944FF]">
                                                            {formatCurrency(base)}
                                                        </td>
                                                        <td className="p-4 text-right font-mono text-orange-400">
                                                            {formatCurrency(impuesto)}
                                                        </td>
                                                        <td className="p-4 text-right font-mono font-bold text-green-400">
                                                            {formatCurrency(total)}
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <button
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(`Base: ${Math.round(base)} | Impuesto: ${Math.round(impuesto)} | Total: ${Math.round(total)}`);
                                                                    toast.success("Valores copiados al portapapeles");
                                                                }}
                                                                className="text-xs flex items-center gap-1 mx-auto bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-[#C2B6D9] transition"
                                                                title="Copiar valores para pegar en DIAN"
                                                            >
                                                                <Copy size={12} /> Copiar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            }) : (
                                                <tr>
                                                    <td colSpan="6" className="p-8 text-center text-gray-500">
                                                        No hay ventas para reportar hoy.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                        <tfoot className="bg-[#2B0D49]/50 text-xs text-gray-500">
                                            <tr>
                                                <td colSpan="6" className="p-4 text-center">
                                                    * Los valores se calculan asumiendo que los precios de los productos ya tienen el Impuesto al Consumo (8%) incluido.
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'puc' && (
                    <div className="animate-fadeIn">
                        <PUCDisco />
                    </div>
                )}
            </div>
        </div>
    );
}
