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
 * @param {File|null} imageFile - El archivo de imagen opcional para subir.
 */
export const saveProducto = async (id, payload, imageFile = null) => {
    try {
        let response;

        // Si hay un archivo de imagen, usamos FormData
        if (imageFile) {
            const formData = new FormData();

            // Agregar todos los campos del payload al FormData
            Object.keys(payload).forEach(key => {
                if (payload[key] !== null && payload[key] !== undefined && key !== 'imagen') {
                    formData.append(key, payload[key]);
                }
            });

            // Agregar el archivo de imagen
            formData.append('imagen', imageFile);

            if (id) {
                response = await apiClient.patch(`/productos/${id}/`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Producto actualizado con éxito.");
            } else {
                response = await apiClient.post("/productos/", formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Producto creado con éxito.");
            }
        } else {
            // Si no hay imagen, enviamos JSON normal
            if (id) {
                response = await apiClient.patch(`/productos/${id}/`, payload);
                toast.success("Producto actualizado con éxito.");
            } else {
                response = await apiClient.post("/productos/", payload);
                toast.success("Producto creado con éxito.");
            }
        }

        return response.data;
    } catch (error) {
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