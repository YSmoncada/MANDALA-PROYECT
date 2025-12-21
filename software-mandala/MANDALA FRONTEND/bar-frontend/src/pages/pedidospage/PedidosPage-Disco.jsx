import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import HeaderPedidosDisco from "./HeaderPedidos-Disco";
import PedidoVacio from "./PedidoVacio"; // Importar componente
import OrderItem from "./OrderItem"; // Importar componente
import toast from 'react-hot-toast';
import { usePedidosContext } from "../../context/PedidosContext";
import { ShoppingCart, CreditCard, ArrowRight } from 'lucide-react';

export default function PedidosPageDisco() {
    const {
        auth,
        orderItems,
        clearOrder: onClearOrderContext,
        updateProductQuantity: onUpdateCantidad,
        removeProductFromOrder: onRemoveItem,
        mesas,
        selectedMesaId,
        setSelectedMesaId,
        isLoading,
        finalizarPedido,
        isTableLocked,
        setIsTableLocked,
        pedidosActivos // <-- Traemos los pedidos activos del contexto
    } = usePedidosContext();

    // Usamos useCallback para memoizar la función y evitar recrearla en cada render.
    const onClearOrder = useCallback(() => {
        onClearOrderContext();
        setIsTableLocked(false);
    }, [onClearOrderContext, setIsTableLocked]);

    const {
        mesera,
        meseraId,
        codigoConfirmado,
        selectedMeseraObject,
        isInitialized,
        handleLogout,
    } = auth;

    // Centralizar la lógica de roles para mayor claridad y reutilización.
    const esRolMesera = auth.role !== 'admin' && auth.role !== 'bartender';

    const navigate = useNavigate();
    // const { mesas, selectedMesaId, setSelectedMesaId, isLoading, finalizarPedido } = usePedido(); // Removed local hook

    // Usamos useMemo para que el total solo se recalcule si los `orderItems` cambian.
    const totalPedido = useMemo(() =>
        orderItems.reduce((total, item) => total + item.producto.precio * item.cantidad, 0),
        [orderItems]
    );

    useEffect(() => {
        if (!isInitialized) return;

        if (esRolMesera && (!mesera || !codigoConfirmado)) {
            navigate('/login-disco', { replace: true });
        }
    }, [isInitialized, mesera, codigoConfirmado, navigate, auth.role]);

    // Memoizamos la función principal para finalizar el pedido.
    const handleFinalizarPedido = useCallback(async () => {
        if (orderItems.length === 0) {
            toast.error("No hay productos en el pedido.");
            return;
        }

        // Solo se valida el meseraId si el rol es de mesera.
        if (esRolMesera && !meseraId) {
            toast.error("Error de autenticación de mesera. Inicie sesión nuevamente.");
        }

        if (!selectedMesaId) {
            toast.error("Por favor, seleccione una mesa.");
            return;
        }

        const productosParaBackend = orderItems.map(item => ({
            producto_id: item.producto.id,
            cantidad: item.cantidad,
        }));

        const pedidoData = {
            mesa: selectedMesaId,
            estado: "pendiente",
            productos: productosParaBackend,
            force_append: isTableLocked
        };

        // Si es mesera, enviamos mesera_id. Si es admin/bartender, enviamos usuario_id
        if (esRolMesera) {
            pedidoData.mesera = meseraId;
        } else {
            pedidoData.usuario = meseraId; // meseraId aquí contiene el user_id del sistema
        }

        const result = await finalizarPedido(pedidoData);

        if (result.success) {
            toast.success(result.message, {
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
            onClearOrder(); // This now calls local wrapper which unlocks table
            // Redirección basada en el rol del usuario autenticado
            if (auth.role === 'bartender') {
                navigate('/bartender'); // Redirigir al bartender a su vista principal
            } else {
                // Para admin y meseras, los redirigimos al menú de productos para continuar.
                navigate('/pedidos-disco');
            }

        } else {
            toast.error(result.message);
        }
    }, [orderItems, auth.role, meseraId, selectedMesaId, isTableLocked, finalizarPedido, selectedMeseraObject, onClearOrder, navigate]);

    // Renderizado condicional para evitar "flash" de contenido no autorizado.
    // No renderiza la página hasta que la inicialización esté completa Y el usuario esté autenticado.
    const esRolAutorizado = auth.role === 'bartender' || auth.role === 'admin';
    const esMeseraAutenticada = mesera && codigoConfirmado;
    const puedeRenderizar = isInitialized && (esRolAutorizado || esMeseraAutenticada);

    if (isLoading || !puedeRenderizar) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-purple-400 font-bold tracking-widest text-xs">CARGANDO...</p>
                </div>
            </div>
        );
    }

    return (
        // Unified Background: Matches Home-Disco and Inventario-Disco
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white selection:bg-purple-500/30 overflow-x-hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
            {/* Background Glows matching Home-Disco */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
            </div>

            <HeaderPedidosDisco mesera={mesera} onLogout={handleLogout} codigoConfirmado={codigoConfirmado} />

            <main className="flex-1 flex items-center justify-center p-3 pt-6 pb-20 sm:p-8 relative z-10">

                {orderItems.length === 0 ? (
                    <PedidoVacio />
                ) : (
                    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">

                        {/* Left Column: Order Items */}
                        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                            <div className="bg-[#441E73]/60 backdrop-blur-xl border border-[#6C3FA8] rounded-2xl p-3 sm:p-8 shadow-xl">
                                <h2 className="text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-8 flex flex-wrap items-center gap-2 sm:gap-4 tracking-tight">
                                    <div className="p-2 bg-[#A944FF]/10 rounded-lg">
                                        <ShoppingCart className="text-[#A944FF]" size={20} />
                                    </div>
                                    <span className="flex-shrink-0">DETALLE DEL PEDIDO</span>
                                    <span className="text-xs font-bold text-[#A944FF] ml-auto bg-[#A944FF]/10 px-3 py-1.5 rounded-full border border-[#A944FF]/20 uppercase tracking-wider">{orderItems.length} items</span>
                                </h2>

                                <div className="space-y-4 max-h-[35vh] sm:max-h-[60vh] lg:max-h-[600px] overflow-y-auto pr-2 custom-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
                                    {orderItems.map((item, index) => (
                                        <OrderItem
                                            key={item.producto.id || index}
                                            item={item}
                                            onUpdateCantidad={onUpdateCantidad}
                                            onRemoveItem={onRemoveItem}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Summary & Checkout */}
                        <div className="lg:col-span-1 mb-20 sm:mb-0">
                            <div className="bg-[#441E73]/80 backdrop-blur-xl border border-[#6C3FA8] rounded-2xl p-4 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.3)] lg:sticky top-28 relative overflow-hidden">
                                {/* Glow Effect */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A944FF] to-transparent"></div>

                                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-8 flex items-center gap-3 tracking-tight">
                                    <div className="p-2 bg-[#A944FF]/10 rounded-lg">
                                        <CreditCard className="text-[#A944FF]" size={18} />
                                    </div>
                                    RESUMEN
                                </h2>

                                {/* Mesa Selector */}
                                <div className="mb-4 sm:mb-8">
                                    <label htmlFor="mesa-select" className="block mb-2 text-xs font-bold text-[#C2B6D9] uppercase tracking-wider sm:tracking-widest">
                                        Seleccionar Mesa
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="mesa-select"
                                            value={selectedMesaId}
                                            onChange={(e) => setSelectedMesaId(e.target.value)}
                                            className={`w-full bg-[#2B0D49] border border-[#6C3FA8] text-white text-sm rounded-xl focus:ring-[#A944FF] focus:border-[#A944FF] block p-2.5 sm:p-3.5 transition-all appearance-none cursor-pointer hover:bg-[#2B0D49]/80 ${isTableLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={mesas.length === 0 || isTableLocked}
                                        >
                                            <option value="">-- Seleccionar Mesa --</option>
                                            {mesas.map((mesa) => (
                                                <option key={mesa.id} value={mesa.id}>
                                                    Mesa #{mesa.numero} (Cap: {mesa.capacidad})
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                            <svg className="w-4 h-4 text-[#8A7BAF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Totals */}
                                <div className="space-y-2 sm:space-y-3 py-4 sm:py-5 border-t border-[#6C3FA8]/30">
                                    <div className="flex justify-between text-sm sm:text-base text-[#C2B6D9]">
                                        <span>Subtotal</span>
                                        <span className="text-white font-bold">${totalPedido.toLocaleString("es-CO")}</span>
                                    </div>
                                    <div className="flex justify-between text-sm sm:text-base text-[#C2B6D9]">
                                        <span>Servicio</span>
                                        <span className="text-white font-bold">$0</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-3 sm:pt-5 border-t border-[#6C3FA8]/30">
                                        <span className="text-sm sm:text-lg font-bold text-white">Total a Pagar</span>
                                        <span className="text-xl sm:text-3xl font-black text-[#A944FF] drop-shadow-[0_0_10px_rgba(169,68,255,0.3)]">
                                            ${totalPedido.toLocaleString("es-CO")}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-3">
                                    <button
                                        onClick={handleFinalizarPedido}
                                        disabled={orderItems.length === 0}
                                        className="w-full py-3 sm:py-4 rounded-xl bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] hover:brightness-110 text-white font-bold uppercase tracking-wider sm:tracking-widest text-xs shadow-lg shadow-[#A944FF]/30 hover:shadow-[#A944FF]/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3"
                                    >
                                        Confirmar Pedido <ArrowRight size={16} />
                                    </button>
                                    <button
                                        onClick={onClearOrder}
                                        className="w-full py-2.5 sm:py-3 rounded-xl bg-white/5 text-[#C2B6D9] font-bold uppercase tracking-wider sm:tracking-widest text-xs hover:bg-white/10 hover:text-white transition-all border border-white/5"
                                    >
                                        Cancelar Todo
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
}
