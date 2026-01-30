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
        handleFinalizarPedido,
        currentFormattedId,
        role,
        setIsTableLocked
    } = usePedidosPage();

    const handleMesaChange = (e) => {
        const newMesaId = e.target.value;
        setSelectedMesaId(newMesaId);
        
        // Find selected mesa to check if it's occupied (Active Order)
        const selectedMesa = mesas.find(m => m.id.toString() === newMesaId);
        if (selectedMesa && selectedMesa.ocupada_por_id) {
            // If occupied, we are appending to the existing order
            setIsTableLocked(true);
        } else {
            // If free, we are creating a new order
            setIsTableLocked(false);
        }
    };

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
                    <div className="flex justify-center items-center py-20 px-4">
                        <PedidoVacio />
                    </div>
                ) : (
                    <div className={PAGE_STYLES.gridContainer}>
                        
                        {/* 1. Item Detail List */}
                        <div className={PAGE_STYLES.detailSection}>
                            <div className={PAGE_STYLES.card}>
                                <h2 className={PAGE_STYLES.sectionTitle}>
                                    <div className={PAGE_STYLES.badgeIcon}>
                                        <ShoppingCart className="text-zinc-900 dark:text-white" size={20} />
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
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zinc-900 dark:via-white to-transparent opacity-10 dark:opacity-20"></div>

                                <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white mb-4 sm:mb-8 flex items-center gap-3 tracking-tight uppercase">
                                    <div className={PAGE_STYLES.badgeIcon}>
                                        <CreditCard className="text-zinc-900 dark:text-white" size={18} />
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
                                            onChange={handleMesaChange}
                                            className={`${PAGE_STYLES.select} ${isTableLocked ? 'border-amber-500/50 text-amber-600 dark:text-amber-100 bg-amber-50 dark:bg-amber-500/10' : ''}`}
                                            disabled={mesas.length === 0}
                                        >
                                            <option value="">-- Seleccionar Mesa --</option>
                                            {mesas.map((mesa) => {
                                                const isOccupied = mesa.ocupada_por_id && mesa.ocupada_por_id !== currentFormattedId;
                                                const isAdminOverride = role === 'admin';
                                                const label = isOccupied 
                                                    ? `Mesa #${mesa.numero} (Ocupada - ${mesa.ocupada_por})` 
                                                    : `Mesa #${mesa.numero} (${mesa.capacidad} pers.)`;
                                                
                                                return (
                                                    <option 
                                                        key={mesa.id} 
                                                        value={mesa.id} 
                                                        disabled={isOccupied && !isAdminOverride}
                                                        className={isOccupied ? 'text-rose-500 bg-rose-50 dark:bg-zinc-800' : 'text-zinc-900 dark:text-white bg-white dark:bg-zinc-900'}
                                                    >
                                                        {label} {isOccupied && isAdminOverride ? '(Admin Override)' : ''}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                            <svg className="w-4 h-4 text-zinc-400 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Financial Summary */}
                                <div className="space-y-3 py-5 border-t border-zinc-100 dark:border-white/5">
                                    <div className="flex justify-between text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest">
                                        <span>Subtotal</span>
                                        <span className="text-zinc-900 dark:text-white font-black">${totalOrder.toLocaleString("es-CO")}</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-5 border-t border-zinc-100 dark:border-white/5">
                                        <span className="text-sm sm:text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tighter">Total</span>
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
                                        className="w-full px-4 py-4 bg-emerald-600 dark:bg-emerald-500/20 border border-emerald-600 dark:border-emerald-500/50 text-white dark:text-emerald-400 rounded-2xl hover:bg-emerald-700 dark:hover:bg-emerald-500 hover:text-white transition-all font-black uppercase text-xs tracking-[0.2em] shadow-xl active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        Confirmar Pedido <ArrowRight size={18} />
                                    </button>
                                    <button
                                        onClick={onClearOrder}
                                        className="w-full px-4 py-4 bg-zinc-100 dark:bg-rose-500/10 border border-zinc-200 dark:border-rose-500/30 text-zinc-500 dark:text-rose-400 rounded-2xl hover:bg-zinc-200 dark:hover:bg-rose-500 hover:text-zinc-900 dark:hover:text-white transition-all font-black uppercase text-xs tracking-[0.2em] active:scale-95"
                                    >
                                        Cancelar
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
