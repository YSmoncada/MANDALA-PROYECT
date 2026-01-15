import React, { createContext, useContext, useMemo } from 'react';
import { useOrder } from '../hooks/useOrder';
import { usePedidosAuth } from '../hooks/usePedidosAuth';
import { usePedido } from '../hooks/usePedido';

const PedidosContext = createContext();

/**
 * Custom hook to consume the Pedidos context.
 * Provides order management, authentication, and mesa handling.
 */
export const usePedidosContext = () => {
    const context = useContext(PedidosContext);
    if (!context) {
        throw new Error('usePedidosContext must be used within a PedidosProvider');
    }
    return context;
};

/**
 * Provider component that wraps the application and provides global state for orders.
 */
export const PedidosProvider = ({ children }) => {
    const order = useOrder();
    const auth = usePedidosAuth();
    const pedido = usePedido();

    // Memoize the value to prevent unnecessary re-renders of the entire tree
    // if only one part of the context changes (though hooks are already memoized).
    const value = useMemo(() => ({
        ...order,
        ...pedido,
        auth
    }), [order, pedido, auth]);

    return (
        <PedidosContext.Provider value={value}>
            {children}
        </PedidosContext.Provider>
    );
};
