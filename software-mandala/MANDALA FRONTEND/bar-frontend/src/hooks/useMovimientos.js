import { useCallback } from 'react';
import toast from 'react-hot-toast';
import * as movimientoService from '../services/movimientoService';

/**
 * Hook to handle inventory movement logic (ins and outs).
 * @param {Function} onMovimientoSuccess - Callback to execute when movement is successfully registered.
 */
export const useMovimientos = (onMovimientoSuccess) => {
    const handleMovimiento = useCallback(async (payload) => {
        try {
            // Normalize product id
            const productoId =
                payload.producto ??
                payload.producto_id ??
                payload.productoId ??
                (payload.producto && payload.producto.id) ??
                payload.id;

            // Normalize movement type
            const tipoRaw = (payload.tipo || payload.tipoMovimiento || '').toString().trim().toLowerCase();
            let tipo;
            const entradaAliases = ['entrada', 'in', 'ingreso', 'ingresar', 'add', 'agregar'];
            const salidaAliases = ['salida', 'out', 'egreso', 'retirar', 'remove', 'quitar'];
            
            if (entradaAliases.includes(tipoRaw)) tipo = 'entrada';
            else if (salidaAliases.includes(tipoRaw)) tipo = 'salida';
            else if (tipoRaw === 'e') tipo = 'entrada';
            else if (tipoRaw === 's') tipo = 'salida';
            else tipo = '';

            // Normalize quantity
            const cantidadRaw = payload.cantidad ?? payload.cantidad_raw ?? payload.qty ?? payload.amount;
            const cantidad = cantidadRaw !== undefined && cantidadRaw !== null ? String(cantidadRaw) : '';

            const descripcion = payload.motivo || payload.descripcion || payload.detalle || '';

            // Validation
            if (!productoId) {
                toast.error('Producto no especificado.');
                return;
            }
            if (!['entrada', 'salida'].includes(tipo)) {
                toast.error('Tipo inválido. Debe ser "entrada" o "salida".');
                return;
            }
            if (cantidad === '' || Number(cantidad) <= 0 || Number.isNaN(Number(cantidad))) {
                toast.error('Cantidad inválida.');
                return;
            }

            const body = {
                producto: productoId,
                tipo,
                cantidad,
                descripcion,
                usuario: payload.usuario || null,
            };

            const response = await movimientoService.createMovimiento(body);

            // Based on service implementation, success is usually returned directly or in response.data
            if (onMovimientoSuccess) {
                await onMovimientoSuccess();
            }

            toast.success('Movimiento registrado con éxito!');
            return true;

        } catch (error) {
            console.error("Error al registrar movimiento ❌", error.response?.data || error.message);
            const respData = error.response?.data;

            // If backend returned useful info despite error, still try to refresh
            if (respData && (respData.producto || respData.movimiento_id || respData.product)) {
                if (onMovimientoSuccess) {
                    await onMovimientoSuccess();
                }
                toast.success('Movimiento registrado.');
                return true;
            }

            const detail = respData?.detail || respData || error.message;
            toast.error(typeof detail === 'string' ? detail : 'Error al registrar el movimiento.');
            return false;
        }
    }, [onMovimientoSuccess]);

    return { handleMovimiento };
};
