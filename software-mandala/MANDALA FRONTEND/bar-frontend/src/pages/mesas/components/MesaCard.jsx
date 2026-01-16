import React from 'react';
import { Trash2, Users } from 'lucide-react';

export default function MesaCard({ mesa, onDelete }) {
    return (
        <div className="relative bg-[#2B0D49] border border-[#6C3FA8]/30 hover:border-[#A944FF] rounded-2xl p-6 text-center group transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(169,68,255,0.2)] overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#A944FF]/5 rounded-bl-full pointer-events-none"></div>

            <p className="text-[10px] font-bold text-[#A944FF] uppercase tracking-widest mb-1">MESA</p>
            <p className="text-5xl font-black text-white my-3 drop-shadow-sm">
                {mesa.numero}
            </p>
            <div className="flex items-center justify-center gap-1.5 text-gray-400">
                <Users size={12} className="text-[#C2B6D9]" />
                <span className="text-xs font-medium">Cap: {mesa.capacidad}</span>
            </div>

            <button
                onClick={() => onDelete(mesa.id)}
                className="absolute top-3 right-3 p-2 text-red-500 bg-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-lg"
                title="Eliminar Mesa"
            >
                <Trash2 size={14} />
            </button>
        </div>
    );
}
