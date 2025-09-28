import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import InventoryCard from "../components/InventoryCard";
import ProductTableWithModal from "../components/ProductTable";
import ProductModal from "../components/ProductModal";
import FiltersSummary from "../components/FiltersSummary";

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

function Inventario() {
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
      .catch((err) => console.error(err));
  };

  const handleAdd = () => {
    setForm(initialForm);
    setEditId(null);
    setModalOpen(true);
    fetchProductos();
  };

  const handleEdit = (prod) => {
    setForm(prod);
    setEditId(prod.id);
    setModalOpen(true);
    fetchProductos();
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Eliminar producto?")) {
      axios.delete(`${API_URL}${id}/`).then(() => fetchProductos());
    }
    fetchProductos();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      axios.put(`${API_URL}${editId}/`, form).then(() => {
        setModalOpen(false);
        fetchProductos();
      });
    } else {
      axios.post(API_URL, form).then(() => {
        setModalOpen(false);
        fetchProductos();
      });
    }
    fetchProductos();
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    fetchProductos();
  };

  // Categorías dinámicas
  const categorias = {
    lista: [...new Set(productos.map((p) => p.categoria || "Sin categoría"))],
    selected: categoria,
  };

  // Filtrado
  const filtered = productos.filter((p) => {
    const matchNombre = p.nombre.toLowerCase().includes(query.toLowerCase());
    const matchCategoria = categoria ? p.categoria === categoria : true;
    return matchNombre && matchCategoria;
  });

  // Resumen
  const totalProductos = filtered.length;
  const totalUnidades = filtered.reduce(
    (acc, p) => acc + (parseInt(p.stock) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-slate-900 p-8">
      <Header />
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-purple-800 via-indigo-900 to-blue-900 rounded-2xl shadow-lg p-8">
        <InventoryCard onAdd={handleAdd} />

        {/* Filtros + Resumen */}
        <FiltersSummary
          query={query}
          onQueryChange={setQuery}
          categorias={categorias}
          onCategoriaChange={setCategoria}
          totalProductos={totalProductos}
          totalUnidades={totalUnidades}
        />

        {/* Tabla de Productos con Modal para Movimientos */}
        <ProductTableWithModal
          productos={filtered}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMovimiento={(updatedProduct) => {
            setProductos((prev) =>
              prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
            );
            fetchProductos();
          }}
        />
      </div>

      {/* Modal de Productos */}
      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        form={form}
        onChange={handleChange}
        editId={editId}
      />
    </div>
  );
}

export default Inventario;
