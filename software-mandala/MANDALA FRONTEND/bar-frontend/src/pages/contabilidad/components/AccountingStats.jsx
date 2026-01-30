import React from 'react';
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';

const formatCurrency = (val) => {
    if (val === null || val === undefined || isNaN(val)) return "$ 0";
    try {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
    } catch (e) {
        return "$ 0";
    }
};

const AccountingStats = ({ stats }) => {
    const items = [
        { 
            title: "Ventas Totales", 
            value: formatCurrency(stats.totalVentas), 
            icon: <DollarSign size={24} />, 
            color: "text-green-400", 
            bg: "bg-green-500/10", 
            border: "border-green-500/20" 
        },
        { 
            title: "Impuestos (Est. 8%)", 
            value: formatCurrency(stats.totalImpuestos), 
            icon: <TrendingDown size={24} />, 
            color: "text-orange-400", 
            bg: "bg-orange-500/10", 
            border: "border-orange-500/20" 
        },
        { 
            title: "Venta Neta (Base)", 
            value: formatCurrency(stats.gananciaEstimada), 
            icon: <TrendingUp size={24} />, 
            color: "text-[#A944FF]", 
            bg: "bg-[#A944FF]/10", 
            border: "border-[#A944FF]/20" 
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn transition-all duration-500">
            {items.map((stat, index) => (
                <div key={index} className={`p-8 rounded-[2rem] backdrop-blur-md border border-white/10 dark:border-white/5 bg-[#1A103C]/80 dark:bg-zinc-900/40 flex items-center gap-6 transition-all hover:scale-[1.02] shadow-2xl dark:shadow-none group relative overflow-hidden`}>
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-white/10 to-transparent"></div>
                    <div className={`p-4 rounded-2xl bg-[#0E0D23] dark:bg-black/40 ${stat.color} shadow-inner border border-white/5`}>
                        {stat.icon}
                    </div>
                    <div>
                        <p className="text-[#8A7BAF] dark:text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.title}</p>
                        <h3 className="text-3xl font-black text-white dark:text-zinc-200 tracking-tighter">{stat.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AccountingStats;
