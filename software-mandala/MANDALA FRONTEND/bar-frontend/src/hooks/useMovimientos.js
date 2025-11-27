import toast from 'react-hot-toast';
import * as movimientoService from '../services/movimientoService';

/**
 * Hook para manejar la lógica de movimientos de inventario (entradas y salidas)
 * @param {Function} onMovimientoSuccess - Callback a ejecutar cuando el movimiento se registra exitosamente
 */
export const useMovimientos = (onMovimientoSuccess) => {
    const handleMovimiento = async (payload) => {
        try {
            // Normalizar posibles nombres para el id del producto
            const productoId =
                payload.producto ??
                payload.producto_id ??
                payload.productoId ??
                (payload.producto && payload.producto.id) ??
                payload.id;

            // Normalizar tipo recibido (acepta varios valores comunes)
            const tipoRaw = (payload.tipo || payload.tipoMovimiento || '').toString().trim().toLowerCase();
            let tipo;
            const entradaAliases = ['entrada', 'in', 'ingreso', 'ingresar', 'add', 'agregar', 'entrada'];
            const salidaAliases = ['salida', 'out', 'egreso', 'retirar', 'remove', 'quitar'];
            if (entradaAliases.includes(tipoRaw)) tipo = 'entrada';
            else if (salidaAliases.includes(tipoRaw)) tipo = 'salida';
            else if (tipoRaw === 'e') tipo = 'entrada';
            else if (tipoRaw === 's') tipo = 'salida';
            else tipo = ''; // no reconocido

            // Normalizar cantidad
            const cantidadRaw = payload.cantidad ?? payload.cantidad_raw ?? payload.qty ?? payload.amount;
            const cantidad = cantidadRaw !== undefined && cantidadRaw !== null ? String(cantidadRaw) : '';

            const descripcion = payload.motivo || payload.descripcion || payload.detalle || '';

            // Validaciones antes de enviar
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

            if (response.status === 201) {
                // Ejecutar callback de éxito (normalmente para refrescar productos)
                if (onMovimientoSuccess) {
                    await onMovimientoSuccess();
                }

                if (response.data.warning) toast.success('Movimiento registrado (con advertencia).');
                else toast.success('Movimiento registrado con éxito!');
                return;
            }

            const detail = response.data?.detail || JSON.stringify(response.data);
            toast.error(typeof detail === 'string' ? detail : 'Error al registrar el movimiento.');

        } catch (error) {
            console.error("Error al registrar movimiento ❌", error.response?.data || error.message);
            const respData = error.response?.data;

            // Si backend devolvió info útil a pesar del error, intentar refrescar
            if (respData && (respData.producto || respData.movimiento_id || respData.product)) {
                if (onMovimientoSuccess) {
                    await onMovimientoSuccess();
                }
                toast.success('Movimiento registrado (respuesta incompleta del servidor).');
                return;
            }

            const detail = respData?.detail || respData || error.message;
            toast.error(typeof detail === 'string' ? detail : 'Error al registrar el movimiento.');
        }
    };

    return { handleMovimiento };
};
