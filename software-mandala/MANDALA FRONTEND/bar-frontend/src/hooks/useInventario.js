import { useState, useEffect, useMemo } from "react";
import { validateImageFile, createImagePreview } from "../utils/imageUtils";
import toast from 'react-hot-toast';
import * as inventarioService from "../services/inventarioService";

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
    imagen: null,
};

export const useInventario = () => {
    const [productos, setProductos] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [editId, setEditId] = useState(null);
    const [query, setQuery] = useState("");
    const [categoria, setCategoria] = useState("all");
    const [imagePreview, setImagePreview] = useState(null);
    const [originalImageUrl, setOriginalImageUrl] = useState(null);

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
            const matchesCategoria = categoria === "all" || producto.categoria === categoria;
            return matchesQuery && matchesCategoria;
        });
    }, [productos, query, categoria]);

    const categorias = useMemo(() => ["all", ...new Set(productos.map((p) => p.categoria).filter(Boolean))], [productos]);
    const totalProductos = filtered.length;
    const totalUnidades = filtered.reduce((sum, p) => sum + p.stock, 0);

    const handleAdd = () => {
        setForm(initialForm);
        setEditId(null);
        setImagePreview(null);
        setOriginalImageUrl(null);
        setModalOpen(true);
    };

    const handleEdit = (producto) => {
        setForm({ ...producto, imagen: null });
        setEditId(producto.id);
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (validateImageFile(file)) {
            setForm({ ...form, imagen: file });
            createImagePreview(file, setImagePreview);
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
        const stockMinimo = parseInt(form.stock_minimo, 10);
        const stockMaximo = parseInt(form.stock_maximo, 10);

        if (stockMaximo <= stockMinimo) {
            toast.error("El stock máximo debe ser mayor que el stock mínimo.");
            return; // Detiene el envío del formulario
        }

        const data = new FormData();
        Object.keys(form).forEach((key) => {
            if (form[key] !== null) data.append(key, form[key]);
        });

        await inventarioService.saveProducto(editId, data);
        fetchProductos();
        setModalOpen(false);
    };

    const handleMovimiento = async (productoId, tipo, cantidad, motivo, usuario) => {
        const movimientoData = {
            producto: productoId,
            tipo,
            cantidad,
            motivo,
            usuario,
        };
        // Lógica para enviar el movimiento al backend
        console.log("Creando movimiento:", movimientoData);
        // await movimientoService.createMovimiento(movimientoData);
        fetchProductos(); // Recargar productos para ver el stock actualizado
    };

    return {
        filtered, modalOpen, form, editId, query, categorias, totalProductos, totalUnidades,
        imagePreview, originalImageUrl, setModalOpen, setQuery, setCategoria, handleAdd,
        handleEdit, handleDelete, handleSubmit, handleChange, handleImageChange, handleMovimiento,
        fetchProductos,
    };
};
