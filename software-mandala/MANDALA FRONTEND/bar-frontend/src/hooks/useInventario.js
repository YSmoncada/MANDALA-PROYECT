import { useState, useEffect, useMemo } from "react";
import { validateImageFile, createImagePreview } from "../utils/imageUtils";
import toast from 'react-hot-toast';
import * as inventarioService from "../services/inventarioService";
import { useMovimientos } from "./useMovimientos";

const initialForm = {
    nombre: "",
    categoria: "",
    stock: 0,
    stock_minimo: 0,
    stock_maximo: 0,
    precio: 0,
    unidad: "",
    proveedor: "",
    ubicacion: "",
    imagen: "", // Ahora será una URL (string)
};

export const useInventario = () => {
    const [productos, setProductos] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [editId, setEditId] = useState(null);
    const [query, setQuery] = useState("");
    const [categoria, setCategoria] = useState("all");
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null); // Estado para el archivo de imagen
    const [originalImageUrl, setOriginalImageUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false); // Estado para el feedback de subida
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const fetchProductos = async () => {
        const data = await inventarioService.getProductos();
        setProductos(data);
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    const filtered = useMemo(() => {
        return productos.filter((producto) => {
            const matchesQuery = producto.nombre.toLowerCase().includes(query.toLowerCase());
            const matchesCategoria = !categoria || categoria === "all" || producto.categoria === categoria;
            return matchesQuery && matchesCategoria;
        });
    }, [productos, query, categoria]);

    const categorias = useMemo(() => {
        const categoriasUnicas = [...new Set(productos.map((p) => p.categoria).filter(Boolean))];
        return ["all", ...categoriasUnicas];
    }, [productos]);
    const totalProductos = filtered.length;
    const totalUnidades = filtered.reduce((sum, p) => sum + p.stock, 0);

    const handleAdd = () => {
        setForm(initialForm);
        setEditId(null);
        setImagePreview(null);
        setImageFile(null);
        setOriginalImageUrl(null);
        setModalOpen(true);
    };

    const handleEdit = (producto) => {
        setForm(producto); // Carga el producto completo, incluyendo la URL de la imagen
        setEditId(producto.id);
        setImageFile(null); // No hay archivo nuevo aún
        setImagePreview(producto.imagen); // Mostrar la imagen existente
        setOriginalImageUrl(producto.imagen); // Guardar la URL original
        setModalOpen(true);
    };

    const handleDelete = (producto) => {
        setProductToDelete(producto);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;
        try {
            await inventarioService.deleteProducto(productToDelete.id);
            await fetchProductos();
            setDeleteConfirmOpen(false);
            setProductToDelete(null);
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];

        // Si no hay archivo (usuario eliminó la imagen o canceló)
        if (!file) {
            setImageFile(null); // Limpiar el archivo nuevo

            // Si estamos editando, restaurar la imagen original
            if (editId && originalImageUrl) {
                setImagePreview(originalImageUrl);
            } else {
                // Si es nuevo producto, limpiar el preview
                setImagePreview(null);
            }
            return;
        }

        try {
            validateImageFile(file);
            const preview = await createImagePreview(file);
            setImagePreview(preview); // Muestra la previsualización
            setImageFile(file); // Guarda el archivo para subirlo al guardar
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // --- VALIDACIÓN DE NOMBRE ÚNICO ---
        const nombreActual = form.nombre.trim().toLowerCase();
        const productoExistente = productos.find(p => p.nombre.trim().toLowerCase() === nombreActual);

        // Si el producto existe y (estamos creando uno nuevo O estamos editando y el ID es diferente)
        if (productoExistente && (!editId || String(productoExistente.id) !== String(editId))) {
            toast.error("Ya existe un producto con este nombre.");
            return; // Detiene el envío del formulario
        }

        // --- VALIDACIONES ---
        const stockActual = parseInt(form.stock, 10);
        const stockMinimo = parseInt(form.stock_minimo, 10) || 0;
        const stockMaximo = parseInt(form.stock_maximo, 10) || 0;

        // Validar solo si ambos valores son números válidos y mayores que cero
        if (stockMaximo > 0 && stockMinimo > 0 && stockMaximo <= stockMinimo) {
            toast.error("El stock máximo debe ser mayor que el stock mínimo.");
            return; // Detiene el envío del formulario
        }

        // Prepara el payload para tu backend
        const payload = {
            ...form,
        };

        // Manejo de la imagen en el payload
        if (imageFile) {
            // Si hay un archivo nuevo, se enviará con FormData (no incluir en payload JSON)
            delete payload.imagen;
        } else {
            // Si no hay archivo nuevo (tanto al crear como al editar), NO enviar el campo imagen
            // El backend mantendrá la imagen existente si estamos editando
            delete payload.imagen;
        }

        // DEBUG: Ver qué se está enviando
        console.log('🔍 DEBUG - Datos a enviar:');
        console.log('editId:', editId);
        console.log('imageFile:', imageFile);
        console.log('originalImageUrl:', originalImageUrl);
        console.log('form.imagen:', form.imagen);
        console.log('payload.imagen:', payload.imagen);
        console.log('payload completo:', payload);

        try {
            setIsUploading(true);

            // Enviar el archivo de imagen directamente al backend
            if (imageFile) {
                const uploadToast = toast.loading('Guardando producto y subiendo imagen...');
                try {
                    await inventarioService.saveProducto(editId, payload, imageFile);
                    toast.success('Producto guardado con éxito.', { id: uploadToast });
                } catch (error) {
                    toast.error('Error al guardar el producto.', { id: uploadToast });
                    console.error("Error al guardar producto:", error);
                    console.error("Respuesta del servidor:", error.response?.data);
                    return;
                } finally {
                    setIsUploading(false);
                }
            } else {
                // Si no hay imagen nueva, guardar solo los datos (con la imagen original si existe)
                console.log('📤 Enviando sin archivo de imagen...');
                try {
                    await inventarioService.saveProducto(editId, payload);
                    toast.success(editId ? 'Producto actualizado con éxito.' : 'Producto creado con éxito.');
                } catch (error) {
                    console.error("❌ Error al guardar producto:", error);
                    console.error("Respuesta del servidor:", error.response?.data);
                    toast.error(error.response?.data?.detail || 'Error al guardar el producto.');
                    return;
                }
            }

            fetchProductos();
            setModalOpen(false);
        } catch (error) {
            console.error("Error al guardar el producto:", error);
        } finally {
            setIsUploading(false);
        }
    };

    // Usar el hook de movimientos
    const { handleMovimiento } = useMovimientos(fetchProductos);

    return {
        filtered, modalOpen, form, editId, query, categorias, totalProductos, totalUnidades,
        categoria, // Exportamos el estado de la categoría seleccionada
        imagePreview, originalImageUrl, isUploading, setModalOpen, setQuery, setCategoria, handleAdd,
        handleEdit, handleDelete, handleSubmit, handleChange, handleImageChange, handleMovimiento,
        fetchProductos,
        // Nuevos campos para el modal de confirmación
        deleteConfirmOpen, setDeleteConfirmOpen, productToDelete, confirmDelete
    };
};
