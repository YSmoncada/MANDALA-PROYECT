import apiClient from "../utils/apiClient";

/**
 * Obtiene todos los productos del backend.
 */
export const getProductos = async () => {
    try {
        const response = await apiClient.get('/productos/');
        return response.data;
    } catch (error) {
        console.error("Error en getProductos:", error);
        throw error;
    }
};

/**
 * Guarda un producto (crea o actualiza).
 * @param {number|null} id - El ID del producto para actualizar, o null para crear.
 * @param {FormData|object} data - Los datos del producto.
 */
export const saveProducto = async (id, data) => {
    const isFormData = data instanceof FormData;
    const config = isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
    const request = id
        ? apiClient.put(`/productos/${id}/`, data, config)
        : apiClient.post('/productos/', data, config);

    try {
        const response = await request;
        return response.data;
    } catch (error) {
        console.error("Error en saveProducto:", error);
        throw error;
    }
};

/**
 * Elimina un producto por su ID.
 * @param {number} id - El ID del producto a eliminar.
 */
export const deleteProducto = async (id) => {
    try {
        await apiClient.delete(`/productos/${id}/`);
    } catch (error) {
        console.error("Error en deleteProducto:", error);
        throw error;
    }
};