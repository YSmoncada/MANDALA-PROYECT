import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import InventoryCard from "./components/InventoryCard";
import ProductTable from "./components/ProductTable";
import ProductModal from "./components/ProductModal";
import FiltersSummary from "./components/FiltersSummary"; 

const API_URL = "http://127.0.0.1:8000/api/productos/";
const initialForm = { nombre: "", precio: "", stock: "" };

function App() {
  const [productos, setProductos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);

  // Estados para filtros
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
  };

  const handleEdit = (prod) => {
    setForm({ nombre: prod.nombre, precio: prod.precio, stock: prod.stock });
    setEditId(prod.id);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Eliminar producto?")) {
      axios.delete(`${API_URL}${id}/`).then(() => fetchProductos());
    }
  };
  const handleEntrada = (prod) => {
    const cantidad = parseInt(prompt("Cantidad de entrada:"));
    if (cantidad > 0) {
      axios
        .patch(`${API_URL}${prod.id}/`, { stock: prod.stock + cantidad })
        .then(() => fetchProductos());
    }
  };

  const handleSalida = (prod) => {
    const cantidad = parseInt(prompt("Cantidad de salida:"));
    if (cantidad > 0 && prod.stock - cantidad >= 0) {
      axios
        .patch(`${API_URL}${prod.id}/`, { stock: prod.stock - cantidad })
        .then(() => fetchProductos());
    } else {
      alert("Stock insuficiente");
    }
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
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Categorías dinámicas
  const categorias = {
    lista: [...new Set(productos.map((p) => p.categoria || "Sin categoría"))],
    selected: categoria,
  };

  // ✅ Filtrado
  const filtered = productos.filter((p) => {
    const matchNombre = p.nombre.toLowerCase().includes(query.toLowerCase());
    const matchCategoria = categoria ? p.categoria === categoria : true;
    return matchNombre && matchCategoria;
  });

  // ✅ Resumen
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

        {/* ✅ Nuevo componente de filtros y resumen */}
        <FiltersSummary
          query={query}
          onQueryChange={setQuery}
          categorias={categorias}
          onCategoriaChange={setCategoria}
          totalProductos={totalProductos}
          totalUnidades={totalUnidades}
        />

        <ProductTable
          productos={filtered}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onEntrada={handleEntrada}
          onSalida={handleSalida}
        />
      </div>

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

export default App;
