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
        <div className="bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
            {/* Glow Effect Behind */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>

            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <TrendingUp size={24} className="text-white" />
                Comportamiento de Ventas (Últimos 7 días)
            </h3>

            {sortedVentas.length > 0 ? (
                <div className="relative h-96 w-full">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-zinc-600 pointer-events-none z-0 pb-10 pr-4">
                        {[100, 75, 50, 25, 0].map((percent) => (
                            <div key={percent} className="w-full border-b border-zinc-800 flex items-center h-px">
                                <span className="mb-2 ml-1 opacity-50 font-bold uppercase">{percent}%</span>
                            </div>
                        ))}
                    </div>

                    {/* Bars Container */}
                    <div className="absolute inset-x-0 bottom-0 top-0 flex items-end justify-around gap-4 pb-10 px-4 z-10 pl-12">
                        {sortedVentas.map((dia, idx) => {
                            const total = parseFloat(dia.total_ventas || 0);
                            let heightPerc = (total / maxVal) * 100;
                            if (isNaN(heightPerc) || heightPerc < 0) heightPerc = 0;

                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-4 group h-full justify-end">
                                    {/* Bar */}
                                    <div
                                        className="w-full max-w-[60px] bg-gradient-to-t from-zinc-800 to-white rounded-t-xl relative transition-all duration-700 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:brightness-110 group-hover:scale-y-105 origin-bottom cursor-pointer shadow-lg"
                                        style={{ height: `${heightPerc}%`, minHeight: '6px' }}
                                    >
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-white/40 rounded-t-xl"></div>
                                        {/* Tooltip */}
                                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-black border border-white text-[10px] font-black px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 whitespace-nowrap shadow-2xl z-20 pointer-events-none text-white italic">
                                            {formatCurrency(total)}
                                            <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2 h-2 bg-black border-b border-r border-white rotate-45"></div>
                                        </div>
                                    </div>

                                    {/* Label */}
                                    <div className="text-center group-hover:translate-y-1 transition-transform">
                                        <span className="text-[10px] font-black text-zinc-400 block mb-0.5 uppercase tracking-tighter">
                                            {new Date(dia.fecha).toLocaleDateString('es-CO', { weekday: 'short' })}
                                        </span>
                                        <span className="text-[9px] font-bold text-zinc-600 uppercase">
                                            {new Date(dia.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ) : (
                <div className="h-96 flex flex-col items-center justify-center text-zinc-500 border border-dashed border-zinc-800 rounded-[40px] bg-black/40">
                    <div className="p-6 bg-white/5 rounded-full mb-4">
                       <PieChart size={48} className="text-zinc-700" />
                    </div>
                    <p className="font-bold uppercase tracking-widest text-xs">Sin datos disponibles</p>
                </div>
            )}
        </div>
    );
};

export default SalesChart;
