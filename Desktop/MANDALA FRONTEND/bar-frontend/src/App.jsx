import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import InventoryCard from "./components/InventoryCard";
import ProductTable from "./components/ProductTable";
import ProductModal from "./components/ProductModal";
import FiltersSummary from "./components/FiltersSummary"; 

const API_URL = "http://127.0.0.1:8000/api/productos/";
const API_URL_MOVIMIENTOS = "http://127.0.0.1:8000/api/movimientos_productos/";
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
  
  const entradaAux = () => {
    axios.post(`${API_URL_MOVIMIENTOS}`, { producto: 7, tipo_movimiento: 'entrada', cantidad: 10, motivo: 'Stock inicial', usuario: 'Admin' })
      .then(() => {
        fetchProductos();
        alert("Entrada registrada");
      }).catch((e) => alert(e));
  }
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
    setForm({ nombre: prod.nombre, precio: prod.precio, stock: prod.stock, categoria: prod.categoria  });
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
    const motivo = prompt("Motivo de la entrada:");
    const usuario = prompt("Usuario:");

    if (cantidad > 0) {
      axios
        .post(`${API_URL_MOVIMIENTOS}`, { producto: prod.id, tipo_movimiento: 'entrada', cantidad: cantidad, motivo: motivo, usuario: usuario })
        .then(() => {
          fetchProductos();
          alert("Entrada registrada");
        }).catch((e) => alert(e));
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
      <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600" onClick={entradaAux}>Agregar Movimiento</button>
    </div>
    
  );
}

export default App;
