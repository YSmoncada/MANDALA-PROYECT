import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0D23] to-[#511F86] p-8 relative">
      <Header />
      <button
        onClick={() => navigate("/")}
        className="absolute top-30 left-8 flex items-center gap-2 text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Volver al Inicio</span>
      </button>

      <div className="max-w-5xl mx-auto border border-[#6C3FA8] rounded-2xl shadow-lg p-8">
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
