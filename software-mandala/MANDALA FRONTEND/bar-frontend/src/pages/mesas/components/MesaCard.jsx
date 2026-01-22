import React from 'react';
import { Trash2, Users } from 'lucide-react';

export default function MesaCard({ mesa, onDelete }) {
    return (
        <div className="relative bg-[#2B0D49]/40 border border-[#6C3FA8]/20 hover:border-[#A944FF]/50 rounded-xl p-4 text-center group transition-all duration-300 hover:bg-[#A944FF]/5 hover:shadow-[0_0_15px_rgba(169,68,255,0.1)]">
            <p className="text-[9px] font-black text-[#8A7BAF] uppercase tracking-[0.2em] group-hover:text-[#A944FF] transition-colors">Mesas</p>
            <p className="text-3xl font-black text-white my-1 italic">
                {mesa.numero}
            </p>
            <div className="flex items-center justify-center gap-1 text-[#8A7BAF]">
                <Users size={10} />
                <span className="text-[10px] font-bold">Cap: {mesa.capacidad}</span>
            </div>

            <button
                onClick={() => onDelete(mesa.id)}
                className="absolute top-2 right-2 p-1.5 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                title="Eliminar"
            >
                <Trash2 size={12} />
            </button>
        </div>
    );
}
