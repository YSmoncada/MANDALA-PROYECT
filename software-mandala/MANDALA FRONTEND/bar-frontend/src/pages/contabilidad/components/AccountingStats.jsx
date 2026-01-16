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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((stat, index) => (
                <div key={index} className={`p-6 rounded-2xl backdrop-blur-md border ${stat.border} ${stat.bg} flex items-center gap-4 transition-transform hover:scale-[1.02] shadow-lg`}>
                    <div className={`p-3 rounded-xl bg-black/20 ${stat.color}`}>
                        {stat.icon}
                    </div>
                    <div>
                        <p className="text-[#C2B6D9] text-sm font-medium">{stat.title}</p>
                        <h3 className="text-2xl font-bold text-white tracking-tight">{stat.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AccountingStats;
