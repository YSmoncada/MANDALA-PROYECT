import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderPedidosDisco from '../pedidospage/HeaderPedidos-Disco';
import { usePedidosContext } from '../../context/PedidosContext';
import { DollarSign, TrendingUp, TrendingDown, Calendar, FileText, PieChart, ArrowLeft, Receipt, ExternalLink, Copy } from 'lucide-react';
import { toast } from 'sonner';
import PUCDisco from './components/PUC-Disco';
import { API_URL } from '../../apiConfig';
import { UI_CLASSES } from '../../constants/ui';

export default function ContabilidadDisco() {
    const { auth } = usePedidosContext();
    const { mesera, codigoConfirmado, handleLogout } = auth;
    const [activeTab, setActiveTab] = useState('dashboard');
    const [ventasDiarias, setVentasDiarias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingReporte, setLoadingReporte] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/reportes/ventas-diarias/`);

            // Safety checks
            const rawVentas = Array.isArray(response.data) ? response.data : [];
            const safeVentas = rawVentas.filter(v => v && typeof v === 'object');

            setVentasDiarias(safeVentas);
        } catch (error) {
            console.error("Error cargando dashboard:", error);
            setVentasDiarias([]);
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
            <div className="absolute top-6 left-6 z-50">
                <button
                    onClick={() => navigate("/")}
                    className={UI_CLASSES.buttonBack}
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold uppercase tracking-wider text-xs">Volver</span>
                </button>
            </div>

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

                        <div className="w-full">
                            {/* Enhanced Full Width Chart */}
                            <div className="bg-[#1A103C]/80 backdrop-blur-xl border border-[#A944FF]/30 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(169,68,255,0.1)]">
                                {/* Glow Effect Behind */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>

                                <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                    <TrendingUp size={24} className="text-[#A944FF]" />
                                    Comportamiento de Ventas (├Ültimos 7 d├¡as)
                                </h3>

                                {ventasDiarias.length > 0 ? (
                                    <div className="relative h-96 w-full">
                                        {/* Grid Lines */}
                                        <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-600 pointer-events-none z-0 pb-6 pr-4">
                                            {[100, 75, 50, 25, 0].map((percent) => (
                                                <div key={percent} className="w-full border-b border-gray-700/30 flex items-center h-0.5">
                                                    <span className="mb-2 ml-1 opacity-50">{percent}%</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Bars Container */}
                                        <div className="absolute inset-x-0 bottom-0 top-0 flex items-end justify-around gap-4 pb-6 px-4 z-10 pl-8">
                                            {ventasDiarias.slice(0, 7).reverse().map((dia, idx) => {
                                                const total = parseFloat(dia.total_ventas || 0);
                                                const maxVal = Math.max(...ventasDiarias.map(d => parseFloat(d.total_ventas || 0)), 1);

                                                let heightPerc = (total / maxVal) * 100;
                                                if (isNaN(heightPerc) || heightPerc < 0) heightPerc = 0;

                                                return (
                                                    <div key={idx} className="flex-1 flex flex-col items-center gap-3 group h-full justify-end">
                                                        {/* Bar */}
                                                        <div
                                                            className="w-full max-w-[60px] bg-gradient-to-t from-[#441E73] to-[#A944FF] rounded-t-xl relative transition-all duration-500 hover:shadow-[0_0_20px_rgba(169,68,255,0.6)] hover:brightness-110 group-hover:scale-y-105 origin-bottom cursor-pointer"
                                                            style={{ height: `${heightPerc}%`, minHeight: '4px' }}
                                                        >
                                                            {/* Top Cap Highlight */}
                                                            <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 rounded-t-xl"></div>

                                                            {/* Tooltip */}
                                                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#0E0D23] border border-[#A944FF] text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap shadow-xl z-20 pointer-events-none">
                                                                {formatCurrency(total)}
                                                                <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0E0D23] border-b border-r border-[#A944FF] rotate-45"></div>
                                                            </div>
                                                        </div>

                                                        {/* Label */}
                                                        <div className="text-center">
                                                            <span className="text-xs font-bold text-gray-300 block mb-1">
                                                                {new Date(dia.fecha).toLocaleDateString('es-CO', { weekday: 'short' })}
                                                            </span>
                                                            <span className="text-[10px] text-gray-500">
                                                                {new Date(dia.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-96 flex flex-col items-center justify-center text-gray-500 border border-dashed border-gray-700 rounded-2xl bg-black/20">
                                        <PieChart size={48} className="text-gray-700 mb-4" />
                                        <p>No hay datos de ventas recientes para graficar</p>
                                    </div>
                                )}
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
                                    Soluci├│n Gratuita DIAN
                                </h3>
                                <p className="text-[#C2B6D9] text-sm max-w-2xl">
                                    Utiliza estos valores para realizar tu <strong>Factura Global Diaria</strong> o <strong>Nota Cr├®dito</strong> en el software gratuito.
                                    Al final del d├¡a, consolida las ventas POS en un solo documento electr├│nico si utilizas el modelo de Factura Global.
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
                                <h2 className="text-lg font-bold text-white">Datos para Facturaci├│n Global</h2>
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
                                                            Ventas generales del d├¡a {dia.fecha} (Consumo POS)
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
