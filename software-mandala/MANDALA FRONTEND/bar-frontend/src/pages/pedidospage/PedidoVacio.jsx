import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from 'lucide-react';

const PedidoVacio = memo(() => {
    const navigate = useNavigate();
    return (
        <div className="bg-[#441E73]/80 backdrop-blur-xl border border-[#6C3FA8] rounded-2xl p-12 text-center shadow-[0_0_40px_rgba(0,0,0,0.3)] max-w-md w-full animate-fadeIn relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A944FF] to-transparent"></div>
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#A944FF]/10 mb-8 border border-[#A944FF]/20 shadow-lg shadow-[#A944FF]/10">
                <ShoppingCart size={40} className="text-[#A944FF]" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">PEDIDO VACÍO</h2>
            <p className="text-[#C2B6D9] mb-10 font-light">
                Agrega productos desde el menú para comenzar.
            </p>
            <button
                onClick={() => navigate('/pedidos-disco')}
                className="px-10 py-4 rounded-xl bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] hover:brightness-110 text-white font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-[#A944FF]/30 transform hover:scale-105"
            >
                Ir al Menú
            </button>
        </div>
    );
});

export default PedidoVacio;