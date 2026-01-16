import React, { useState } from 'react';
import { Printer, Table, ShoppingBag, TrendingUp, ChevronDown } from 'lucide-react';

const StatusSelector = ({ pedido, onUpdateStatus }) => {
    const [isOpen, setIsOpen] = useState(false);
    const currentStatus = pedido.estado?.toLowerCase() || 'pendiente';
    
    const colors = {
        pendiente: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        despachado: 'bg-green-500/20 text-green-400 border-green-500/30',
        cancelado: 'bg-red-500/20 text-red-400 border-red-500/30'
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
                    <div className="absolute top-full left-0 mt-2 w-32 bg-[#1A103C] border border-purple-500/30 rounded-xl z-50 overflow-hidden shadow-2xl backdrop-blur-xl">
                        {['pendiente', 'despachado', 'cancelado'].map(s => (
                            <button 
                                key={s} 
                                onClick={() => { onUpdateStatus(pedido.id, s); setIsOpen(false); }} 
                                className={`w-full text-left px-4 py-2 text-[10px] font-bold uppercase hover:bg-white/10 transition-colors ${currentStatus === s ? 'text-purple-400' : 'text-gray-300'}`}
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
        <div className="bg-[#441E73]/60 backdrop-blur-xl border border-[#6C3FA8] rounded-2xl p-6 hover:bg-[#441E73]/80 transition-all group shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#A944FF] to-[#FF4BC1]"></div>

            <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <h2 className="text-2xl font-black tracking-tight">PEDIDO #{pedido.id}</h2>
                    <StatusSelector pedido={pedido} onUpdateStatus={onUpdateStatus} />
                </div>
                <button
                    onClick={() => onPrint(pedido)}
                    className="p-3 rounded-xl bg-[#A944FF]/10 hover:bg-[#A944FF] text-[#A944FF] hover:text-white transition-all border border-[#A944FF]/20 shadow-lg active:scale-95"
                    title="Imprimir Ticket"
                >
                    <Printer size={18} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                {/* Table & Seller Info */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[#C2B6D9]">
                        <div className="p-1.5 bg-white/5 rounded-md text-[#A944FF]">
                            <Table size={14} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">Detalles de Mesa</span>
                    </div>
                    <div className="bg-[#2B0D49] border border-[#6C3FA8]/30 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-xs text-[#C2B6D9]">Ubicación</span>
                            <span className="text-sm font-bold text-white">Mesa #{pedido.mesa_numero}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs text-[#C2B6D9]">Vendedor</span>
                            <span className="text-sm font-medium text-white capitalize">{pedido.mesera_nombre}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs text-[#C2B6D9]">Fecha y Hora</span>
                            <span className="text-sm text-gray-400 font-mono tracking-tighter">
                                {pedido.fecha_hora ? new Date(pedido.fecha_hora).toLocaleString() : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Products Detail */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[#C2B6D9]">
                        <div className="p-1.5 bg-white/5 rounded-md text-[#A944FF]">
                            <ShoppingBag size={14} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">Productos Consumidos</span>
                    </div>
                    <div className="bg-[#2B0D49] border border-[#6C3FA8]/30 rounded-xl p-4 space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                        {Array.isArray(pedido.productos_detalle) && pedido.productos_detalle.map((it, i) => (
                            <div key={i} className="flex justify-between text-sm py-1.5 border-b border-white/5 last:border-0 items-center">
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 flex items-center justify-center bg-[#A944FF]/20 text-[#A944FF] rounded-lg text-[10px] font-bold">
                                        {it.cantidad}x
                                    </span>
                                    <span className="text-gray-300 text-xs font-medium">{it.producto_nombre}</span>
                                </div>
                                <span className="text-white font-bold text-xs">
                                    ${(it.cantidad * (it.producto_precio || 0)).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-[#6C3FA8]/30">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#A944FF] uppercase tracking-widest">Total del Pedido</span>
                    <span className="text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                        <span className="text-base text-[#A944FF] mr-1 font-bold">$</span>
                        {parseFloat(pedido.total || 0).toLocaleString()}
                    </span>
                </div>
                <div className="opacity-50 group-hover:opacity-100 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter text-[#C2B6D9]">
                    <TrendingUp size={12} className="text-green-400" /> Venta Confirmada
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryItem;
