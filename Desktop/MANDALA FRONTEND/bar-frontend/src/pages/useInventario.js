import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { validateImageFile, createImagePreview } from "../utils/imageUtils";

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
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

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
    setSelectedImage(null);
    setImagePreview("");
    setModalOpen(true);
  };

  const handleEdit = (prod) => {
    setForm({
      nombre: prod.nombre || "",
      categoria: prod.categoria || "",
      stock: prod.stock?.toString() || "",
      stock_minimo: prod.stock_minimo?.toString() || "",
      stock_maximo: prod.stock_maximo?.toString() || "",
      precio: prod.precio?.toString() || "",
      unidad: prod.unidad || "",
      proveedor: prod.proveedor || "",
      ubicacion: prod.ubicacion || "",
    });
    setEditId(prod.id);
    setSelectedImage(null); // No hay nueva imagen seleccionada
    setImagePreview(prod.imagen || ""); // Mostrar imagen existente
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      axios.delete(`${API_URL}${id}/`).then(() => fetchProductos());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Si estamos editando y no hay nueva imagen, usar JSON
    if (editId && !selectedImage) {
      const request = axios.put(`${API_URL}${editId}/`, form);
      
      request.then(() => {
        setModalOpen(false);
        setSelectedImage(null);
        setImagePreview("");
        setEditId(null);
        setForm(initialForm);
        fetchProductos();
      }).catch((error) => {
        console.error("Error al actualizar producto:", error);
      });
      return;
    }
    
    // Si hay nueva imagen o es un producto nuevo, usar FormData
    const formData = new FormData();
    
    // Agregar todos los campos del formulario
    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });
    
    // Agregar imagen si existe
    if (selectedImage) {
      formData.append('imagen', selectedImage);
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    const request = editId
      ? axios.put(`${API_URL}${editId}/`, formData, config)
      : axios.post(API_URL, formData, config);

    request.then(() => {
      setModalOpen(false);
      setSelectedImage(null);
      setImagePreview("");
      setEditId(null);
      setForm(initialForm);
      fetchProductos();
    }).catch((error) => {
      console.error("Error al guardar producto:", error);
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    
    // Si no hay archivo, limpiar imagen
    if (!file) {
      setSelectedImage(null);
      setImagePreview("");
      return;
    }
    
    try {
      // Validar el archivo de imagen
      validateImageFile(file);
      
      setSelectedImage(file);
      
      // Crear preview de la imagen
      const preview = await createImagePreview(file);
      setImagePreview(preview);
    } catch (error) {
      alert(error.message);
      e.target.value = ''; // Limpiar el input
    }
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
    imagePreview,
    // Funciones
    setModalOpen,
    setQuery,
    setCategoria,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleChange,
    handleImageChange,
    handleMovimiento,
    fetchProductos,
  };
}