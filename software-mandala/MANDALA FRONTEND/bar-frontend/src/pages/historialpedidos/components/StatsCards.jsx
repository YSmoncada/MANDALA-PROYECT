import React from 'react';
import { DollarSign, ShoppingBag } from 'lucide-react';

const StatsCards = ({ totalVentas, totalPedidos }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Total Sales Card */}
            <div className="bg-[#441E73]/80 dark:bg-zinc-900/30 backdrop-blur-xl p-6 rounded-2xl border border-[#6C3FA8] dark:border-white/5 shadow-xl relative overflow-hidden group transition-all duration-500">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-50"></div>
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-2 bg-green-400/10 rounded-lg">
                        <DollarSign className="text-green-400" size={18} />
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-zinc-600 font-bold uppercase tracking-widest">Total Ventas</p>
                </div>
                <p className="text-4xl font-black text-white dark:text-white drop-shadow-[0_0_10px_rgba(74,222,128,0.2)] dark:drop-shadow-none">
                    <span className="text-green-400 text-2xl mr-1">$</span>
                    {Number(totalVentas || 0).toLocaleString()}
                </p>
            </div>

            {/* Total Orders Card */}
            <div className="bg-[#441E73]/80 dark:bg-zinc-900/30 backdrop-blur-xl p-6 rounded-2xl border border-[#6C3FA8] dark:border-white/5 shadow-xl relative overflow-hidden group transition-all duration-500">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A944FF] dark:via-white/20 to-transparent opacity-50"></div>
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-2 bg-[#A944FF]/10 dark:bg-zinc-800 rounded-lg">
                        <ShoppingBag className="text-[#A944FF] dark:text-white" size={18} />
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-zinc-600 font-bold uppercase tracking-widest">Pedidos Realizados</p>
                </div>
                <p className="text-4xl font-black text-white dark:text-white drop-shadow-[0_0_10px_rgba(169,68,255,0.2)] dark:drop-shadow-none">
                    {totalPedidos}
                    <span className="text-[#A944FF] dark:text-zinc-500 text-lg ml-2 font-bold uppercase">Uds</span>
                </p>
            </div>
        </div>
    );
};

export default StatsCards;
