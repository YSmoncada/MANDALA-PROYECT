import React from 'react';
import { User, Lock, Trash2, GlassWater } from 'lucide-react';
import { UI_CLASSES } from '../../../constants/ui';

const UserCard = ({ item, type, onEdit, onDelete, canDelete }) => {
    const isUser = type === 'usuario';
    const isAdmin = isUser && (item.role === 'admin' || item.is_superuser);
    const isProtected = ['admin', 'barra', 'prueba'].includes(item.username);

    const iconBg = isAdmin 
        ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
        : (isUser ? 'bg-[#A944FF]/10 text-[#A944FF] border-[#A944FF]/20' : 'bg-[#FF4BC1]/10 text-[#FF4BC1] border-[#FF4BC1]/20');

    const statusBadge = isAdmin 
        ? 'bg-rose-500/5 text-rose-500 border-rose-500/10' 
        : (isUser ? 'bg-[#A944FF]/5 text-[#A944FF] border-[#A944FF]/10' : 'bg-[#FF4BC1]/5 text-[#FF4BC1] border-[#FF4BC1]/10');

    return (
        <div className="group relative bg-[#120F25]/60 backdrop-blur-xl border border-white/5 hover:border-[#A944FF]/30 rounded-[2.5rem] p-8 transition-all duration-500 flex flex-col h-full shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            
            <div className="flex items-start justify-between mb-8">
                <div className={`p-5 rounded-3xl border ${iconBg} shadow-inner transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500`}>
                    {isUser ? <User size={24} /> : <GlassWater size={24} />}
                </div>
                
                <div className="flex flex-col items-end gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusBadge}`}>
                        {isUser ? (item.role || (item.is_superuser ? 'Admin' : 'Usuario')) : 'Personal'}
                    </span>

                    {canDelete && !isProtected && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                            className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg active:scale-90"
                            title="Eliminar"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-grow mb-8">
                <h3 className="text-2xl font-black text-white mb-2 truncate tracking-tight uppercase group-hover:text-[#A944FF] transition-colors">
                    {item.username || item.nombre}
                </h3>
                <div className="flex items-center gap-2">
                    <div className="h-1 w-8 bg-white/5 rounded-full"></div>
                    <p className="text-[10px] text-slate-500 font-black tracking-[0.3em] uppercase">
                        ID:{String(item.id).padStart(4, '0')}
                    </p>
                </div>
            </div>

            <button
                onClick={onEdit}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-[#A944FF]/10 border border-[#A944FF]/20 text-[#A944FF] font-black text-[10px] uppercase tracking-[0.3em] transition-all hover:bg-[#A944FF] hover:text-white active:scale-95 shadow-xl hover:shadow-[#A944FF]/20"
            >
                <Lock size={14} />
                {isUser ? 'Clave' : 'PIN'}
            </button>
        </div>
    );
};

export default UserCard;
