import React, { useEffect, memo } from 'react';
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import HeaderPedidosDisco from "./HeaderPedidos-Disco";
import ProductGridDisco from "./ProductGrid-Disco";
import { usePedidosContext } from "../../context/PedidosContext";
import LoadingSpinner from "../../components/LoadingSpinner";

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
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white selection:bg-purple-500/30">
            {/* Background Glows */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
            </div>

            <HeaderPedidosDisco user={userName} onLogout={handleLogout} codigoConfirmado={codigoConfirmado} />

            <main className="flex-1 p-4 sm:p-8 relative z-10 max-w-7xl mx-auto w-full pt-12">
                {/* Navigation Action */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 rounded-lg bg-[#441E73]/50 border border-[#6C3FA8] px-4 py-2 text-white hover:bg-[#441E73] hover:border-[#A944FF] transition-all backdrop-blur-md shadow-lg transform-gpu active:scale-95"
                    >
                        <ArrowLeft size={18} />
                        <span className="font-medium">Volver</span>
                    </button>
                </div>

                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight drop-shadow-[0_0_25px_rgba(169,68,255,0.4)] uppercase">
                        Menú Principal
                    </h1>
                    <p className="text-lg text-[#C2B6D9] font-light italic">Selecciona los productos para tu pedido</p>
                </div>

                <ProductGridDisco
                    onProductAdd={addProductToOrder}
                />
            </main>
        </div>
    );
}

export default memo(SeleccionProductosDisco);
