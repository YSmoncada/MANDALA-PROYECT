import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import InventoryCard from "./InventoryCard";
import ProductTableWithModal from "./ProductTable";
import ProductModal from "./ProductModal";
import FiltersSummary from "./FiltersSummary";
import { useInventario } from "../../hooks/useInventario";

const Header = () => (
    <div className="text-center mb-10">
        <h1 className="text-5xl md:text-6xl font-black mb-3 text-white">
            Gestión de Inventario
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mx-auto"></div>
    </div>
);

function InventarioDisco() {
    const {
        filtered,
        modalOpen,
        form,
        editId,
        query,
        categorias,
        categoria,
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-8 relative">
            {/* Subtle background effects */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
            </div>

            <button
                onClick={() => navigate("/")}
                className="absolute top-6 left-6 z-50 flex items-center gap-2 rounded-lg bg-[#441E73]/50 border border-[#6C3FA8] px-4 py-2 text-white hover:bg-[#441E73] transition-all backdrop-blur-md shadow-lg hover:scale-105"
            >
                <ArrowLeft size={18} />
                <span className="font-medium">Volver</span>
            </button>

            <Header />


            <div className="relative z-10 max-w-5xl mx-auto bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl shadow-2xl p-8">
                <InventoryCard onAdd={handleAdd} />

                <FiltersSummary
                    query={query}
                    onQueryChange={setQuery}
                    categorias={categorias}
                    categoriaSeleccionada={categoria}
                    onCategoriaChange={setCategoria}
                    totalProductos={totalProductos}
                    totalUnidades={totalUnidades}
                />

                <ProductTableWithModal
                    productos={filtered}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onMovimiento={handleMovimiento}
                />
            </div>

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

export default InventarioDisco;
