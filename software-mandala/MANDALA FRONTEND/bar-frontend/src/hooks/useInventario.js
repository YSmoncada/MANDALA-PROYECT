import { useState, useEffect, useMemo } from "react";
import { validateImageFile, createImagePreview } from "../utils/imageUtils";
import toast from 'react-hot-toast';
import { uploadToCloudinary } from "../utils/cloudinaryUploader"; // Importar el uploader
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
        setImageFile(null);
        setImagePreview(null);
        setOriginalImageUrl(producto.imagen);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
            await inventarioService.deleteProducto(id);
            fetchProductos();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

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
        if (productoExistente && (!editId || productoExistente.id !== editId)) {
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

        let imageUrl = editId ? originalImageUrl : ''; // Conserva la URL si se está editando

        // Si hay un nuevo archivo de imagen, súbelo a Cloudinary
        if (imageFile) {
            setIsUploading(true);
            const uploadToast = toast.loading('Subiendo imagen...');
            try {
                imageUrl = await uploadToCloudinary(imageFile);
                toast.success('Imagen subida con éxito.', { id: uploadToast });
            } catch (error) {
                setIsUploading(false);
                toast.error('Error al subir la imagen.', { id: uploadToast });
                console.error("Error al subir a Cloudinary:", error);
                return; // Detiene el proceso si la subida de imagen falla
            } finally {
                setIsUploading(false);
            }
        }

        // Prepara el payload para tu backend, ahora con la URL de la imagen
        const payload = {
            ...form,
            imagen: imageUrl, // Envía la URL de Cloudinary
        };

        try {
            await inventarioService.saveProducto(editId, payload); // saveProducto ahora recibe un objeto JSON
            fetchProductos();
            setModalOpen(false);
        } catch (error) {
            console.error("Error al guardar el producto:", error);
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
    };
};
