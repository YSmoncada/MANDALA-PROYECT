import { memo } from 'react';
import { Clock, Check, X, Loader2 } from 'lucide-react';

const statusConfig = {
    pendiente: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: <Clock size={12} /> },
    despachado: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: <Check size={12} /> },
    cancelado: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: <X size={12} /> },
    entregado: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: <Check size={12} /> },
    en_proceso: { color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: <Loader2 size={12} className="animate-spin" /> },
    default: { color: 'bg-gray-500/20 text-gray-400', icon: null }
};

const StatusBadge = memo(({ estado }) => {
    const statusKey = estado?.toLowerCase() || 'pendiente';
    const config = statusConfig[statusKey] || statusConfig.default;

    return (
        <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold border ${config.color}`}>
            {config.icon} {statusKey.replace('_', ' ')}
        </span>
    );
});

export default StatusBadge;