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
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all hover:brightness-125 ${colors[currentStatus] || colors.pendiente}`}
            >
                {currentStatus}
                <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute top-full left-0 mt-2 w-32 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl z-50 overflow-hidden shadow-2xl">
                        {['pendiente', 'despachado', 'cancelado'].map(s => (
                            <button 
                                key={s} 
                                onClick={() => { onUpdateStatus(pedido.id, s); setIsOpen(false); }} 
                                className={`w-full text-left px-4 py-2 text-[10px] font-bold uppercase hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${currentStatus === s ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}
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
        <div className="bg-white dark:bg-zinc-900/30 backdrop-blur-xl border border-zinc-200 dark:border-white/5 rounded-2xl p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all group shadow-sm dark:shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-zinc-400 dark:from-zinc-500 to-transparent opacity-50"></div>

            <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">PEDIDO #{pedido.id}</h2>
                    <StatusSelector pedido={pedido} onUpdateStatus={onUpdateStatus} />
                </div>
                <button
                    onClick={() => onPrint(pedido)}
                    className="p-3 rounded-xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-900 dark:hover:bg-white text-zinc-900 dark:text-white hover:text-white dark:hover:text-black transition-all border border-zinc-200 dark:border-white/10 shadow-sm dark:shadow-lg active:scale-95"
                    title="Imprimir Ticket"
                >
                    <Printer size={18} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                {/* Table & Seller Info */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-zinc-400 dark:text-zinc-500">
                        <div className="p-1.5 bg-zinc-100 dark:bg-white/5 rounded-md text-zinc-900 dark:text-white border border-zinc-200 dark:border-none">
                            <Table size={14} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">Detalles de Mesa</span>
                    </div>
                    <div className="bg-zinc-50 dark:bg-black/30 border border-zinc-200 dark:border-white/5 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-xs text-zinc-500">Ubicación</span>
                            <span className="text-sm font-bold text-zinc-900 dark:text-white">Mesa #{pedido.mesa_numero}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs text-zinc-500">Vendedor</span>
                            <span className="text-sm font-medium text-zinc-900 dark:text-white capitalize">{pedido.mesera_nombre}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs text-zinc-500">Fecha y Hora</span>
                            <span className="text-sm text-zinc-600 dark:text-zinc-400 font-mono tracking-tighter">
                                {pedido.fecha_hora ? new Date(pedido.fecha_hora).toLocaleString() : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Products Detail */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-zinc-400 dark:text-zinc-500">
                        <div className="p-1.5 bg-zinc-100 dark:bg-white/5 rounded-md text-zinc-900 dark:text-white border border-zinc-200 dark:border-none">
                            <ShoppingBag size={14} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">Productos Consumidos</span>
                    </div>
                    <div className="bg-zinc-50 dark:bg-black/30 border border-zinc-200 dark:border-white/5 rounded-xl p-4 space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                        {Array.isArray(pedido.productos_detalle) && pedido.productos_detalle.map((it, i) => (
                            <div key={i} className="flex justify-between text-sm py-1.5 border-b border-zinc-100 dark:border-white/5 last:border-0 items-center">
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg text-[10px] font-bold">
                                        {it.cantidad}x
                                    </span>
                                    <span className="text-zinc-700 dark:text-zinc-300 text-xs font-medium">{it.producto_nombre}</span>
                                </div>
                                <span className="text-zinc-900 dark:text-white font-bold text-xs">
                                    ${(it.cantidad * (it.producto_precio || 0)).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-zinc-100 dark:border-white/5">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total del Pedido</span>
                    <span className="text-3xl font-black text-zinc-900 dark:text-white drop-shadow-md">
                        <span className="text-base text-zinc-400 dark:text-zinc-500 mr-1 font-bold">$</span>
                        {parseFloat(pedido.total || 0).toLocaleString()}
                    </span>
                </div>
                <div className="opacity-50 group-hover:opacity-100 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter text-zinc-400 dark:text-zinc-600">
                    <TrendingUp size={12} className="text-emerald-500" /> Venta Confirmada
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryItem;
