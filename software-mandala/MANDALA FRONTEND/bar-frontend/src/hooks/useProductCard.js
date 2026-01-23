import { useState, useCallback } from "react";
import toast from 'react-hot-toast';

/**
 * Custom hook to handle the logic of a single Product Card.
 * Separates quantity management and adding to order from the UI.
 * 
 * @param {Object} producto - The product data.
 * @param {Function} onAgregarPedido - Callback to add product to the global order.
 */
export const useProductCard = (producto, onAgregarPedido) => {
    const [cantidad, setCantidad] = useState(1);

    const aumentar = useCallback(() => {
        setCantidad(prev => prev + 1);
    }, []);

    const disminuir = useCallback(() => {
        setCantidad(prev => (prev > 1 ? prev - 1 : 1));
    }, []);

    const resetCantidad = useCallback(() => {
        setCantidad(1);
    }, []);

    const handleAgregar = useCallback(() => {
        if (!producto || !onAgregarPedido) return;

        onAgregarPedido(producto, cantidad);
        
        const nombreProducto = cantidad > 1 ? `${producto.nombre}s` : producto.nombre;
        toast.success(`Agregado: ${cantidad} ${nombreProducto}`, {
            position: 'bottom-right',
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
        
        resetCantidad();
    }, [cantidad, producto, onAgregarPedido, resetCantidad]);

    return {
        cantidad,
        aumentar,
        disminuir,
        handleAgregar
    };
};
