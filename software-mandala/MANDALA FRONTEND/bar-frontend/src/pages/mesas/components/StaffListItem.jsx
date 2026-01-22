import React from 'react';
import { Trash2, ShieldCheck } from 'lucide-react';

export default function StaffListItem({ staff, onDelete }) {
    return (
        <div className="bg-white/5 hover:bg-white/10 p-4 rounded-xl flex justify-between items-center transition-all border border-white/5 hover:border-[#FF4BC1]/30 group shadow-lg">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF4BC1] to-[#A944FF] flex items-center justify-center font-black text-sm text-white uppercase shadow-lg transform group-hover:rotate-3 transition-transform">
                    {staff.nombre.charAt(0)}
                </div>
                <div>
                    <span className="font-bold text-white tracking-wide uppercase text-sm block">{staff.nombre}</span>
                    <div className="flex items-center gap-1">
                        <ShieldCheck size={10} className="text-[#FF4BC1]" />
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Personal Autorizado</span>
                    </div>
                </div>
            </div>
            <button
                onClick={() => onDelete(staff.id)}
                className="text-gray-500 hover:text-rose-500 p-2.5 rounded-xl hover:bg-rose-500/10 transition-all opacity-40 group-hover:opacity-100"
                title="Eliminar perfil"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );
}
