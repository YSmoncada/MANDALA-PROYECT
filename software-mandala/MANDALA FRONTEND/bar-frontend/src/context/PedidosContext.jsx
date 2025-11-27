import React, { createContext, useContext } from 'react';
import { useOrder } from '../hooks/useOrder';
import { usePedidosAuth } from '../hooks/usePedidosAuth';

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

    const value = {
        ...order,
        auth
    };

    return (
        <PedidosContext.Provider value={value}>
            {children}
        </PedidosContext.Provider>
    );
};
