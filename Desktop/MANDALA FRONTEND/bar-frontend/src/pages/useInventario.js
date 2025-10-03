import { useState, useEffect, useMemo } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/productos/";

const initialForm = {
  nombre: "",
  categoria: "",
  precio: "",
  stock: "",
  stock_minimo: "",
  stock_maximo: "",
  unidad: "",
  proveedor: "",
  ubicacion: "",
};

export function useInventario() {
  const [productos, setProductos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);

  // Filtros
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("");

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = () => {
    axios
      .get(API_URL)
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error al obtener productos:", err));
  };

  const handleAdd = () => {
    setForm(initialForm);
    setEditId(null);
    setModalOpen(true);
  };

  const handleEdit = (prod) => {
    setForm(prod);
    setEditId(prod.id);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      axios.delete(`${API_URL}${id}/`).then(() => fetchProductos());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const request = editId
      ? axios.put(`${API_URL}${editId}/`, form)
      : axios.post(API_URL, form);

    request.then(() => {
      setModalOpen(false);
      fetchProductos();
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMovimiento = (updatedProduct) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  // Memoización para optimizar el rendimiento
  const categorias = useMemo(() => ({
    lista: [...new Set(productos.map((p) => p.categoria || "Sin categoría"))],
    selected: categoria,
  }), [productos, categoria]);

  const filtered = useMemo(() => productos.filter((p) => {
    const matchNombre = p.nombre.toLowerCase().includes(query.toLowerCase());
    const matchCategoria = categoria ? p.categoria === categoria : true;
    return matchNombre && matchCategoria;
  }), [productos, query, categoria]);

  const totalProductos = filtered.length;
  const totalUnidades = useMemo(() => filtered.reduce(
    (acc, p) => acc + (parseInt(p.stock) || 0),
    0
  ), [filtered]);

  return {
    // Estado
    filtered,
    modalOpen,
    form,
    editId,
    query,
    categorias,
    totalProductos,
    totalUnidades,
    // Funciones
    setModalOpen,
    setQuery,
    setCategoria,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleChange,
    handleMovimiento,
  };
}