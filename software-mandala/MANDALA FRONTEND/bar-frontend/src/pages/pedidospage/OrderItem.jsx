import { memo, useCallback } from "react";
import { Trash2, Plus, Minus } from 'lucide-react';

const OrderItem = memo(({ item, onUpdateCantidad, onRemoveItem }) => {
    const handleDecrease = useCallback(() => {
        if (item.cantidad > 1) {
            onUpdateCantidad(item.producto.id, item.cantidad - 1);
        } else {
            onRemoveItem(item.producto.id);
        }
    }, [item.cantidad, item.producto.id, onUpdateCantidad, onRemoveItem]);

    const handleIncrease = useCallback(() => {
        onUpdateCantidad(item.producto.id, item.cantidad + 1);
    }, [item.producto.id, item.cantidad, onUpdateCantidad]);

    const handleRemove = useCallback(() => {
        onRemoveItem(item.producto.id);
    }, [item.producto.id, onRemoveItem]);

    return (
        <div
            className="group flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-[#1A103C]/80 dark:bg-zinc-900/10 backdrop-blur-xl hover:bg-[#1A103C] dark:hover:bg-zinc-900/30 p-4 sm:p-6 rounded-[2rem] border border-white/10 dark:border-transparent hover:border-[#A944FF]/40 dark:hover:border-zinc-800/50 transition-all duration-500 shadow-2xl"
        >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#0E0D23] dark:bg-zinc-800 rounded-2xl flex-shrink-0 border border-white/10 dark:border-white/5 flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-500">
                <img
                    src={item.producto.imagen}
                    alt={item.producto.nombre}
                    className="w-full h-full object-contain p-3"
                />
            </div>
            <div className="flex-1 text-center sm:text-left min-w-0">
                <h3 className="font-black text-white dark:text-white text-lg sm:text-2xl mb-1 truncate uppercase tracking-tighter italic">{item.producto.nombre}</h3>
                <p className="text-[#8A7BAF] dark:text-zinc-500 font-black tracking-[0.2em] text-[10px] sm:text-xs">
                    VALOR UNIDAD: ${parseFloat(item.producto.precio).toLocaleString("es-CO")}
                </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-10 w-full sm:w-auto">
                <div className="flex items-center bg-black/40 dark:bg-black/20 rounded-2xl p-1.5 border border-white/10 dark:border-white/5">
                    <button onClick={handleDecrease} className="w-10 h-10 flex items-center justify-center text-[#8A7BAF] dark:text-zinc-400 hover:text-white dark:hover:text-white hover:bg-white/5 dark:hover:bg-zinc-800 rounded-xl transition-all active:scale-90">
                        <Minus size={18} />
                    </button>
                    <span className="w-12 text-center font-black text-lg text-white dark:text-white">{item.cantidad}</span>
                    <button onClick={handleIncrease} className="w-10 h-10 flex items-center justify-center text-[#8A7BAF] dark:text-zinc-400 hover:text-white dark:hover:text-white hover:bg-white/5 dark:hover:bg-zinc-800 rounded-xl transition-all active:scale-90">
                        <Plus size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center sm:items-end">
                        <span className="text-[10px] text-[#8A7BAF] dark:text-zinc-600 font-black uppercase tracking-[0.2em] sm:hidden">Total</span>
                        <p className="font-black text-2xl sm:text-3xl text-emerald-400 dark:text-white text-center sm:text-right w-full sm:w-auto sm:min-w-[140px] tracking-tighter drop-shadow-lg italic">
                            ${(parseFloat(item.producto.precio) * item.cantidad).toLocaleString("es-CO")}
                        </p>
                    </div>
                    
                    <button onClick={handleRemove} className="p-3 text-rose-500/50 hover:text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 rounded-2xl transition-all border border-rose-500/10 active:scale-90 shadow-2xl">
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
});

export default OrderItem;