import React, { createContext, useContext, useMemo, useCallback } from 'react';
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

    // --- LÓGICA DE INVENTARIO PARA BARTENDER ---

    // Función para cancelar pedido y devolver productos al inventario
    const cancelarPedido = useCallback(async (id) => {
        try {
            // 1. Buscar el pedido para saber qué productos devolver
            // Asumimos que 'pedido.pedidos' contiene la lista de pedidos actuales
            const pedidoActual = pedido.pedidos?.find(p => p.id === id);

            if (pedidoActual && pedidoActual.productos) {
                // 2. Iterar productos y devolver stock
                const promesas = pedidoActual.productos.map(item => {
                    // AJUSTAR: URL de tu backend. Se asume que item tiene { producto: { id }, cantidad }
                    const productoId = item.producto?.id || item.producto;

                    // Ejemplo de llamada a API para devolver stock
                    return fetch(`http://localhost:4000/api/productos/${productoId}/stock`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            cantidad: item.cantidad,
                            accion: 'sumar' // Flag para indicar devolución
                        })
                    });
                });
                await Promise.all(promesas);
            }

            // 3. Ejecutar la cancelación original (cambio de estado)
            if (pedido.cancelarPedido) {
                await pedido.cancelarPedido(id);
            }
        } catch (error) {
            console.error("Error al cancelar pedido y devolver stock:", error);
        }
    }, [pedido]);

    // Función para confirmar pedido
    const confirmarPedido = useCallback(async (id) => {
        try {
            // Si el stock NO se descuenta al crear el pedido, descomenta y ajusta aquí:
            /*
            // Lógica para descontar stock (accion: 'restar')
            */

            if (pedido.confirmarPedido) {
                await pedido.confirmarPedido(id);
            }
        } catch (error) {
            console.error("Error al confirmar pedido:", error);
        }
    }, [pedido]);

    // Memoize the value to prevent unnecessary re-renders of the entire tree
    // if only one part of the context changes (though hooks are already memoized).
    const value = useMemo(() => ({
        ...order,
        ...pedido,
        auth,
        cancelarPedido, // Sobrescribe las funciones originales con las nuevas
        confirmarPedido
    }), [order, pedido, auth, cancelarPedido, confirmarPedido]);

    return (
        <PedidosContext.Provider value={value}>
            {children}
        </PedidosContext.Provider>
    );
};
