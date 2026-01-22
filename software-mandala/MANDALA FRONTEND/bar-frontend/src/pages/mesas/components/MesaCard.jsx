import React from 'react';
import { Trash2, Users } from 'lucide-react';

export default function MesaCard({ mesa, onDelete }) {
    return (
        <div className="relative bg-white/5 border border-white/10 hover:border-[#A944FF]/50 rounded-2xl p-6 text-center group transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(169,68,255,0.15)] overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#A944FF]/5 rounded-bl-full pointer-events-none"></div>

            <p className="text-[10px] font-black text-[#A944FF] uppercase tracking-[0.3em] mb-1">Mesa</p>
            <p className="text-5xl font-black text-white my-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] italic">
                {mesa.numero}
            </p>
            <div className="flex items-center justify-center gap-1.5 text-gray-400">
                <div className="p-1 px-2 rounded-full bg-white/5 border border-white/5 flex items-center gap-2">
                    <Users size={12} className="text-[#A944FF]" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-300">Cap: {mesa.capacidad}</span>
                </div>
            </div>

            <button
                onClick={() => onDelete(mesa.id)}
                className="absolute top-3 right-3 p-2 text-rose-500 bg-rose-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white shadow-lg"
                title="Eliminar Mesa"
            >
                <Trash2 size={14} />
            </button>
        </div>
    );
}
