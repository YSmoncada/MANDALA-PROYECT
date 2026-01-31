import React, { useEffect, memo } from 'react';
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import HeaderPedidosDisco from "./HeaderPedidos-Disco";
import ProductGridDisco from "./ProductGrid-Disco";
import { usePedidosContext } from "../../context/PedidosContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import { UI_CLASSES } from "../../constants/ui";

/**
 * Page for selecting products and adding them to the order.
 * Optimized with memo to prevent unnecessary re-renders.
 */
function SeleccionProductosDisco() {
    const { auth, addProductToOrder } = usePedidosContext();
    const {
        userName,
        codigoConfirmado,
        isInitialized,
        handleLogout,
        role
    } = auth;

    const navigate = useNavigate();

    // Redirection logic
    useEffect(() => {
        if (!isInitialized) return;

        // If it's a staff profile (mesera role) and code is not confirmed, redirect to login
        const esRolStaff = role === 'mesera';

        if (esRolStaff && !codigoConfirmado) {
            navigate('/login', { replace: true });
        }
    }, [isInitialized, codigoConfirmado, role, navigate]);

    if (!isInitialized) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-transparent text-white dark:text-white selection:bg-[#A944FF]/30 transition-colors duration-500 overflow-x-hidden">
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#441E73]/10 dark:bg-zinc-900/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#A944FF]/5 dark:bg-white/5 rounded-full blur-[100px]"></div>
            </div>

            <HeaderPedidosDisco user={userName} onLogout={handleLogout} codigoConfirmado={codigoConfirmado} />

            <main className="flex-1 p-6 sm:p-10 relative z-10 max-w-7xl mx-auto w-full pt-28 sm:pt-36">
                {/* Navigation Action */}
                <div className="mb-10 sm:mb-16">
                    <button
                        onClick={() => navigate('/')}
                        className={UI_CLASSES.buttonBack}
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-black uppercase tracking-[0.2em] text-[10px]">Inicio</span>
                    </button>
                </div>

                <div className="text-center mb-12 sm:mb-16">
                    <h1 className="text-3xl sm:text-5xl font-black text-white dark:text-white mb-4 tracking-tighter uppercase italic drop-shadow-2xl">
                        Carta Mandala
                    </h1>
                    <p className="text-[10px] sm:text-[11px] text-[#A944FF] dark:text-zinc-500 font-black tracking-[0.4em] uppercase opacity-80">Selecciona los productos para tu pedido</p>
                </div>

                <ProductGridDisco
                    onProductAdd={addProductToOrder}
                />
            </main>
        </div>
    );
}

export default memo(SeleccionProductosDisco);
