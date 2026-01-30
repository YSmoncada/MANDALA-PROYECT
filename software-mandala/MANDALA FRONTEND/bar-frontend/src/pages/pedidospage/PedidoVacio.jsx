import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from 'lucide-react';

const PedidoVacio = memo(() => {
    const navigate = useNavigate();
    return (
        <div className="bg-[#1A103C]/95 dark:bg-zinc-900 backdrop-blur-3xl border border-white/20 dark:border-white/5 rounded-[3rem] p-16 text-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] dark:shadow-none max-w-md w-full animate-scaleIn relative overflow-hidden group transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#A944FF] to-transparent opacity-50"></div>
            
            <div className="inline-flex items-center justify-center w-40 h-40 rounded-[2.5rem] bg-[#0E0D23] dark:bg-zinc-800 mb-10 border border-white/10 dark:border-white/5 shadow-2xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700 relative">
                <div className="absolute inset-0 bg-[#A944FF]/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <ShoppingCart size={56} className="text-[#A944FF] dark:text-white relative z-10" />
            </div>
            
            <h2 className="text-4xl font-black text-white dark:text-white mb-4 tracking-tighter uppercase italic">PEDIDO VACÍO</h2>
            <p className="text-[#8A7BAF] dark:text-zinc-500 mb-12 font-black uppercase tracking-[0.2em] text-[10px] leading-relaxed">
                Agrega productos desde el menú <br /> para comenzar una nueva orden.
            </p>
            
            <button
                onClick={() => navigate('/pedidos-disco')}
                className="w-full py-6 rounded-2xl bg-gradient-to-r from-[#8A44FF] to-[#A944FF] dark:from-white dark:to-zinc-200 text-white dark:text-black font-black uppercase tracking-[0.3em] text-[11px] transition-all shadow-[0_20px_40px_-10px_rgba(169,68,255,0.4)] dark:shadow-none active:scale-95 flex items-center justify-center gap-4 hover:brightness-110"
            >
                Explorar Menú
            </button>
        </div>
    );
});

export default PedidoVacio;