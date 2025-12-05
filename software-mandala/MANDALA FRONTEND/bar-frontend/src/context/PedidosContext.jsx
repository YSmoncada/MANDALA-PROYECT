import React, { createContext, useContext } from 'react';
import { useOrder } from '../hooks/useOrder';
import { usePedidosAuth } from '../hooks/usePedidosAuth';
import { usePedido } from '../hooks/usePedido';

const PedidosContext = createContext();

export const usePedidosContext = () => {
    const context = useContext(PedidosContext);
    if (!context) {
        throw new Error('usePedidosContext must be used within a PedidosProvider');
    }
    return context;
};

export const PedidosProvider = ({ children }) => {
    const order = useOrder();
    const auth = usePedidosAuth();
    const pedido = usePedido();

    const value = {
        ...order,
        ...pedido,
        auth
    };

    return (
        <PedidosContext.Provider value={value}>
            {children}
        </PedidosContext.Provider>
    );
};
