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
        mesera,
        meseraId,
        codigoConfirmado,
        isInitialized,
        handleLogout,
        role
    } = auth;

    const esRolMesera = role !== 'admin' && role !== 'bartender' && role !== 'prueba';

    // Auth redirection
    useEffect(() => {
        if (!isInitialized) return;
        if (esRolMesera && (!mesera || !codigoConfirmado)) {
            navigate('/login-disco', { replace: true });
        }
    }, [isInitialized, mesera, codigoConfirmado, navigate, role, esRolMesera]);

    const onClearOrder = useCallback(() => {
        onClearOrderContext();
        setIsTableLocked(false);
    }, [onClearOrderContext, setIsTableLocked]);

    const handleFinalizarPedido = useCallback(async () => {
        if (orderItems.length === 0) {
            toast.error("No hay productos en el pedido.");
            return;
        }

        if (esRolMesera && !meseraId) {
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

        if (esRolMesera) {
            pedidoData.mesera = meseraId;
        } else {
            pedidoData.usuario = meseraId;
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
    }, [orderItems, role, meseraId, selectedMesaId, isTableLocked, finalizarPedido, esRolMesera, onClearOrder, navigate]);

    const esRolAutorizado = ['bartender', 'admin', 'prueba'].includes(role);
    const esMeseraAutenticada = mesera && codigoConfirmado;
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
        mesera,
        
        // Actions
        setSelectedMesaId,
        onUpdateCantidad,
        onRemoveItem,
        handleLogout,
        onClearOrder,
        handleFinalizarPedido,
        codigoConfirmado
    };
};
