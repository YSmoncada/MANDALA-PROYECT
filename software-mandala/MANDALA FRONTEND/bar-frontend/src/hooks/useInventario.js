import { useState, useEffect, useMemo } from "react";
import { validateImageFile, createImagePreview } from "../utils/imageUtils";
import toast from 'react-hot-toast';
import * as inventarioService from "../services/inventarioService";
import * as movimientoService from "../services/movimientoService";

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
        const stockActual = parseInt(form.stock, 10);
        const stockMinimo = parseInt(form.stock_minimo, 10) || 0;
        const stockMaximo = parseInt(form.stock_maximo, 10) || 0;

        // Validar solo si ambos valores son números válidos y mayores que cero
        if (stockMaximo > 0 && stockMinimo > 0 && stockMaximo <= stockMinimo) {
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

    const handleMovimiento = async (payload) => {
        try {
            // Normalizar posibles nombres para el id del producto
            const productoId =
                payload.producto ??
                payload.producto_id ??
                payload.productoId ??
                (payload.producto && payload.producto.id) ??
                payload.id;

            // Normalizar tipo recibido (acepta varios valores comunes)
            const tipoRaw = (payload.tipo || payload.tipoMovimiento || '').toString().trim().toLowerCase();
            let tipo;
            const entradaAliases = ['entrada', 'in', 'ingreso', 'ingresar', 'add', 'agregar', 'entrada'];
            const salidaAliases = ['salida', 'out', 'egreso', 'retirar', 'remove', 'quitar'];
            if (entradaAliases.includes(tipoRaw)) tipo = 'entrada';
            else if (salidaAliases.includes(tipoRaw)) tipo = 'salida';
            else if (tipoRaw === 'e') tipo = 'entrada';
            else if (tipoRaw === 's') tipo = 'salida';
            else tipo = ''; // no reconocido
            // opcional: log para debug en desarrollo
            // console.debug('tipoRaw -> tipo normalizado', { tipoRaw, tipo });

            // Normalizar cantidad
            const cantidadRaw = payload.cantidad ?? payload.cantidad_raw ?? payload.qty ?? payload.amount;
            const cantidad = cantidadRaw !== undefined && cantidadRaw !== null ? String(cantidadRaw) : '';

            const descripcion = payload.motivo || payload.descripcion || payload.detalle || '';

            // Validaciones antes de enviar
            if (!productoId) {
                toast.error('Producto no especificado.');
                return;
            }
            if (!['entrada', 'salida'].includes(tipo)) {
                toast.error('Tipo inválido. Debe ser "entrada" o "salida".');
                return;
            }
            if (cantidad === '' || Number(cantidad) <= 0 || Number.isNaN(Number(cantidad))) {
                toast.error('Cantidad inválida.');
                return;
            }

            const body = {
                producto: productoId,
                tipo,
                cantidad,
                descripcion,
                usuario: payload.usuario || null,
            };


            const response = await movimientoService.createMovimiento(body);

            // DEBUG: Ver qué devuelve el backend
            console.log('🔍 Respuesta del backend:', response.data);
            console.log('🔍 Producto actualizado:', response.data.producto || response.data.product);

            if (response.status === 201) {
                // Simplemente refrescamos todos los productos para asegurar que la imagen se mantenga
                await fetchProductos();

                if (response.data.warning) toast.success('Movimiento registrado (con advertencia).');
                else toast.success('Movimiento registrado con éxito!');
                return;
            }

            const detail = response.data?.detail || JSON.stringify(response.data);
            toast.error(typeof detail === 'string' ? detail : 'Error al registrar el movimiento.');

        } catch (error) {
            console.error("Error al registrar movimiento ❌", error.response?.data || error.message);
            const respData = error.response?.data;
            // Si backend devolvió info útil a pesar del error, actualizar UI
            if (respData && (respData.producto || respData.movimiento_id || respData.product)) {
                const updatedProduct = respData.producto || respData.product || (respData.producto_id ? { id: respData.producto_id, stock: respData.producto?.stock } : null);
                // Preservar campos existentes (como imagen) y solo actualizar los que vienen del backend
                if (updatedProduct) {
                    setProductos(prev => prev.map(p => {
                        if (p.id === updatedProduct.id) {
                            // Si el backend envía imagen null/vacía, no la sobrescribimos
                            const cleanedUpdate = { ...updatedProduct };
                            if (!cleanedUpdate.imagen) {
                                delete cleanedUpdate.imagen;
                            }
                            return { ...p, ...cleanedUpdate };
                        }
                        return p;
                    }));
                }
                else await fetchProductos();
                toast.success('Movimiento registrado (respuesta incompleta del servidor).');
                return;
            }
            const detail = respData?.detail || respData || error.message;
            toast.error(typeof detail === 'string' ? detail : 'Error al registrar el movimiento.');
        }
    };

    return {
        filtered, modalOpen, form, editId, query, categorias, totalProductos, totalUnidades,
        categoria, // Exportamos el estado de la categoría seleccionada
        imagePreview, originalImageUrl, setModalOpen, setQuery, setCategoria, handleAdd,
        handleEdit, handleDelete, handleSubmit, handleChange, handleImageChange, handleMovimiento,
        fetchProductos,
    };
};
