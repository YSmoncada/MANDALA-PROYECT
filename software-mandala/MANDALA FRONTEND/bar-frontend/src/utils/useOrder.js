import { useState } from 'react';

export const useOrder = () => {
    const [orderItems, setOrderItems] = useState([]);

    // Función para agregar o actualizar un producto en el pedido
    const addProductToOrder = (producto, cantidad) => {
        setOrderItems((prevItems) => {
            const itemExistente = prevItems.find(
                (item) => item.producto.id === producto.id
            );

            if (itemExistente) {
                return prevItems.map((item) =>
                    item.producto.id === producto.id
                        ? { ...item, cantidad: item.cantidad + cantidad }
                        : item
                );
            } else {
                return [...prevItems, { producto, cantidad }];
            }
        });
    };

    // Función para actualizar la cantidad de un producto existente
    const updateProductQuantity = (productId, newQuantity) => {
        setOrderItems(currentItems =>
            currentItems.map(item =>
                item.producto.id === productId
                    ? { ...item, cantidad: newQuantity }
                    : item
            )
        );
    };

    // Función para eliminar un producto del pedido
    const removeProductFromOrder = (productId) => {
        setOrderItems(currentItems =>
            currentItems.filter(item => item.producto.id !== productId)
        );
    };

    const clearOrder = () => setOrderItems([]);

    return {
        orderItems,
        addProductToOrder,
        updateProductQuantity,
        removeProductFromOrder,
        clearOrder,
    };
};