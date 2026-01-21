import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { usePedidosContext } from "../context/PedidosContext";

/**
 * Logic for the main Pedidos Page (Checkout/Summary).
 */
export const usePedidosPage = () => {
    const {
        auth,
        orderItems,
        totalOrder,
        clearOrder: onClearOrderContext,
        updateProductQuantity: onUpdateCantidad,
        removeProductFromOrder: onRemoveItem,
        mesas,
        selectedMesaId,
        setSelectedMesaId,
        isLoadingMesas,
        finalizarPedido,
        isTableLocked,
        setIsTableLocked
    } = usePedidosContext();

    const navigate = useNavigate();

    const {
        userName,
        userId,
        codigoConfirmado,
        isInitialized,
        handleLogout,
        role
    } = auth;

    const esRolMesera = role === 'mesera';

    // Auth redirection
    useEffect(() => {
        if (!isInitialized) return;
        // If it's a staff profile (mesera role) and not confirmed, redirect to login
        if (esRolMesera && (!userName || !codigoConfirmado)) {
            navigate('/login', { replace: true });
        }
    }, [isInitialized, userName, codigoConfirmado, navigate, role, esRolMesera]);

    const onClearOrder = useCallback(() => {
        onClearOrderContext();
        setIsTableLocked(false);
    }, [onClearOrderContext, setIsTableLocked]);

    const handleFinalizarPedido = useCallback(async () => {
        if (orderItems.length === 0) {
            toast.error("No hay productos en el pedido.");
            return;
        }

        if (esRolMesera && !userId) {
            toast.error("Error de autenticación. Inicie sesión nuevamente.");
            return;
        }

        if (!selectedMesaId) {
            toast.error("Por favor, seleccione una mesa.");
            return;
        }

        const pedidoData = {
            mesa: selectedMesaId,
            estado: "pendiente",
            productos: orderItems.map(item => ({
                producto_id: item.producto.id,
                cantidad: item.cantidad,
            })),
            force_append: isTableLocked
        };

        // Attach user info based on role
        if (esRolMesera) {
            pedidoData.mesera = userId;
        } else {
            pedidoData.usuario = userId;
        }

        const result = await finalizarPedido(pedidoData);

        if (result.success) {
            toast.success(result.message, {
                style: { background: '#0E0D23', color: '#fff', border: '1px solid #A944FF' },
                iconTheme: { primary: '#A944FF', secondary: '#fff' },
            });
            onClearOrder();
            
            if (role === 'bartender') {
                navigate('/bartender');
            } else {
                navigate('/pedidos-disco');
            }
        } else {
            toast.error(result.message);
        }
    }, [orderItems, role, userId, selectedMesaId, isTableLocked, finalizarPedido, esRolMesera, onClearOrder, navigate]);

    const esRolAutorizado = ['bartender', 'admin', 'prueba'].includes(role);
    const esMeseraAutenticada = userName && codigoConfirmado;
    const puedeRenderizar = isInitialized && (esRolAutorizado || esMeseraAutenticada);

    return {
        // Data
        orderItems,
        totalOrder,
        mesas,
        selectedMesaId,
        isTableLocked,
        isLoadingMesas,
        puedeRenderizar,
        userName,
        
        // Actions
        setSelectedMesaId,
        onUpdateCantidad,
        onRemoveItem,
        handleLogout,
        onClearOrder,
        handleFinalizarPedido,
        codigoConfirmado,
        currentFormattedId: role === 'mesera' ? `m${userId}` : `u${userId}`,
        role
    };
};
