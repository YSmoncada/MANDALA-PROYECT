import React, { memo } from "react";
import { Plus, Minus } from 'lucide-react';
import { useProductCard } from "../../hooks/useProductCard";
import { CARD_STYLES } from "./styles/ProductCard.styles";

/**
 * Individual product card for the menu.
 * Logic is separated into useProductCard hook.
 * Styles are imported from ProductCard.styles.js.
 */
function ProductCardDisco({ producto, onAgregarPedido }) {
    const { cantidad, aumentar, disminuir, handleAgregar } = useProductCard(producto, onAgregarPedido);

    return (
        <div className={CARD_STYLES.container}>
            {/* Image Section */}
            <div className={CARD_STYLES.imageWrapper}>
                <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className={CARD_STYLES.image}
                    loading="lazy"
                />
            </div>

            {/* Product Info Section */}
            <div className="flex-1 flex flex-col">
                <div className={CARD_STYLES.badgeWrapper}>
                    <span className={CARD_STYLES.badge}>
                        {producto.unidad}
                    </span>
                </div>

                <h3 className={CARD_STYLES.title}>
                    {producto.nombre}
                </h3>

                <div className={CARD_STYLES.footer}>
                    <div className="flex flex-col gap-2">
                        {/* Price Display */}
                        <div className={CARD_STYLES.infoRow}>
                            <span className={CARD_STYLES.label}>Precio</span>
                            <p className={CARD_STYLES.price}>
                                ${parseFloat(producto.precio).toLocaleString("es-CO")}
                            </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className={CARD_STYLES.infoRow}>
                            <span className={CARD_STYLES.label}>Cantidad</span>
                            <div className={CARD_STYLES.counter}>
                                <button
                                    onClick={disminuir}
                                    className={CARD_STYLES.counterBtn}
                                    aria-label="Disminuir cantidad"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className={CARD_STYLES.counterValue}>{cantidad}</span>
                                <button
                                    onClick={aumentar}
                                    className={CARD_STYLES.counterBtn}
                                    aria-label="Aumentar cantidad"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleAgregar}
                        className={CARD_STYLES.mainBtn}
                    >
                        Agregar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default memo(ProductCardDisco);
