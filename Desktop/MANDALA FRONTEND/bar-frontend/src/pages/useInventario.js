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
  const [originalImageUrl, setOriginalImageUrl] = useState(""); // Para rastrear la imagen original

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
    setOriginalImageUrl("");
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
    setSelectedImage(null); // No hay nueva imagen seleccionada inicialmente
    
    // Configurar imagen existente
    const existingImageUrl = prod.imagen || "";
    setOriginalImageUrl(existingImageUrl);
    setImagePreview(existingImageUrl);
    
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      axios.delete(`${API_URL}${id}/`).then(() => fetchProductos());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Determinar si necesitamos enviar FormData o JSON
    const needsFormData = selectedImage || (!editId && selectedImage);
    
    if (needsFormData) {
      // Usar FormData cuando hay nueva imagen
      const formData = new FormData();
      
      // Agregar todos los campos del formulario
      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });
      
      // Agregar imagen solo si hay una nueva seleccionada
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
        resetModalState();
        fetchProductos();
      }).catch((error) => {
        console.error("Error al guardar producto:", error);
      });
    } else {
      // Usar JSON cuando no hay cambios en la imagen
      const request = editId
        ? axios.put(`${API_URL}${editId}/`, form)
        : axios.post(API_URL, form);
      
      request.then(() => {
        resetModalState();
        fetchProductos();
      }).catch((error) => {
        console.error("Error al guardar producto:", error);
      });
    }
  };

  // Función helper para resetear el estado del modal
  const resetModalState = () => {
    setModalOpen(false);
    setSelectedImage(null);
    setImagePreview("");
    setOriginalImageUrl("");
    setEditId(null);
    setForm(initialForm);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    
    // Si no hay archivo, restaurar imagen original o limpiar
    if (!file || file.length === 0) {
      setSelectedImage(null);
      if (editId && originalImageUrl) {
        // Restaurar imagen original si estamos editando
        setImagePreview(originalImageUrl);
      } else {
        // Limpiar completamente si es nuevo producto
        setImagePreview("");
      }
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
    originalImageUrl,
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