import React, { memo } from "react";
import HeaderPedidosDisco from "./HeaderPedidos-Disco";
import PedidoVacio from "./PedidoVacio";
import OrderItem from "./OrderItem";
import LoadingSpinner from "../../components/LoadingSpinner";
import { usePedidosPage } from "../../hooks/usePedidosPage";
import { ShoppingCart, CreditCard, ArrowRight } from 'lucide-react';
import { PAGE_STYLES } from "./styles/PedidosPage.styles";

/**
 * Main Order Summary Page.
 * Logic: hook/usePedidosPage.js
 * Styles: styles/PedidosPage.styles.js
 */
function PedidosPageDisco() {
    const {
        orderItems,
        totalOrder,
        mesas,
        selectedMesaId,
        isTableLocked,
        isLoadingMesas,
        puedeRenderizar,
        userName,
        codigoConfirmado,
        setSelectedMesaId,
        onUpdateCantidad,
        onRemoveItem,
        handleLogout,
        onClearOrder,
        handleFinalizarPedido
    } = usePedidosPage();

    if (isLoadingMesas || !puedeRenderizar) {
        return <LoadingSpinner />;
    }

    return (
        <div className={PAGE_STYLES.layout}>
            {/* Background Aesthetics */}
            <div className={PAGE_STYLES.glowOverlay}>
                <div className={PAGE_STYLES.glow1}></div>
                <div className={PAGE_STYLES.glow2}></div>
            </div>

            <HeaderPedidosDisco 
                user={userName} 
                onLogout={handleLogout} 
                codigoConfirmado={codigoConfirmado} 
            />

            <main className={PAGE_STYLES.main}>
                {orderItems.length === 0 ? (
                    <PedidoVacio />
                ) : (
                    <div className={PAGE_STYLES.gridContainer}>
                        
                        {/* 1. Item Detail List */}
                        <div className={PAGE_STYLES.detailSection}>
                            <div className={PAGE_STYLES.card}>
                                <h2 className={PAGE_STYLES.sectionTitle}>
                                    <div className={PAGE_STYLES.badgeIcon}>
                                        <ShoppingCart className="text-[#A944FF]" size={20} />
                                    </div>
                                    <span className="uppercase">Detalle del Pedido</span>
                                    <span className={PAGE_STYLES.badgeText}>
                                        {orderItems.length} items
                                    </span>
                                </h2>

                                <div className={PAGE_STYLES.scrollContainer}>
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

                        {/* 2. Checkout Summary Sidebar */}
                        <div className={PAGE_STYLES.checkoutSection}>
                            <div className={PAGE_STYLES.summaryCard}>
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A944FF] to-transparent"></div>

                                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-8 flex items-center gap-3 tracking-tight uppercase">
                                    <div className={PAGE_STYLES.badgeIcon}>
                                        <CreditCard className="text-[#A944FF]" size={18} />
                                    </div>
                                    Resumen
                                </h2>

                                {/* Mesa Selection */}
                                <div className="mb-4 sm:mb-8">
                                    <label htmlFor="mesa-select" className={PAGE_STYLES.inputLabel}>
                                        Seleccionar Mesa
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="mesa-select"
                                            value={selectedMesaId}
                                            onChange={(e) => setSelectedMesaId(e.target.value)}
                                            className={`${PAGE_STYLES.select} ${isTableLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={mesas.length === 0 || isTableLocked}
                                        >
                                            <option value="">-- Seleccionar Mesa --</option>
                                            {mesas.map((mesa) => (
                                                <option key={mesa.id} value={mesa.id}>
                                                    Mesa #{mesa.numero} ({mesa.capacidad} pers.)
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

                                {/* Financial Summary */}
                                <div className="space-y-3 py-5 border-t border-[#6C3FA8]/30">
                                    <div className="flex justify-between text-sm sm:text-base text-[#C2B6D9]">
                                        <span>Subtotal</span>
                                        <span className="text-white font-bold">${totalOrder.toLocaleString("es-CO")}</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-5 border-t border-[#6C3FA8]/30">
                                        <span className="text-sm sm:text-lg font-bold text-white uppercase">Total</span>
                                        <span className={PAGE_STYLES.totalAmount}>
                                            ${totalOrder.toLocaleString("es-CO")}
                                        </span>
                                    </div>
                                </div>

                                {/* Main Actions */}
                                <div className="mt-6 sm:mt-8 space-y-3">
                                    <button
                                        onClick={handleFinalizarPedido}
                                        disabled={orderItems.length === 0}
                                        className={PAGE_STYLES.confirmBtn}
                                    >
                                        Confirmar Pedido <ArrowRight size={16} />
                                    </button>
                                    <button
                                        onClick={onClearOrder}
                                        className={PAGE_STYLES.cancelBtn}
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
