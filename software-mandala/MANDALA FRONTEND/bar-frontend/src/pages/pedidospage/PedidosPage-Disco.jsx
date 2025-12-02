import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderPedidosDisco from "./HeaderPedidos-Disco";
import { usePedido } from "../../hooks/usePedido";
import toast from 'react-hot-toast';
import { usePedidosContext } from "../../context/PedidosContext";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, ArrowRight } from 'lucide-react';

export default function PedidosPageDisco() {
    const {
        auth,
        orderItems,
        clearOrder: onClearOrder,
        updateProductQuantity: onUpdateCantidad,
        removeProductFromOrder: onRemoveItem,
    } = usePedidosContext();

    const {
        mesera,
        meseraId,
        codigoConfirmado,
        isInitialized,
        handleLogout,
    } = auth;

    const navigate = useNavigate();
    const { mesas, selectedMesaId, setSelectedMesaId, isLoading, finalizarPedido } = usePedido();

    const totalPedido = orderItems.reduce(
        (total, item) => total + item.producto.precio * item.cantidad,
        0
    );

    useEffect(() => {
        if (!isInitialized) return;

        if (!mesera || !codigoConfirmado) {
            navigate('/login-disco', { replace: true });
        }
    }, [isInitialized, mesera, codigoConfirmado, navigate]);

    const handleFinalizarPedido = async () => {
        if (orderItems.length === 0) {
            toast.error("No hay productos en el pedido.");
            return;
        }

        if (!meseraId) {
            toast.error("Error de autenticación. Inicie sesión nuevamente.");
            return;
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
            mesera: meseraId,
            mesa: selectedMesaId,
            estado: "pendiente",
            productos: productosParaBackend,
        };

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
            onClearOrder();
            navigate('/login-disco');
        } else {
            toast.error(result.message);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-purple-400 font-bold tracking-widest text-xs">PROCESANDO</p>
                </div>
            </div>
        );
    }

    if (!mesera || !codigoConfirmado) {
        return null;
    }

    return (
        // Unified Background: Matches Home-Disco and Inventario-Disco
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white selection:bg-purple-500/30">
            {/* Background Glows matching Home-Disco */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
            </div>

            <HeaderPedidosDisco mesera={mesera} onLogout={handleLogout} codigoConfirmado={codigoConfirmado} />

            <div className="flex flex-col items-center justify-center flex-1 p-4 sm:p-8 relative z-10">

                {orderItems.length === 0 ? (
                    <div className="bg-[#441E73]/80 backdrop-blur-xl border border-[#6C3FA8] rounded-2xl p-12 text-center shadow-[0_0_40px_rgba(0,0,0,0.3)] max-w-md w-full animate-fadeIn relative overflow-hidden">
                        {/* Glow Effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A944FF] to-transparent"></div>

                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#A944FF]/10 mb-8 border border-[#A944FF]/20 shadow-lg shadow-[#A944FF]/10">
                            <ShoppingCart size={40} className="text-[#A944FF]" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">PEDIDO VACÍO</h2>
                        <p className="text-[#C2B6D9] mb-10 font-light">
                            Agrega productos desde el menú para comenzar.
                        </p>
                        <button
                            onClick={() => navigate('/login-disco')}
                            className="px-10 py-4 rounded-xl bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] hover:brightness-110 text-white font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-[#A944FF]/30 transform hover:scale-105"
                        >
                            Ir al Menú
                        </button>
                    </div>
                ) : (
                    <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left Column: Order Items */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-[#441E73]/60 backdrop-blur-xl border border-[#6C3FA8] rounded-2xl p-4 sm:p-8 shadow-xl">
                                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-4 tracking-tight">
                                    <div className="p-2 bg-[#A944FF]/10 rounded-lg">
                                        <ShoppingCart className="text-[#A944FF]" size={24} />
                                    </div>
                                    DETALLE DEL PEDIDO
                                    <span className="text-xs font-bold text-[#A944FF] ml-auto bg-[#A944FF]/10 px-4 py-2 rounded-full border border-[#A944FF]/20 uppercase tracking-wider">{orderItems.length} items</span>
                                </h2>

                                <div className="space-y-4 max-h-[60vh] lg:max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    {orderItems.map((item, index) => (
                                        <div
                                            key={item.producto.id || index}
                                            className="group flex flex-col sm:flex-row items-center gap-4 bg-[#2B0D49]/80 hover:bg-[#2B0D49] p-4 rounded-2xl border border-[#6C3FA8]/50 hover:border-[#A944FF] transition-all duration-300 shadow-md"
                                        >
                                            {/* Product Image */}
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#0E0D23] rounded-xl p-2 flex-shrink-0 border border-[#6C3FA8]/30">
                                                <img
                                                    src={item.producto.imagen}
                                                    alt={item.producto.nombre}
                                                    className="w-full h-full object-contain drop-shadow-lg"
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 text-center sm:text-left">
                                                <h3 className="font-bold text-white text-xl mb-1">{item.producto.nombre}</h3>
                                                <p className="text-[#A944FF] font-bold tracking-wide">
                                                    ${parseFloat(item.producto.precio).toLocaleString("es-CO")}
                                                </p>
                                            </div>

                                            {/* Controls */}
                                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                                                <div className="flex items-center justify-between w-full sm:w-auto">
                                                    <div className="flex items-center bg-[#0E0D23] rounded-lg p-1 border border-[#6C3FA8]/50">
                                                        <button
                                                            onClick={() => {
                                                                if (item.cantidad > 1) {
                                                                    onUpdateCantidad(item.producto.id, item.cantidad - 1);
                                                                } else {
                                                                    onRemoveItem(item.producto.id);
                                                                }
                                                            }}
                                                            className="w-7 h-7 flex items-center justify-center text-[#8A7BAF] hover:text-white hover:bg-[#441E73] rounded-md transition-colors"
                                                        >
                                                            <Minus size={16} />
                                                        </button>
                                                        <span className="w-10 text-center font-bold text-white">{item.cantidad}</span>
                                                        <button
                                                            onClick={() => onUpdateCantidad(item.producto.id, item.cantidad + 1)}
                                                            className="w-7 h-7 flex items-center justify-center text-[#8A7BAF] hover:text-white hover:bg-[#441E73] rounded-md transition-colors"
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => onRemoveItem(item.producto.id)}
                                                        className="p-3 text-[#8A7BAF] hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors sm:hidden"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>

                                                <p className="font-black text-lg sm:text-xl text-white text-center sm:text-right w-full sm:w-auto sm:min-w-[100px]">
                                                    ${(parseFloat(item.producto.precio) * item.cantidad).toLocaleString("es-CO")}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Summary & Checkout */}
                        <div className="lg:col-span-1">
                            <div className="bg-[#441E73]/80 backdrop-blur-xl border border-[#6C3FA8] rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.3)] lg:sticky top-28 relative overflow-hidden">
                                {/* Glow Effect */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A944FF] to-transparent"></div>

                                <h2 className="text-xl font-bold text-white mb-6 sm:mb-8 flex items-center gap-3 tracking-tight">
                                    <div className="p-2 bg-[#A944FF]/10 rounded-lg">
                                        <CreditCard className="text-[#A944FF]" size={20} />
                                    </div>
                                    RESUMEN
                                </h2>

                                {/* Mesa Selector */}
                                <div className="mb-6 sm:mb-8">
                                    <label htmlFor="mesa-select" className="block mb-2 text-xs font-bold text-[#C2B6D9] uppercase tracking-widest">
                                        Seleccionar Mesa
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="mesa-select"
                                            value={selectedMesaId}
                                            onChange={(e) => setSelectedMesaId(e.target.value)}
                                            className="w-full bg-[#2B0D49] border border-[#6C3FA8] text-white text-sm rounded-xl focus:ring-[#A944FF] focus:border-[#A944FF] block p-3.5 transition-all appearance-none cursor-pointer hover:bg-[#2B0D49]/80"
                                            disabled={mesas.length === 0}
                                        >
                                            <option value="">-- Seleccionar --</option>
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
                                <div className="space-y-3 py-5 border-t border-[#6C3FA8]/30">
                                    <div className="flex justify-between text-[#C2B6D9]">
                                        <span>Subtotal</span>
                                        <span className="text-white font-bold">${totalPedido.toLocaleString("es-CO")}</span>
                                    </div>
                                    <div className="flex justify-between text-[#C2B6D9]">
                                        <span>Servicio</span>
                                        <span className="text-white font-bold">$0</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-5 border-t border-[#6C3FA8]/30">
                                        <span className="text-base sm:text-lg font-bold text-white">Total a Pagar</span>
                                        <span className="text-2xl sm:text-3xl font-black text-[#A944FF] drop-shadow-[0_0_10px_rgba(169,68,255,0.3)]">
                                            ${totalPedido.toLocaleString("es-CO")}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-8 space-y-3">
                                    <button
                                        onClick={handleFinalizarPedido}
                                        disabled={orderItems.length === 0}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] hover:brightness-110 text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-[#A944FF]/30 hover:shadow-[#A944FF]/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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
            </div>
        </div>
    );
}
