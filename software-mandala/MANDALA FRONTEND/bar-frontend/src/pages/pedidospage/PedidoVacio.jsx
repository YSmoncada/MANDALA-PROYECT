import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from 'lucide-react';

const PedidoVacio = memo(() => {
    const navigate = useNavigate();
    return (
        <div className="text-center py-12 px-8 bg-[#1A103C]/80 dark:bg-zinc-900/30 rounded-[3rem] border border-white/10 dark:border-white/5 backdrop-blur-2xl max-w-md mx-auto shadow-2xl dark:shadow-none animate-scaleIn w-full">
            <div className="inline-block p-6 rounded-[2rem] bg-[#0E0D23] dark:bg-zinc-800/30 mb-6 border border-white/5 shadow-inner group">
                <ShoppingCart size={48} className="text-[#A944FF] dark:text-white opacity-80 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <p className="text-xl font-black mb-3 uppercase tracking-tighter text-white italic">Pedido vacío</p>
            <p className="text-[#8A7BAF] dark:text-zinc-500 mb-8 font-black uppercase tracking-[0.2em] text-[10px]">Agrega productos desde el menú para comenzar una nueva orden.</p>
            <button
                onClick={() => navigate('/pedidos-disco')}
                className="px-12 py-5 bg-gradient-to-r from-[#8A44FF] to-[#A944FF] dark:from-white dark:to-zinc-200 text-white dark:text-black hover:brightness-110 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] transition-all shadow-xl dark:shadow-none active:scale-95 flex items-center justify-center gap-4 mx-auto block border border-white/20 dark:border-transparent"
            >
                Explorar Menú
            </button>
        </div>
    );
});

export default PedidoVacio;