import { useState, useEffect, useCallback, useMemo } from 'react';
import apiClient from '../utils/apiClient';

/**
 * Hook to manage order items (the cart).
 */
export const useOrder = () => {
    const [productos, setProductos] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    // Initial state from localStorage
    const [orderItems, setOrderItems] = useState(() => {
        try {
            const savedOrder = localStorage.getItem('currentOrder');
            return savedOrder ? JSON.parse(savedOrder) : [];
        } catch (error) {
            console.error('Error loading order from localStorage:', error);
            return [];
        }
    });

    // Persistent storage effect
    useEffect(() => {
        try {
            localStorage.setItem('currentOrder', JSON.stringify(orderItems));
        } catch (error) {
            console.error('Error saving order to localStorage:', error);
        }
    }, [orderItems]);

    // Fetch products list
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                setIsLoadingProducts(true);
                const response = await apiClient.get('/productos/');
                setProductos(response.data);
            } catch (error) {
                console.error("Error loading products:", error);
            } finally {
                setIsLoadingProducts(false);
            }
        };
        fetchProductos();
    }, []);

    // Memoized actions
    const addProductToOrder = useCallback((producto, cantidad) => {
        setOrderItems(prevItems => {
            const existingItem = prevItems.find(item => item.producto.id === producto.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.producto.id === producto.id
                        ? { ...item, cantidad: item.cantidad + cantidad }
                        : item
                );
            }
            return [...prevItems, { producto, cantidad }];
        });
    }, []);

    const clearOrder = useCallback(() => {
        setOrderItems([]);
        localStorage.removeItem('currentOrder');
    }, []);

    const updateProductQuantity = useCallback((productId, newQuantity) => {
        setOrderItems(prevItems => prevItems.map(item =>
            item.producto.id === productId
                ? { ...item, cantidad: newQuantity }
                : item
        ));
    }, []);

    const removeProductFromOrder = useCallback((productId) => {
        setOrderItems(prevItems => prevItems.filter(item => item.producto.id !== productId));
    }, []);

    const totalOrder = useMemo(() => 
        orderItems.reduce((total, item) => total + item.producto.precio * item.cantidad, 0),
    [orderItems]);

    return {
        productos,
        orderItems,
        isLoadingProducts,
        totalOrder,
        addProductToOrder,
        clearOrder,
        updateProductQuantity,
        removeProductFromOrder
    };
};
