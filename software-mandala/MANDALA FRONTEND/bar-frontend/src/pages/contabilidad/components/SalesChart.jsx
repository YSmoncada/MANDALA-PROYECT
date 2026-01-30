import React from 'react';
import { TrendingUp, PieChart } from 'lucide-react';

const formatCurrency = (val) => {
    if (val === null || val === undefined || isNaN(val)) return "$ 0";
    try {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
    } catch (e) {
        return "$ 0";
    }
};

const SalesChart = ({ ventasDiarias }) => {
    const sortedVentas = [...ventasDiarias].slice(0, 7).reverse();
    const maxVal = Math.max(...ventasDiarias.map(d => parseFloat(d.total_ventas || 0)), 1);

    return (
        <div className="bg-[#1A103C]/80 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl transition-all duration-500">
            {/* Glow Effect Behind */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#A944FF]/5 dark:bg-white/5 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>

            <h3 className="text-2xl font-black text-white dark:text-white mb-10 flex items-center gap-4 uppercase tracking-tighter italic">
                <TrendingUp size={24} className="text-[#A944FF] dark:text-zinc-200" />
                Comportamiento de Ventas <span className="text-[#8A7BAF] dark:text-zinc-500 text-sm font-normal normal-case tracking-normal">(Últimos 7 días)</span>
            </h3>

            {sortedVentas.length > 0 ? (
                <div className="relative h-96 w-full">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-[#8A7BAF] dark:text-zinc-600 pointer-events-none z-0 pb-12 pr-4">
                        {[100, 75, 50, 25, 0].map((percent) => (
                            <div key={percent} className="w-full border-b border-white/5 dark:border-zinc-800 flex items-center h-px">
                                <span className="mb-2 ml-1 opacity-50 font-black uppercase tracking-widest">{percent}%</span>
                            </div>
                        ))}
                    </div>

                    {/* Bars Container */}
                    <div className="absolute inset-x-0 bottom-0 top-0 flex items-end justify-around gap-4 pb-12 px-4 z-10 pl-12">
                        {sortedVentas.map((dia, idx) => {
                            const total = parseFloat(dia.total_ventas || 0);
                            let heightPerc = (total / maxVal) * 100;
                            if (isNaN(heightPerc) || heightPerc < 0) heightPerc = 0;

                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-4 group h-full justify-end">
                                    {/* Bar */}
                                    <div
                                        className="w-full max-w-[50px] bg-gradient-to-t from-[#441E73] to-[#A944FF] dark:from-zinc-800 dark:to-white rounded-t-2xl relative transition-all duration-700 hover:shadow-[0_0_30px_rgba(169,68,255,0.3)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:brightness-125 group-hover:scale-y-105 origin-bottom cursor-pointer shadow-xl border-t border-white/20"
                                        style={{ height: `${heightPerc}%`, minHeight: '8px' }}
                                    >
                                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/40 rounded-t-2xl shadow-inner"></div>
                                        {/* Tooltip */}
                                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-[#0E0D23] dark:bg-black border border-[#A944FF]/50 dark:border-white text-[11px] font-black px-5 py-2.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 whitespace-nowrap shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20 pointer-events-none text-white uppercase tracking-widest italic">
                                            {formatCurrency(total)}
                                            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0E0D23] dark:bg-black border-b border-r border-[#A944FF]/50 dark:border-white rotate-45"></div>
                                        </div>
                                    </div>

                                    {/* Label */}
                                    <div className="text-center group-hover:translate-y-1 transition-transform">
                                        <span className="text-[10px] font-black text-white dark:text-zinc-400 block mb-0.5 uppercase tracking-widest italic">
                                            {new Date(dia.fecha).toLocaleDateString('es-CO', { weekday: 'short' })}
                                        </span>
                                        <span className="text-[9px] font-bold text-[#8A7BAF] dark:text-zinc-600 uppercase">
                                            {new Date(dia.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ) : (
                <div className="h-96 flex flex-col items-center justify-center text-zinc-500 border border-dashed border-[#6C3FA8]/30 dark:border-zinc-800 rounded-[3rem] bg-[#0E0D23]/30 dark:bg-black/40 shadow-inner">
                    <div className="p-8 bg-[#1A103C] dark:bg-white/5 rounded-full mb-6 border border-white/5 shadow-2xl">
                       <PieChart size={48} className="text-[#A944FF] dark:text-zinc-700" />
                    </div>
                    <p className="font-black uppercase tracking-[0.3em] text-[10px] text-[#8A7BAF] dark:text-zinc-500">Sin datos de ventas registrados</p>
                </div>
            )}
        </div>
    );
};

export default SalesChart;
