import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePedidosContext } from '../../context/PedidosContext';
import { DollarSign, TrendingUp, TrendingDown, Calendar, FileText, PieChart, ArrowLeft, Receipt, ExternalLink, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import PUCDisco from './components/PUC-Disco';
import AccountingStats from './components/AccountingStats';
import SalesChart from './components/SalesChart';
import ThemeToggle from '../../components/ThemeToggle';
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
        <div className="min-h-screen flex flex-col bg-transparent text-white dark:text-zinc-200 selection:bg-purple-500/30 transition-colors duration-500 overflow-x-hidden relative">
            
            {/* Header Controls */}
            <div className="absolute top-6 left-6 right-6 z-40 flex justify-between items-center no-print px-4 sm:px-0">
                <button
                    onClick={() => navigate("/")}
                    className={`${UI_CLASSES.buttonBack} backdrop-blur-xl shadow-none border-white/10 dark:border-white/5 bg-white/5 dark:bg-black/50 hover:bg-white/10 dark:hover:bg-zinc-900 text-white dark:text-white`}
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold uppercase tracking-wider text-xs">Volver</span>
                </button>
                <ThemeToggle />
            </div>

            <div className="flex-1 p-4 sm:p-8 pt-24 relative z-10 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl sm:text-6xl font-black text-white dark:text-white mb-2 uppercase drop-shadow-2xl tracking-tighter italic">Contabilidad</h1>
                        <p className="text-[#8A7BAF] dark:text-zinc-500 font-black uppercase tracking-[0.4em] text-[10px]">Resumen financiero y movimientos</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex bg-[#1A103C]/50 dark:bg-zinc-900 p-1.5 rounded-[1.25rem] border border-white/10 dark:border-white/5 backdrop-blur-md transition-all duration-500 shadow-2xl">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${activeTab === tab.id
                                        ? 'bg-[#A944FF] dark:bg-zinc-100 text-white dark:text-black shadow-lg border border-white/20 dark:border-transparent'
                                        : 'text-[#8A7BAF] dark:text-zinc-500 hover:text-white dark:hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {tab.icon}
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="hidden lg:flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-200 dark:border-white/5 backdrop-blur-md">
                            <Calendar size={18} className="text-zinc-900 dark:text-white" />
                            <span className="text-sm font-bold text-zinc-500 dark:text-zinc-300">Hoy, {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                        </div>
                    </div>
                </div>

                {activeTab === 'dashboard' && (
                    <div className="animate-fadeIn space-y-12">
                        {/* Stats Summary */}
                        <AccountingStats stats={{ totalVentas, totalImpuestos, gananciaEstimada }} />

                        {/* Visual Charts */}
                        <SalesChart ventasDiarias={ventasDiarias} />
                    </div>
                )}

                {activeTab === 'reportes' && (
                    <div className="animate-fadeIn space-y-6">
                        <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm dark:shadow-none">
                            <div>
                                <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2 flex items-center gap-2 uppercase tracking-tight">
                                    <Receipt size={20} className="text-zinc-900 dark:text-white" />
                                    Solución Gratuita DIAN
                                </h3>
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-2xl">
                                    Utiliza estos valores para realizar tu <strong>Factura Global Diaria</strong> o <strong>Nota Crédito</strong> en el software gratuito.
                                    Al final del día, consolida las ventas POS en un solo documento electrónico si utilizas el modelo de Factura Global.
                                </p>
                            </div>
                            <a
                                href="https://facturaciongratuitadian.dian.gov.co/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="whitespace-nowrap flex items-center gap-2 bg-zinc-900 dark:bg-[#104a28] hover:bg-black dark:hover:bg-[#156035] text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-xl border border-transparent dark:border-green-500/30 uppercase text-xs tracking-widest"
                            >
                                Ingresar a DIAN
                                <ExternalLink size={16} />
                            </a>
                        </div>

                        <div className="bg-white dark:bg-zinc-900/30 backdrop-blur-xl border border-zinc-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm dark:shadow-2xl">
                            <div className="p-6 border-b border-zinc-200 dark:border-white/5 flex justify-between items-center">
                                <h2 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight">Datos para Facturación Global</h2>
                                <button onClick={fetchReporteVentas} className="text-[10px] font-black uppercase tracking-widest bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-white px-4 py-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-white/20 transition-all border border-zinc-200 dark:border-white/10">Refrescar Datos</button>
                            </div>

                            {loadingReporte ? (
                                <div className="p-12 text-center text-zinc-500 dark:text-zinc-600 animate-pulse font-bold uppercase tracking-[0.3em] text-[10px]">Cargando reporte...</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                            <tr>
                                                <th className="p-4">Fecha</th>
                                                <th className="p-4 text-left">Concepto Sugerido</th>
                                                <th className="p-4 text-right">Base Imponible (Sin Imp.)</th>
                                                <th className="p-4 text-right">Impuesto (INC 8%)</th>
                                                <th className="p-4 text-right">Total a Pagar</th>
                                                <th className="p-4 text-center">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-100 dark:divide-white/5 text-sm">
                                            {ventasDiarias.length > 0 ? ventasDiarias.map((dia, idx) => {
                                                const total = parseFloat(dia.total_ventas);
                                                const base = total / 1.08;
                                                const impuesto = total - base;

                                                return (
                                                    <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors text-zinc-600 dark:text-zinc-300">
                                                        <td className="p-4 font-black text-zinc-900 dark:text-white whitespace-nowrap uppercase tracking-tight">{dia.fecha}</td>
                                                        <td className="p-4 text-xs italic text-zinc-400 dark:text-zinc-500">
                                                            Ventas generales del día {dia.fecha} (Consumo POS)
                                                        </td>
                                                        <td className="p-4 text-right font-mono text-zinc-900 dark:text-white font-bold">
                                                            {formatCurrency(base)}
                                                        </td>
                                                        <td className="p-4 text-right font-mono text-zinc-500 dark:text-zinc-400">
                                                            {formatCurrency(impuesto)}
                                                        </td>
                                                        <td className="p-4 text-right font-mono font-black text-zinc-900 dark:text-white">
                                                            {formatCurrency(total)}
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <button
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(`Base: ${Math.round(base)} | Impuesto: ${Math.round(impuesto)} | Total: ${Math.round(total)}`);
                                                                    toast.success("Valores copiados al portapapeles");
                                                                }}
                                                                className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mx-auto bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 transition-all border border-zinc-200 dark:border-white/10"
                                                                title="Copiar valores para pegar en DIAN"
                                                            >
                                                                <Copy size={12} /> Copiar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            }) : (
                                                <tr>
                                                    <td colSpan="6" className="p-12 text-center text-zinc-400 dark:text-zinc-600 font-bold uppercase tracking-widest text-xs">
                                                        No hay ventas para reportar hoy.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                        <tfoot className="bg-zinc-50/50 dark:bg-zinc-950/50 text-[10px] font-bold text-zinc-400 dark:text-zinc-600">
                                            <tr>
                                                <td colSpan="6" className="p-4 text-center uppercase tracking-widest">
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
