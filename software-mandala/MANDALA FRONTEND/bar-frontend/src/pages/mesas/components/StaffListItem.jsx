import React from 'react';
import { Trash2 } from 'lucide-react';

export default function StaffListItem({ staff, onDelete }) {
    return (
        <div className="bg-[#2B0D49] hover:bg-[#2B0D49]/80 p-4 rounded-xl flex justify-between items-center transition-all border border-[#6C3FA8]/30 hover:border-[#A944FF]/50 group shadow-sm">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A944FF] to-[#FF4BC1] flex items-center justify-center font-black text-xs text-white uppercase shadow-lg">
                    {staff.nombre.charAt(0)}
                </div>
                <span className="font-bold text-white tracking-wide uppercase text-sm">{staff.nombre}</span>
            </div>
            <button
                onClick={() => onDelete(staff.id)}
                className="text-gray-500 hover:text-red-500 p-2.5 rounded-xl hover:bg-red-500/10 transition-all opacity-40 group-hover:opacity-100"
                title="Eliminar perfil"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );
}
