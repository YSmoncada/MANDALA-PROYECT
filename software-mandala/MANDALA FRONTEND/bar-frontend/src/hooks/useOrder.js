// src/hooks/useOrder.js
import { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';

export const useOrder = () => {
    const [productos, setProductos] = useState([]);

    // Cargar orderItems desde localStorage al iniciar
    const [orderItems, setOrderItems] = useState(() => {
        try {
            const savedOrder = localStorage.getItem('currentOrder');
            return savedOrder ? JSON.parse(savedOrder) : [];
        } catch (error) {
            console.error('Error loading order from localStorage:', error);
            return [];
        }
    });

    // Guardar orderItems en localStorage cada vez que cambien
    useEffect(() => {
        try {
            localStorage.setItem('currentOrder', JSON.stringify(orderItems));
        } catch (error) {
            console.error('Error saving order to localStorage:', error);
        }
    }, [orderItems]);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await apiClient.get('/productos/');
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
        localStorage.removeItem('currentOrder');
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
