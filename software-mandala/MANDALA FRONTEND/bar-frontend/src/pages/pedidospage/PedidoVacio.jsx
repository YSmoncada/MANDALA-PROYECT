import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from 'lucide-react';

const PedidoVacio = memo(() => {
    const navigate = useNavigate();
    return (
        <div className="bg-white dark:bg-zinc-900/30 backdrop-blur-xl border border-zinc-200 dark:border-white/5 rounded-[2.5rem] p-12 text-center shadow-sm dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-md w-full animate-fadeIn relative overflow-hidden group transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zinc-900 dark:via-white to-transparent opacity-10 dark:opacity-20"></div>
            
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-3xl bg-zinc-50 dark:bg-white/5 mb-8 border border-zinc-100 dark:border-white/10 shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                <ShoppingCart size={48} className="text-zinc-900 dark:text-white" />
            </div>
            
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-3 tracking-tighter uppercase">PEDIDO VACÍO</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-10 font-medium tracking-wide">
                Agrega productos desde el menú <br /> para comenzar una nueva orden.
            </p>
            
            <button
                onClick={() => navigate('/pedidos-disco')}
                className="w-full py-5 rounded-2xl bg-zinc-900 dark:bg-white hover:bg-black dark:hover:bg-zinc-100 text-white dark:text-black font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
            >
                Ir al Menú
            </button>
        </div>
    );
});

export default PedidoVacio;