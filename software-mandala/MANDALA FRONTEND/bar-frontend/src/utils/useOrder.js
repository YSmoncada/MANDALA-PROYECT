import { useState } from "react";

export function useOrder() {
    const [orderItems, setOrderItems] = useState([]);

    const addProductToOrder = (producto, cantidad) => {
        setOrderItems((prevItems) => {
            const existingItem = prevItems.find(
                (item) => item.producto.id === producto.id
            );

            if (existingItem) {
                // Si el producto ya está en el pedido, actualiza la cantidad
                return prevItems.map((item) =>
                    item.producto.id === producto.id
                        ? { ...item, cantidad: item.cantidad + cantidad }
                        : item
                );
            } else {
                // Si es un producto nuevo, lo agrega a la lista
                return [...prevItems, { producto, cantidad }];
            }
        });
    };

    const clearOrder = () => {
        setOrderItems([]);
    };

    return { orderItems, addProductToOrder, clearOrder };
}