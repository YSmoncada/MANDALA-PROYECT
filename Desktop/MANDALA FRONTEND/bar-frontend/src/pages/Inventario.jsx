import React, { useEffect } from "react";
import Header from "../components/Header";
import InventoryCard from "../components/InventoryCard";
import ProductTableWithModal from "../components/ProductTable";
import ProductModal from "../components/ProductModal";
import FiltersSummary from "../components/FiltersSummary";
import { useInventario } from "./useInventario";


function Inventario() {
  const {
    filtered,
    modalOpen,
    form,
    editId,
    query,
    categorias,
    totalProductos,
    totalUnidades,
    imagePreview,
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
  } = useInventario();
  useEffect(() => {
    fetchProductos();
  }, []); // Cargar productos al montar el componente

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
          onMovimiento={handleMovimiento}
        />
      </div>

      {/* Modal de Productos */}
      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        form={form}
        onChange={handleChange}
        onImageChange={handleImageChange}
        imagePreview={imagePreview}
        editId={editId}
      />
    </div>
  );
}

export default Inventario;
