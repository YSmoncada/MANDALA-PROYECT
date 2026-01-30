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
            className="group flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-white dark:bg-zinc-900/40 backdrop-blur-md hover:bg-zinc-50 dark:hover:bg-zinc-900/60 p-3 sm:p-4 rounded-xl sm:rounded-[1.5rem] border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10 transition-all duration-300 shadow-sm dark:shadow-none"
        >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl flex-shrink-0 border border-zinc-100 dark:border-white/5 flex items-center justify-center overflow-hidden shadow-inner">
                <img
                    src={item.producto.imagen}
                    alt={item.producto.nombre}
                    className="w-full h-full object-contain p-2"
                />
            </div>
            <div className="flex-1 text-center sm:text-left min-w-0">
                <h3 className="font-black text-zinc-900 dark:text-white text-base sm:text-xl mb-1 truncate uppercase tracking-tight">{item.producto.nombre}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 font-black tracking-widest text-[10px] sm:text-xs">
                    ${parseFloat(item.producto.precio).toLocaleString("es-CO")}
                </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full sm:w-auto">
                <div className="relative flex items-center justify-center w-full sm:w-auto">
                    <div className="flex items-center bg-zinc-100 dark:bg-black/40 rounded-xl p-1 border border-zinc-200 dark:border-white/5">
                        <button onClick={handleDecrease} className="w-8 h-8 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 rounded-lg transition-all active:scale-90">
                            <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-black text-zinc-900 dark:text-white">{item.cantidad}</span>
                        <button onClick={handleIncrease} className="w-8 h-8 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 rounded-lg transition-all active:scale-90">
                            <Plus size={16} />
                        </button>
                    </div>
                    <button onClick={handleRemove} className="absolute right-0 sm:static p-2 text-zinc-400 dark:text-zinc-500 hover:text-rose-500 rounded-xl transition-colors sm:hidden">
                        <Trash2 size={20} />
                    </button>
                </div>
                <div className="flex flex-col items-center sm:items-end">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-600 font-bold uppercase tracking-widest sm:hidden">Subtotal</span>
                    <p className="font-black text-lg sm:text-2xl text-zinc-900 dark:text-white text-center sm:text-right w-full sm:w-auto sm:min-w-[120px] tracking-tighter">
                        ${(parseFloat(item.producto.precio) * item.cantidad).toLocaleString("es-CO")}
                    </p>
                </div>
            </div>
        </div>
    );
});

export default OrderItem;