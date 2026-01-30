import { memo } from 'react';
import { Clock, Check, X, Loader2 } from 'lucide-react';

const statusConfig = {
    pendiente: { color: 'bg-yellow-50 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30', icon: <Clock size={12} /> },
    despachado: { color: 'bg-emerald-50 dark:bg-green-500/20 text-emerald-600 dark:text-green-400 border-emerald-200 dark:border-green-500/30', icon: <Check size={12} /> },
    cancelado: { color: 'bg-rose-50 dark:bg-red-500/20 text-rose-600 dark:text-red-400 border-rose-200 dark:border-red-500/30', icon: <X size={12} /> },
    entregado: { color: 'bg-sky-50 dark:bg-blue-500/20 text-sky-600 dark:text-blue-400 border-sky-200 dark:border-blue-500/30', icon: <Check size={12} /> },
    en_proceso: { color: 'bg-orange-50 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/30', icon: <Loader2 size={12} className="animate-spin" /> },
    default: { color: 'bg-zinc-50 dark:bg-zinc-500/20 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-500/30', icon: null }
};

const StatusBadge = memo(({ estado }) => {
    const statusKey = estado?.toLowerCase() || 'pendiente';
    const config = statusConfig[statusKey] || statusConfig.default;

    return (
        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${config.color}`}>
            {config.icon} 
            <span>{statusKey.replace('_', ' ')}</span>
        </span>
    );
});

export default StatusBadge;