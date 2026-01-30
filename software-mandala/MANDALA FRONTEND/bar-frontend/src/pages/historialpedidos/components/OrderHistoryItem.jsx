import React, { useState } from 'react';
import { Printer, Table, ShoppingBag, TrendingUp, ChevronDown } from 'lucide-react';

const StatusSelector = ({ pedido, onUpdateStatus }) => {
    const [isOpen, setIsOpen] = useState(false);
    const currentStatus = pedido.estado?.toLowerCase() || 'pendiente';
    
    // Status colors remain functional but subtle
    const colors = {
        pendiente: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20',
        despachado: 'bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20',
        cancelado: 'bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20'
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase transition-all hover:brightness-125 ${colors[currentStatus] || colors.pendiente}`}
            >
                {currentStatus}
                <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute top-full left-0 mt-2 w-32 bg-[#0E0D23] dark:bg-zinc-900 border border-white/10 dark:border-zinc-700 rounded-xl z-50 overflow-hidden shadow-2xl backdrop-blur-xl">
                        {['pendiente', 'despachado', 'cancelado'].map(s => (
                            <button 
                                key={s} 
                                onClick={() => { onUpdateStatus(pedido.id, s); setIsOpen(false); }} 
                                className={`w-full text-left px-4 py-2 text-[10px] font-black uppercase hover:bg-white/5 dark:hover:bg-zinc-800 transition-colors ${currentStatus === s ? 'text-[#A944FF] dark:text-white' : 'text-[#8A7BAF] dark:text-zinc-500'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const OrderHistoryItem = ({ pedido, onPrint, onUpdateStatus }) => {
    return (
        <div className="bg-[#1A103C]/80 dark:bg-zinc-900/10 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-[2rem] p-6 hover:bg-[#2B0D49] dark:hover:bg-zinc-900/40 transition-all duration-500 group shadow-2xl dark:shadow-none relative overflow-visible">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#A944FF] dark:from-zinc-100 to-transparent rounded-l-full"></div>

            <div className="flex justify-between items-start mb-10">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <h2 className="text-3xl font-black tracking-tighter text-white dark:text-white uppercase italic drop-shadow-lg">PEDIDO #{pedido.id}</h2>
                    <StatusSelector pedido={pedido} onUpdateStatus={onUpdateStatus} />
                </div>
                <button
                    onClick={() => onPrint(pedido)}
                    className="p-5 rounded-2xl bg-white/5 hover:bg-[#A944FF] dark:hover:bg-zinc-100 text-white hover:text-white dark:hover:text-black transition-all border border-white/10 shadow-2xl active:scale-95"
                    title="Imprimir Ticket"
                >
                    <Printer size={22} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                {/* Table & Seller Info */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[#8A7BAF] dark:text-zinc-500">
                        <div className="p-2.5 bg-[#0E0D23] dark:bg-white/5 rounded-xl text-white border border-white/10 shadow-inner">
                            <Table size={16} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Detalles de Mesa</span>
                    </div>
                    <div className="bg-[#0E0D23] dark:bg-black/20 border border-white/10 dark:border-white/5 rounded-[1.5rem] p-6 space-y-4 shadow-inner">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-[#8A7BAF] dark:text-zinc-500 uppercase tracking-[0.2em]">Ubicación</span>
                            <span className="text-xl font-black text-white dark:text-white italic tracking-tighter">Mesa #{pedido.mesa_numero}</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-white/5">
                            <span className="text-[10px] font-black text-[#8A7BAF] dark:text-zinc-500 uppercase tracking-[0.2em]">Vendedor</span>
                            <span className="text-[10px] font-black text-white dark:text-white uppercase tracking-widest bg-[#A944FF]/20 dark:bg-white/10 px-4 py-1.5 rounded-full">{pedido.mesera_nombre}</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-white/5">
                            <span className="text-[10px] font-black text-[#8A7BAF] dark:text-zinc-500 uppercase tracking-[0.2em]">Fecha y Hora</span>
                            <span className="text-[11px] text-[#A944FF] dark:text-zinc-400 font-black tracking-tight">
                                {pedido.fecha_hora ? new Date(pedido.fecha_hora).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Products Detail */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[#8A7BAF] dark:text-zinc-500">
                        <div className="p-2.5 bg-[#0E0D23] dark:bg-white/5 rounded-xl text-white border border-white/10 shadow-inner">
                            <ShoppingBag size={16} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Productos Consumidos</span>
                    </div>
                    <div className="bg-[#0E0D23] dark:bg-black/20 border border-white/10 dark:border-white/5 rounded-[1.5rem] p-6 space-y-4 max-h-56 overflow-y-auto custom-scrollbar shadow-inner">
                        {Array.isArray(pedido.productos_detalle) && pedido.productos_detalle.map((it, i) => (
                            <div key={i} className="flex justify-between text-sm py-3 border-b border-white/5 last:border-0 items-center hover:bg-white/5 transition-colors rounded-lg px-2 -mx-2">
                                <div className="flex items-center gap-5">
                                    <span className="w-10 h-10 flex items-center justify-center bg-[#441E73] dark:bg-zinc-800 text-white rounded-2xl text-[11px] font-black border border-white/10 shadow-lg">
                                        {it.cantidad}x
                                    </span>
                                    <span className="text-white/80 dark:text-zinc-300 text-xs font-black uppercase tracking-tight">{it.producto_nombre}</span>
                                </div>
                                <span className="text-white dark:text-white font-black text-sm tracking-tighter italic">
                                    ${(it.cantidad * (it.producto_precio || 0)).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-end pt-10 border-t border-white/10 dark:border-white/5">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-[#8A7BAF] dark:text-zinc-600 uppercase tracking-[0.3em] mb-2 font-mono">Total de Venta</span>
                    <span className="text-5xl font-black text-emerald-400 dark:text-white tracking-tighter italic drop-shadow-2xl">
                        <span className="text-xl mr-1 font-bold">$</span>
                        {parseFloat(pedido.total || 0).toLocaleString()}
                    </span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center gap-4 bg-[#A944FF]/10 dark:bg-white/5 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-[#A944FF] dark:text-zinc-500 border border-[#A944FF]/20 dark:border-white/10">
                    <TrendingUp size={16} className="text-emerald-400" /> Venta Finalizada
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryItem;
