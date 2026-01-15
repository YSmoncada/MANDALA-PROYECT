import { useEffect, useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import HeaderPedidosDisco from "./HeaderPedidos-Disco";
import PedidoVacio from "./PedidoVacio";
import OrderItem from "./OrderItem";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from 'react-hot-toast';
import { usePedidosContext } from "../../context/PedidosContext";
import { ShoppingCart, CreditCard, ArrowRight } from 'lucide-react';

/**
 * Main Order Summary Page.
 * Optimized for performance and scalability.
 */
function PedidosPageDisco() {
    const {
        auth,
        orderItems,
        totalOrder,
        clearOrder: onClearOrderContext,
        updateProductQuantity: onUpdateCantidad,
        removeProductFromOrder: onRemoveItem,
        mesas,
        selectedMesaId,
        setSelectedMesaId,
        isLoadingMesas,
        finalizarPedido,
        isTableLocked,
        setIsTableLocked
    } = usePedidosContext();

    const navigate = useNavigate();

    const {
        mesera,
        meseraId,
        codigoConfirmado,
        isInitialized,
        handleLogout,
        role
    } = auth;

    const esRolMesera = role !== 'admin' && role !== 'bartender' && role !== 'prueba';

    // Memoized actions
    const onClearOrder = useCallback(() => {
        onClearOrderContext();
        setIsTableLocked(false);
    }, [onClearOrderContext, setIsTableLocked]);

    const handleFinalizarPedido = useCallback(async () => {
        if (orderItems.length === 0) {
            toast.error("No hay productos en el pedido.");
            return;
        }

        if (esRolMesera && !meseraId) {
            toast.error("Error de autenticación. Inicie sesión nuevamente.");
            return;
        }

        if (!selectedMesaId) {
            toast.error("Por favor, seleccione una mesa.");
            return;
        }

        const pedidoData = {
            mesa: selectedMesaId,
            estado: "pendiente",
            productos: orderItems.map(item => ({
                producto_id: item.producto.id,
                cantidad: item.cantidad,
            })),
            force_append: isTableLocked
        };

        if (esRolMesera) {
            pedidoData.mesera = meseraId;
        } else {
            pedidoData.usuario = meseraId;
        }

        const result = await finalizarPedido(pedidoData);

        if (result.success) {
            toast.success(result.message, {
                style: { background: '#0E0D23', color: '#fff', border: '1px solid #A944FF' },
                iconTheme: { primary: '#A944FF', secondary: '#fff' },
            });
            onClearOrder();
            
            if (role === 'bartender') {
                navigate('/bartender');
            } else {
                navigate('/pedidos-disco');
            }
        } else {
            toast.error(result.message);
        }
    }, [orderItems, role, meseraId, selectedMesaId, isTableLocked, finalizarPedido, esRolMesera, onClearOrder, navigate]);

    // Auth redirection
    useEffect(() => {
        if (!isInitialized) return;
        if (esRolMesera && (!mesera || !codigoConfirmado)) {
            navigate('/login-disco', { replace: true });
        }
    }, [isInitialized, mesera, codigoConfirmado, navigate, role, esRolMesera]);

    const esRolAutorizado = ['bartender', 'admin', 'prueba'].includes(role);
    const esMeseraAutenticada = mesera && codigoConfirmado;
    const puedeRenderizar = isInitialized && (esRolAutorizado || esMeseraAutenticada);

    if (isLoadingMesas || !puedeRenderizar) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white selection:bg-purple-500/30 overflow-x-hidden">
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
                        {/* Order Items Detail */}
                        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                            <div className="bg-[#441E73]/60 backdrop-blur-xl border border-[#6C3FA8] rounded-2xl p-3 sm:p-8 shadow-xl">
                                <h2 className="text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-8 flex flex-wrap items-center gap-2 sm:gap-4 tracking-tight">
                                    <div className="p-2 bg-[#A944FF]/10 rounded-lg">
                                        <ShoppingCart className="text-[#A944FF]" size={20} />
                                    </div>
                                    <span className="flex-shrink-0 uppercase">Detalle del Pedido</span>
                                    <span className="text-xs font-bold text-[#A944FF] ml-auto bg-[#A944FF]/10 px-3 py-1.5 rounded-full border border-[#A944FF]/20 uppercase tracking-wider">
                                        {orderItems.length} items
                                    </span>
                                </h2>

                                <div className="space-y-4 max-h-[40vh] sm:max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {orderItems.map((item) => (
                                        <OrderItem
                                            key={item.producto.id}
                                            item={item}
                                            onUpdateCantidad={onUpdateCantidad}
                                            onRemoveItem={onRemoveItem}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Checkout Summary */}
                        <div className="lg:col-span-1 mb-20 sm:mb-0">
                            <div className="bg-[#441E73]/80 backdrop-blur-xl border border-[#6C3FA8] rounded-2xl p-4 sm:p-8 shadow-2xl lg:sticky top-28 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A944FF] to-transparent"></div>

                                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-8 flex items-center gap-3 tracking-tight uppercase">
                                    <div className="p-2 bg-[#A944FF]/10 rounded-lg">
                                        <CreditCard className="text-[#A944FF]" size={18} />
                                    </div>
                                    Resumen
                                </h2>

                                <div className="mb-4 sm:mb-8">
                                    <label htmlFor="mesa-select" className="block mb-2 text-xs font-bold text-[#C2B6D9] uppercase tracking-widest">
                                        Seleccionar Mesa
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="mesa-select"
                                            value={selectedMesaId}
                                            onChange={(e) => setSelectedMesaId(e.target.value)}
                                            className={`w-full bg-[#2B0D49] border border-[#6C3FA8] text-white text-sm rounded-xl focus:ring-[#A944FF] focus:border-[#A944FF] block p-3 transition-all appearance-none cursor-pointer ${isTableLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={mesas.length === 0 || isTableLocked}
                                        >
                                            <option value="">-- Seleccionar Mesa --</option>
                                            {mesas.map((mesa) => (
                                                <option key={mesa.id} value={mesa.id}>
                                                    Mesa #{mesa.numero} ({mesa.capacidad} personas)
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                            <svg className="w-4 h-4 text-[#8A7BAF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 py-5 border-t border-[#6C3FA8]/30">
                                    <div className="flex justify-between text-sm sm:text-base text-[#C2B6D9]">
                                        <span>Subtotal</span>
                                        <span className="text-white font-bold">${totalOrder.toLocaleString("es-CO")}</span>
                                    </div>
                                    <div className="flex justify-between text-sm sm:text-base text-[#C2B6D9]">
                                        <span>Servicio</span>
                                        <span className="text-white font-bold">$0</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-5 border-t border-[#6C3FA8]/30">
                                        <span className="text-sm sm:text-lg font-bold text-white uppercase">Total</span>
                                        <span className="text-2xl sm:text-3xl font-black text-[#A944FF] drop-shadow-[0_0_10px_rgba(169,68,255,0.3)]">
                                            ${totalOrder.toLocaleString("es-CO")}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 sm:mt-8 space-y-3">
                                    <button
                                        onClick={handleFinalizarPedido}
                                        disabled={orderItems.length === 0}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] hover:brightness-110 text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-[#A944FF]/30 hover:shadow-[#A944FF]/50 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        Confirmar Pedido <ArrowRight size={16} />
                                    </button>
                                    <button
                                        onClick={onClearOrder}
                                        className="w-full py-3 rounded-xl bg-white/5 text-[#C2B6D9] font-bold uppercase tracking-widest text-xs hover:bg-white/10 hover:text-white transition-all border border-white/5"
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

export default memo(PedidosPageDisco);
