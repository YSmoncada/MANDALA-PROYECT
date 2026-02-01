import { memo } from 'react';
import { Plus } from 'lucide-react';
import StatusBadge from './StatusBadge';

const PedidoCard = memo(({ pedido, onAgregarProductos }) => {
    return (
        <div className="bg-[#1A103C]/80 dark:bg-zinc-900/10 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-[2.5rem] p-8 flex flex-col hover:border-[#A944FF]/40 dark:hover:border-white/10 hover:shadow-[0_50px_80px_-20px_rgba(0,0,0,0.6)] transition-all duration-500 relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A944FF] to-transparent opacity-30"></div>
            
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-white/10 dark:border-white/5">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="font-black text-2xl text-white dark:text-white uppercase tracking-tighter italic">Orden #{pedido.id}</h2>
                        <StatusBadge estado={pedido.estado} />
                    </div>
                    <p className="text-[10px] text-[#8A7BAF] dark:text-zinc-500 font-black uppercase tracking-[0.2em]">
                        Mesa: <span className="text-white dark:text-white bg-[#A944FF]/20 px-2 py-0.5 rounded ml-1">{pedido.is_personal_order ? "Personal" : `Nº ${pedido.mesa_numero}`}</span>
                    </p>
                </div>
                <div className="text-right flex-shrink-0 text-[#8A7BAF] dark:text-zinc-600 font-black uppercase tracking-widest text-[9px]">
                    <p>{new Date(pedido.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p>{new Date(pedido.fecha_hora).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="space-y-3 mb-8 max-h-48 overflow-y-auto pr-3 flex-grow custom-scrollbar">
                {pedido.productos_detalle.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-[#0E0D23]/40 dark:bg-black/20 p-3 rounded-2xl text-xs border border-white/5 group/item hover:bg-[#0E0D23]/60 dark:hover:bg-black/40 transition-colors">
                        <div className="flex items-center gap-3">
                            <span className="bg-[#A944FF] dark:bg-white text-white dark:text-black font-black px-2 py-1 rounded-lg text-[10px] shadow-lg">{item.cantidad}×</span>
                            <span className="text-white/80 dark:text-zinc-300 uppercase font-bold tracking-tight">{item.producto_nombre}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-auto">
                <div className="flex items-center justify-between pt-6 border-t border-white/10 dark:border-white/5 mb-6">
                    <span className="text-[10px] text-[#8A7BAF] dark:text-zinc-500 font-black uppercase tracking-[0.3em]">Total Orden</span>
                    <span className="text-3xl font-black text-emerald-400 dark:text-white tracking-tighter italic drop-shadow-lg">
                        ${parseFloat(pedido.total).toLocaleString('es-CO')}
                    </span>
                </div>

                <button
                    onClick={() => onAgregarProductos(pedido.mesa)}
                    className="w-full py-5 bg-[#441E73] dark:bg-white hover:bg-[#A944FF] dark:hover:bg-zinc-200 text-white dark:text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 border border-white/10 dark:border-transparent"
                >
                    <Plus size={18} />
                    Extender Pedido
                </button>
            </div>
        </div>
    );
});

export default PedidoCard;