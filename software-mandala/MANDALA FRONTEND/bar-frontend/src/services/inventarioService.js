import apiClient from "../utils/apiClient";
import toast from "react-hot-toast";

/**
 * Obtiene todos los productos del backend.
 */
export const getProductos = async () => {
    try {
        const response = await apiClient.get("/productos/");
        return response.data;
    } catch (error) {
        toast.error("No se pudieron cargar los productos.");
        console.error("Error en getProductos:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Guarda un producto (crea o actualiza).
 * @param {string|null} id - El ID del producto para actualizar, o null para crear.
 * @param {object} payload - Los datos del producto en formato JSON.
 */
export const saveProducto = async (id, payload) => {
    try {
        let response;
        if (id) {
            // Si hay un ID, actualizamos (PUT) el producto existente.
            response = await apiClient.put(`/productos/${id}/`, payload);
            toast.success("Producto actualizado con éxito.");
        } else {
            // Si no hay ID, creamos (POST) un nuevo producto.
            response = await apiClient.post("/productos/", payload);
            toast.success("Producto creado con éxito.");
        }
        return response.data;
    } catch (error) {
        // El apiClient (si usa interceptores) o el hook que lo llama debería mostrar el error.
        console.error("Error en saveProducto:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Elimina un producto por su ID.
 * @param {string} id - El ID del producto a eliminar.
 */
export const deleteProducto = async (id) => {
    try {
        await apiClient.delete(`/productos/${id}/`);
        toast.success("Producto eliminado con éxito.");
    } catch (error) {
        toast.error("Error al eliminar el producto.");
        console.error("Error en deleteProducto:", error.response?.data || error.message);
        throw error;
    }
};