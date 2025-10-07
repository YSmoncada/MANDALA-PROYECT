import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/productos/";

/**
 * Obtiene todos los productos del backend.
 */
export const getProductos = async () => {
    try {
        const response = await axios.get(API_URL);
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
        ? axios.put(`${API_URL}${id}/`, data, config)
        : axios.post(API_URL, data, config);

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
        await axios.delete(`${API_URL}${id}/`);
    } catch (error) {
        console.error("Error en deleteProducto:", error);
        throw error;
    }
};