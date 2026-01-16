import React from 'react';
import { Trash2, ChevronDown } from 'lucide-react';

const HistoryFilter = ({ 
    vendedores, 
    vendedorSeleccionado, 
    setVendedorSeleccionado, 
    fechaSeleccionada, 
    setFechaSeleccionada, 
    onClear, 
    onDeleteHistory,
    isAdmin 
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 bg-[#441E73]/60 backdrop-blur-xl p-6 rounded-2xl border border-[#6C3FA8] shadow-2xl">
            {/* Seller Filter */}
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#A944FF] uppercase tracking-widest ml-1">Vendedor</label>
                <div className="relative group">
                    <select
                        value={vendedorSeleccionado}
                        onChange={e => setVendedorSeleccionado(e.target.value)}
                        className="w-full bg-[#2B0D49] border border-[#6C3FA8] rounded-xl p-3 text-sm focus:ring-[#A944FF] focus:border-[#A944FF] outline-none capitalize appearance-none cursor-pointer hover:bg-[#3D1466] transition-all"
                    >
                        <option value="">-- Todos --</option>
                        {vendedores.map(v => (
                            <option key={v.id} value={v.id}>
                                {v.nombre}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#A944FF]">
                        <ChevronDown size={18} />
                    </div>
                </div>
            </div>

            {/* Date Filter */}
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#A944FF] uppercase tracking-widest ml-1">Fecha</label>
                <input
                    type="date"
                    value={fechaSeleccionada}
                    onChange={e => setFechaSeleccionada(e.target.value)}
                    className="w-full bg-[#2B0D49] border border-[#6C3FA8] rounded-xl p-3 text-sm focus:ring-[#A944FF] focus:border-[#A944FF] outline-none text-white hover:bg-[#3D1466] transition-all"
                />
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
                <button
                    onClick={onClear}
                    className="w-full h-[46px] bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs transition-all font-bold uppercase tracking-widest active:scale-95"
                >
                    Limpiar
                </button>
            </div>

            {/* Admin Action: Delete History */}
            {isAdmin && (
                <div className="flex items-end">
                    <button
                        onClick={onDeleteHistory}
                        className="w-full h-[46px] bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl text-xs transition-all flex items-center justify-center gap-2 font-bold uppercase tracking-widest active:scale-95 group"
                    >
                        <Trash2 size={16} className="group-hover:animate-pulse" /> Borrar Todo
                    </button>
                </div>
            )}
        </div>
    );
};

export default HistoryFilter;
