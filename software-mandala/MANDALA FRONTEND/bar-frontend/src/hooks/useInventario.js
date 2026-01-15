import { useState, useEffect, useMemo, useCallback } from "react";
import { validateImageFile, createImagePreview } from "../utils/imageUtils";
import toast from 'react-hot-toast';
import * as inventarioService from "../services/inventarioService";
import { useMovimientos } from "./useMovimientos";

const INITIAL_FORM = {
    nombre: "",
    categoria: "",
    stock: 0,
    stock_minimo: 0,
    stock_maximo: 0,
    precio: 0,
    unidad: "",
    proveedor: "",
    ubicacion: "",
    imagen: "", 
};

/**
 * Hook to manage inventory state and operations.
 * Optimized for performance and readability.
 */
export const useInventario = () => {
    // --- Data State ---
    const [productos, setProductos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // --- UI/Modal States ---
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    
    // --- Form & Edit State ---
    const [form, setForm] = useState(INITIAL_FORM);
    const [editId, setEditId] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);
    
    // --- Image States ---
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [originalImageUrl, setOriginalImageUrl] = useState(null);
    
    // --- Search & Filtering States ---
    const [query, setQuery] = useState("");
    const [categoria, setCategoria] = useState("all");

    // --- Actions ---
    
    const fetchProductos = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await inventarioService.getProductos();
            setProductos(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProductos();
    }, [fetchProductos]);

    // --- Derived State (Memoized) ---
    const filtered = useMemo(() => {
        const q = query.toLowerCase().trim();
        return productos.filter((p) => {
            const matchesQuery = p.nombre.toLowerCase().includes(q);
            const matchesCategoria = !categoria || categoria === "all" || p.categoria === categoria;
            return matchesQuery && matchesCategoria;
        });
    }, [productos, query, categoria]);

    const categorias = useMemo(() => {
        const unique = [...new Set(productos.map((p) => p.categoria).filter(Boolean))];
        return ["all", ...unique];
    }, [productos]);

    const stats = useMemo(() => ({
        totalProductos: filtered.length,
        totalUnidades: filtered.reduce((sum, p) => sum + p.stock, 0)
    }), [filtered]);

    // --- Handlers (Memoized) ---
    
    const handleAdd = useCallback(() => {
        setForm(INITIAL_FORM);
        setEditId(null);
        setImagePreview(null);
        setImageFile(null);
        setOriginalImageUrl(null);
        setModalOpen(true);
    }, []);

    const handleEdit = useCallback((producto) => {
        setForm(producto);
        setEditId(producto.id);
        setImageFile(null);
        setImagePreview(producto.imagen);
        setOriginalImageUrl(producto.imagen);
        setModalOpen(true);
    }, []);

    const handleDelete = useCallback((producto) => {
        setProductToDelete(producto);
        setDeleteConfirmOpen(true);
    }, []);

    const confirmDelete = useCallback(async () => {
        if (!productToDelete) return;
        try {
            await inventarioService.deleteProducto(productToDelete.id);
            await fetchProductos();
            setDeleteConfirmOpen(false);
            setProductToDelete(null);
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    }, [productToDelete, fetchProductos]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleImageChange = useCallback(async (e) => {
        const file = e.target.files[0];
        if (!file) {
            setImageFile(null);
            setImagePreview(editId ? originalImageUrl : null);
            return;
        }

        try {
            validateImageFile(file);
            const preview = await createImagePreview(file);
            setImagePreview(preview);
            setImageFile(file);
        } catch (error) {
            toast.error(error.message);
        }
    }, [editId, originalImageUrl]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        // Unique Name Validation
        const nombreActual = form.nombre.trim().toLowerCase();
        const exists = productos.find(p => p.nombre.trim().toLowerCase() === nombreActual);
        if (exists && (!editId || String(exists.id) !== String(editId))) {
            toast.error("Ya existe un producto con este nombre.");
            return;
        }

        // Stock Validation
        const min = parseInt(form.stock_minimo, 10) || 0;
        const max = parseInt(form.stock_maximo, 10) || 0;
        if (max > 0 && min > 0 && max <= min) {
            toast.error("El stock máximo debe ser mayor que el stock mínimo.");
            return;
        }

        const payload = { ...form };
        delete payload.imagen; // Let backend/service handle image logic
        
        if (editId) delete payload.stock; // Safety for stock in edit mode

        try {
            setIsUploading(true);
            await inventarioService.saveProducto(editId, payload, imageFile);
            await fetchProductos();
            setModalOpen(false);
        } catch (error) {
            console.error("Error saving product:", error);
            toast.error(error.response?.data?.detail || 'Error al guardar el producto.');
        } finally {
            setIsUploading(false);
        }
    }, [form, editId, productos, imageFile, fetchProductos]);

    const { handleMovimiento } = useMovimientos(fetchProductos);

    return {
        // Data
        filtered,
        productos,
        isLoading,
        
        // UI State
        modalOpen,
        deleteConfirmOpen,
        isUploading,
        
        // Form/Edit State
        form,
        editId,
        productToDelete,
        imagePreview,
        originalImageUrl,
        
        // Filters
        query,
        categoria,
        categorias,
        ...stats,
        
        // Actions
        setModalOpen,
        setDeleteConfirmOpen,
        setQuery,
        setCategoria,
        handleAdd,
        handleEdit,
        handleDelete,
        confirmDelete,
        handleSubmit,
        handleChange,
        handleImageChange,
        handleMovimiento,
        fetchProductos
    };
};
