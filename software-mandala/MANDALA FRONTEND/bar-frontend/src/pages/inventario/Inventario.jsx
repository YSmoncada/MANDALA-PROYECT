import React, { useEffect } from "react";
import Header from "../home/Header";
import InventoryCard from "./InventoryCard";
import ProductTableWithModal from "./ProductTable";
import ProductModal from "./ProductModal";
import FiltersSummary from "./FiltersSummary";
import { useInventario } from "../../hooks/useInventario";


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
    originalImageUrl,
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
        originalImageUrl={originalImageUrl}
        editId={editId}
      />
    </div>
  );
}

export default Inventario;
