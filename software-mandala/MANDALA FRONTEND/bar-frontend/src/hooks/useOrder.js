// src/hooks/useOrder.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../apiConfig'; // Importar la URL centralizada

export const useOrder = () => {
    const [productos, setProductos] = useState([]);
    const [orderItems, setOrderItems] = useState([]);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get(`${API_URL}/productos/`);
                setProductos(response.data);
            } catch (error) {
                console.error("Error al cargar los productos:", error);
            }
        };
        fetchProductos();
    }, []);

    const addProductToOrder = (producto, cantidad) => {
        const existingItem = orderItems.find(item => item.producto.id === producto.id);
        if (existingItem) {
            const updatedItems = orderItems.map(item =>
                item.producto.id === producto.id
                    ? { ...item, cantidad: item.cantidad + cantidad }
                    : item
            );
            setOrderItems(updatedItems);
        } else {
            setOrderItems([...orderItems, { producto, cantidad }]);
        }
    };

    const clearOrder = () => {
        setOrderItems([]);
    };

    const updateProductQuantity = (productId, newQuantity) => {
        const updatedItems = orderItems.map(item =>
            item.producto.id === productId
                ? { ...item, cantidad: newQuantity }
                : item
        );
        setOrderItems(updatedItems);
    };

    const removeProductFromOrder = (productId) => {
        const updatedItems = orderItems.filter(item => item.producto.id !== productId);
        setOrderItems(updatedItems);
    };

    return {
        productos,
        orderItems,
        addProductToOrder,
        clearOrder,
        updateProductQuantity,
        removeProductFromOrder
    };
};
