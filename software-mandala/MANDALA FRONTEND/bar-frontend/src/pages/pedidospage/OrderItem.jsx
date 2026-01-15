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
            className="group flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-[#2B0D49]/80 hover:bg-[#2B0D49] p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#6C3FA8]/50 hover:border-[#A944FF] transition-all duration-300 shadow-md"
        >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-xl flex-shrink-0 border border-[#6C3FA8]/30 flex items-center justify-center overflow-hidden">
                <img
                    src={item.producto.imagen}
                    alt={item.producto.nombre}
                    className="w-full h-full object-contain"
                />
            </div>
            <div className="flex-1 text-center sm:text-left min-w-0">
                <h3 className="font-bold text-white text-base sm:text-xl mb-1 truncate">{item.producto.nombre}</h3>
                <p className="text-[#A944FF] font-bold tracking-wide text-sm sm:text-base">
                    ${parseFloat(item.producto.precio).toLocaleString("es-CO")}
                </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="relative flex items-center justify-center w-full sm:w-auto">
                    <div className="flex items-center bg-[#0E0D23] rounded-lg p-1 border border-[#6C3FA8]/50">
                        <button onClick={handleDecrease} className="w-7 h-7 flex items-center justify-center text-[#8A7BAF] hover:text-white hover:bg-[#441E73] rounded-md transition-colors">
                            <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-bold text-white">{item.cantidad}</span>
                        <button onClick={handleIncrease} className="w-7 h-7 flex items-center justify-center text-[#8A7BAF] hover:text-white hover:bg-[#441E73] rounded-md transition-colors">
                            <Plus size={16} />
                        </button>
                    </div>
                    <button onClick={handleRemove} className="absolute right-0 sm:static p-2 text-[#8A7BAF] hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors sm:hidden">
                        <Trash2 size={20} />
                    </button>
                </div>
                <p className="font-black text-lg sm:text-xl text-white text-center sm:text-right w-full sm:w-auto sm:min-w-[100px]">
                    ${(parseFloat(item.producto.precio) * item.cantidad).toLocaleString("es-CO")}
                </p>
            </div>
        </div>
    );
});

export default OrderItem;