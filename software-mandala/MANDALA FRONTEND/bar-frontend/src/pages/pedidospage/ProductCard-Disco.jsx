import { useState, memo, useCallback } from "react";
import toast from 'react-hot-toast';
import { Plus, Minus } from 'lucide-react';

/**
 * Individual product card for the menu.
 * Optimized for performance and organized for both mobile and desktop.
 */
function ProductCardDisco({ producto, onAgregarPedido }) {
    const [cantidad, setCantidad] = useState(1);

    const aumentar = useCallback(() => setCantidad(prev => prev + 1), []);
    const disminuir = useCallback(() => setCantidad(prev => prev > 1 ? prev - 1 : 1), []);

    const agregarPedido = useCallback(() => {
        onAgregarPedido(producto, cantidad);
        const nombreProducto = cantidad > 1 ? `${producto.nombre}s` : producto.nombre;
        toast.success(`Agregado: ${cantidad} ${nombreProducto}`, {
            style: {
                background: '#0E0D23',
                color: '#fff',
                border: '1px solid #A944FF',
            },
            iconTheme: {
                primary: '#A944FF',
                secondary: '#fff',
            },
        });
        setCantidad(1);
    }, [cantidad, producto, onAgregarPedido]);

    return (
        <div className="group relative bg-[#1A103C]/80 hover:bg-[#2B0D49] rounded-2xl p-4 sm:p-5 transition-all duration-300 flex flex-col h-full hover:shadow-[0_0_25px_rgba(169,68,255,0.2)] transform-gpu border border-white/5 hover:border-[#A944FF]/30">

            {/* Image Container */}
            <div className="relative aspect-square w-full mb-3 sm:mb-4 overflow-hidden rounded-xl bg-white p-2 flex items-center justify-center shadow-inner">
                <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="w-full h-full object-contain drop-shadow-xl scale-100 group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col">
                <div className="mb-1.5 flex justify-center sm:justify-start">
                    <span className="text-[9px] sm:text-[10px] font-bold text-[#A944FF] uppercase tracking-widest border border-[#A944FF]/30 bg-[#A944FF]/10 px-2 py-1 rounded-lg">
                        {producto.unidad}
                    </span>
                </div>

                <h3 className="font-bold text-sm sm:text-lg text-white leading-tight mb-2 sm:mb-4 line-clamp-2 transition-colors capitalize text-center sm:text-left h-10 sm:h-12 flex items-center justify-center sm:justify-start">
                    {producto.nombre}
                </h3>

                <div className="mt-auto pt-3 border-t border-[#6C3FA8]/30 space-y-3">
                    <div className="flex flex-col gap-2">
                        {/* Price Row */}
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[9px] font-bold text-[#8A7BAF] uppercase tracking-tighter">Precio</span>
                            <p className="text-lg sm:text-xl font-black text-green-400 tracking-tight">
                                ${parseFloat(producto.precio).toLocaleString("es-CO")}
                            </p>
                        </div>

                        {/* Quantity Row */}
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[9px] font-bold text-[#8A7BAF] uppercase tracking-tighter">Cantidad</span>
                            <div className="flex items-center bg-[#0E0D23] rounded-lg border border-[#6C3FA8]/50 p-0.5">
                                <button
                                    onClick={disminuir}
                                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[#8A7BAF] hover:text-white hover:bg-[#441E73] rounded-md transition-colors"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="w-6 sm:w-8 text-center font-bold text-white text-xs sm:text-sm">{cantidad}</span>
                                <button
                                    onClick={aumentar}
                                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[#8A7BAF] hover:text-white hover:bg-[#441E73] rounded-md transition-colors"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={agregarPedido}
                        className="w-full bg-[#441E73] hover:bg-gradient-to-r hover:from-[#A944FF] hover:to-[#FF4BC1] text-white font-bold py-3 sm:py-3.5 rounded-xl transition-all duration-300 text-[10px] sm:text-xs uppercase tracking-widest border border-[#6C3FA8] hover:border-transparent shadow-lg"
                    >
                        Agregar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default memo(ProductCardDisco);
