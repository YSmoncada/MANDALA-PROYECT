import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderPedidosDisco from '../pedidospage/HeaderPedidos-Disco';
import { usePedidosContext } from '../../context/PedidosContext';
import { DollarSign, TrendingUp, TrendingDown, Calendar, FileText, PieChart, ArrowLeft } from 'lucide-react';
import PUCDisco from './components/PUC-Disco';

export default function ContabilidadDisco() {
    const { auth } = usePedidosContext();
    const { mesera, codigoConfirmado, handleLogout } = auth;
    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();

    // Placeholder data
    const stats = [
        { title: "Ventas Totales", value: "$1,250.00", icon: <DollarSign size={24} />, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
        { title: "Gastos", value: "$450.00", icon: <TrendingDown size={24} />, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
        { title: "Ganancia Neta", value: "$800.00", icon: <TrendingUp size={24} />, color: "text-[#A944FF]", bg: "bg-[#A944FF]/10", border: "border-[#A944FF]/20" },
    ];

    const tabs = [
        { id: 'dashboard', label: 'Panel', icon: <PieChart size={18} /> },
        { id: 'puc', label: 'Plan de Cuentas (PUC)', icon: <FileText size={18} /> },
    ];

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
                    <div className="animate-fadeIn">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

                        {/* Content Area Placeholder */}
                        <div className="bg-[#1A103C]/60 backdrop-blur-xl border border-[#6C3FA8]/30 rounded-2xl p-8 min-h-[400px] flex items-center justify-center">
                            <div className="text-center text-[#8A7BAF]">
                                <p className="text-lg mb-2">Detalle de movimientos próximamente</p>
                                <p className="text-sm opacity-60">Aquí podrás ver tablas y gráficos detallados.</p>
                            </div>
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
