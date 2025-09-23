import axios from "axios";

// Dirección de tu API Django
const API_URL = "http://127.0.0.1:8000/api";

// Obtener lista de productos
export const getProductos = () => axios.get(`${API_URL}/productos/`);

// Crear un producto nuevo
export const createProducto = (producto) =>
  axios.post(`${API_URL}/productos/`, producto);
