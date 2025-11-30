import { useState } from "react";
import toast from 'react-hot-toast';
import { Plus, Minus } from 'lucide-react';

export default function ProductCardDisco({ producto, onAgregarPedido }) {
    const [cantidad, setCantidad] = useState(1);

    const aumentar = () => setCantidad(cantidad + 1);
    const disminuir = () => setCantidad(cantidad > 1 ? cantidad - 1 : 1);

    const agregarPedido = () => {
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
    }

    return (
        <div className="group relative bg-[#1A103C]/80 hover:bg-[#2B0D49] rounded-2xl p-5 transition-all duration-300 flex flex-col h-full hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(169,68,255,0.2)]">

            {/* Image Container */}
            <div className="relative aspect-square mb-5 overflow-hidden rounded-xl bg-white p-2 flex items-center justify-center">
                <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="w-full h-full object-contain drop-shadow-xl scale-110"
                />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col">
                <div className="mb-2">
                    <span className="text-[10px] font-bold text-[#A944FF] uppercase tracking-widest border border-[#A944FF]/30 bg-[#A944FF]/10 px-2 py-1 rounded-lg">
                        {producto.unidad}
                    </span>
                </div>

                <h3 className="font-bold text-lg text-white leading-tight mb-4 line-clamp-2 group-hover:text-[#FF4BC1] transition-colors">{producto.nombre}</h3>

                <div className="mt-auto pt-5 border-t border-[#6C3FA8]/30 flex items-center justify-between gap-3">
                    <p className="text-xl font-bold text-green-400 tracking-wide">
                        ${parseFloat(producto.precio).toLocaleString("es-CO")}
                    </p>

                    {/* Compact Controls */}
                    <div className="flex items-center bg-[#0E0D23] rounded-lg border border-[#6C3FA8]/50 p-1">
                        <button
                            onClick={disminuir}
                            className="w-8 h-8 flex items-center justify-center text-[#8A7BAF] hover:text-white hover:bg-[#441E73] rounded-md transition-colors"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-bold text-white text-sm">{cantidad}</span>
                        <button
                            onClick={aumentar}
                            className="w-8 h-8 flex items-center justify-center text-[#8A7BAF] hover:text-white hover:bg-[#441E73] rounded-md transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>

                <button
                    onClick={agregarPedido}
                    className="w-full mt-5 bg-[#441E73] hover:bg-gradient-to-r hover:from-[#A944FF] hover:to-[#FF4BC1] text-white font-bold py-3.5 rounded-xl transition-all duration-300 text-xs uppercase tracking-widest border border-[#6C3FA8] hover:border-transparent shadow-lg"
                >
                    Agregar al Pedido
                </button>
            </div>
        </div>
    );
}
