import React, { memo } from "react";
import HeaderPedidosDisco from "./HeaderPedidos-Disco";
import PedidoVacio from "./PedidoVacio";
import OrderItem from "./OrderItem";
import LoadingSpinner from "../../components/LoadingSpinner";
import { usePedidosPage } from "../../hooks/usePedidosPage";
import { ShoppingCart, CreditCard, ArrowRight } from "lucide-react";
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
    setIsTableLocked,
  } = usePedidosPage();

  const handleMesaChange = (e) => {
    const newMesaId = e.target.value;
    setSelectedMesaId(newMesaId);

    // Find selected mesa to check if it's occupied (Active Order)
    const selectedMesa = mesas.find((m) => m.id.toString() === newMesaId);
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
                    <ShoppingCart
                      size={22}
                      className="text-[#A944FF] dark:text-white"
                    />
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
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#A944FF] to-transparent opacity-50 dark:opacity-30"></div>

                <h2 className="text-2xl sm:text-3xl font-black text-white dark:text-white mb-8 sm:mb-12 flex items-center gap-5 tracking-tighter uppercase italic">
                  <div className={PAGE_STYLES.badgeIcon}>
                    <CreditCard
                      className="text-[#A944FF] dark:text-white"
                      size={20}
                    />
                  </div>
                  Resumen
                </h2>

                {/* Mesa Selection */}
                <div className="mb-8 sm:mb-12">
                  <label
                    htmlFor="mesa-select"
                    className={PAGE_STYLES.inputLabel}
                  >
                    Ubicación Pedido
                  </label>
                  <div className="relative">
                    <select
                      id="mesa-select"
                      value={selectedMesaId}
                      onChange={handleMesaChange}
                      className={`${PAGE_STYLES.select} ${isTableLocked ? "border-amber-500/50 text-amber-400 bg-amber-500/5" : ""}`}
                    >
                      <option value="" className="bg-[#0E0D23] dark:bg-black">
                        -- Seleccionar Mesa --
                      </option>
                      {mesas.map((mesa) => {
                        const isOccupied =
                          mesa.ocupada_por_id &&
                          mesa.ocupada_por_id !== currentFormattedId;
                        const isAdminOverride = role === "admin";
                        const label = isOccupied
                          ? `Mesa #${mesa.numero} (Ocupada - ${mesa.ocupada_por})`
                          : `Mesa #${mesa.numero} (${mesa.capacidad} pers.)`;

                        return (
                          <option
                            key={mesa.id}
                            value={mesa.id}
                            disabled={isOccupied && !isAdminOverride}
                            className={
                              isOccupied
                                ? "text-rose-500 bg-[#0E0D23] dark:bg-zinc-800"
                                : "text-white dark:text-white bg-[#0E0D23] dark:bg-zinc-900"
                            }
                          >
                            {label}{" "}
                            {isOccupied && isAdminOverride
                              ? "(Admin Override)"
                              : ""}
                          </option>
                        );
                      })}
                    </select>
                    <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-[#8A7BAF] dark:text-zinc-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="space-y-4 py-8 border-t border-white/5">
                  <div className="flex justify-between text-[11px] text-[#8A7BAF] dark:text-zinc-500 font-black uppercase tracking-[0.3em]">
                    <span>Subtotal</span>
                    <span className="text-white dark:text-white font-black italic tracking-widest">
                      ${totalOrder.toLocaleString("es-CO")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-8 border-t border-white/5">
                    <span className="text-xs sm:text-base font-black text-[#8A7BAF] dark:text-zinc-500 uppercase tracking-[0.4em]">
                      Total
                    </span>
                    <span className="text-3xl sm:text-4xl font-black text-emerald-400 dark:text-white tracking-tighter italic drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                      ${totalOrder.toLocaleString("es-CO")}
                    </span>
                  </div>
                </div>

                {/* Main Actions */}
                <div className="mt-8 sm:mt-12 space-y-4">
                  <button
                    onClick={handleFinalizarPedido}
                    disabled={orderItems.length === 0}
                    className={PAGE_STYLES.confirmBtn}
                  >
                    Confirmar Orden <ArrowRight size={20} />
                  </button>
                  <button
                    onClick={onClearOrder}
                    className={PAGE_STYLES.cancelBtn}
                  >
                    Vaciar Pedido
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
