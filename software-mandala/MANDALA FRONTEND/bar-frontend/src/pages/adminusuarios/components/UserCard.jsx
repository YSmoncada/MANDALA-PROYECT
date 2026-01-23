import React from 'react';
import { User, Lock, Trash2, GlassWater } from 'lucide-react';
import { UI_CLASSES } from '../../../constants/ui';

const UserCard = ({ item, type, onEdit, onDelete, canDelete }) => {
    const isUser = type === 'usuario';
    const isAdmin = isUser && (item.role === 'admin' || item.is_superuser);
    const isProtected = ['admin', 'barra', 'prueba'].includes(item.username);

    const gradientClasses = isAdmin 
        ? 'from-rose-500 to-pink-600' 
        : (isUser ? 'from-purple-500 to-indigo-600' : 'from-pink-500 to-rose-600');

    const shadowClasses = isAdmin 
        ? 'shadow-rose-900/40' 
        : (isUser ? 'shadow-purple-900/40' : 'shadow-pink-900/40');

    const badgeClasses = isAdmin 
        ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
        : (isUser ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-pink-500/10 border-pink-500/30 text-pink-400');

    return (
        <div className={`${UI_CLASSES.glassCard} group p-6 flex flex-col h-full relative overflow-hidden transition-all duration-300 hover:border-purple-500/50`}>
            {/* Type Indicator */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradientClasses} opacity-50`}></div>

            <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradientClasses} ${shadowClasses} shadow-lg transform group-hover:scale-110 transition-transform duration-500`}>
                    {isUser ? <User className="text-white" size={24} /> : <GlassWater className="text-white" size={24} />}
                </div>
                
                <div className="flex flex-col items-end gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${badgeClasses}`}>
                        {isUser ? (item.role || (item.is_superuser ? 'Admin' : 'Usuario')) : 'Personal'}
                    </span>

                    {canDelete && !isProtected && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                            className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow-lg active:scale-90"
                            title="Eliminar"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-grow mb-6">
                <h3 className="text-xl font-bold text-white mb-1 truncate tracking-tight uppercase">
                    {item.username || item.nombre}
                </h3>
                <p className="text-[10px] text-gray-500 font-black tracking-widest uppercase">
                    ID: {String(item.id).padStart(4, '0')}
                </p>
            </div>

            <button
                onClick={onEdit}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white shadow-lg shadow-emerald-900/20"
            >
                <Lock size={14} />
                Cambiar {isUser ? 'Clave' : 'PIN'}
            </button>
        </div>
    );
};

export default UserCard;
