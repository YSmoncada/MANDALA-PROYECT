import React from 'react';
import { User, Lock, Trash2, GlassWater } from 'lucide-react';
import { UI_CLASSES } from '../../../constants/ui';

const UserCard = ({ item, type, onEdit, onDelete, canDelete }) => {
    const isUser = type === 'usuario';
    const isAdmin = isUser && (item.role === 'admin' || item.is_superuser);
    const isProtected = ['admin', 'barra', 'prueba'].includes(item.username);

    const iconBg = isAdmin 
        ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' 
        : (isUser ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-white/5' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border-zinc-200 dark:border-white/10');

    const statusBadge = isAdmin 
        ? 'bg-red-500/5 text-red-600 dark:text-red-400 border-red-500/10' 
        : (isUser ? 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-white/5' : 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-900 dark:text-white border-zinc-200 dark:border-white/10');

    return (
        <div className="group relative bg-white dark:bg-zinc-900/30 backdrop-blur-md border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/20 rounded-[2.5rem] p-8 transition-all duration-500 flex flex-col h-full shadow-sm dark:shadow-2xl hover:shadow-xl dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            
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
                            className="p-2.5 rounded-2xl bg-red-100 dark:bg-rose-500/10 border border-red-200 dark:border-rose-500/20 text-red-600 dark:text-rose-500 hover:bg-red-500 dark:hover:bg-rose-500 hover:text-white transition-all shadow-md dark:shadow-lg active:scale-90"
                            title="Eliminar"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-grow mb-8">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2 truncate tracking-tight uppercase group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                    {item.username || item.nombre}
                </h3>
                <div className="flex items-center gap-2">
                    <div className="h-1 w-8 bg-zinc-200 dark:bg-white/10 rounded-full"></div>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-black tracking-[0.3em] uppercase">
                        ID:{String(item.id).padStart(4, '0')}
                    </p>
                </div>
            </div>

            <button
                onClick={onEdit}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-zinc-900 dark:bg-zinc-900 border border-transparent dark:border-white/5 text-white dark:text-zinc-400 font-black text-[10px] uppercase tracking-[0.3em] transition-all hover:bg-black dark:hover:bg-white dark:hover:text-black active:scale-95 shadow-xl hover:shadow-white/10"
            >
                <Lock size={14} />
                {isUser ? 'Clave' : 'PIN'}
            </button>
        </div>
    );
};

export default UserCard;
