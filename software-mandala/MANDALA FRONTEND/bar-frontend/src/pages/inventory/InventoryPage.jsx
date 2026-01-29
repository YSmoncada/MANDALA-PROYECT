import React, { memo } from "react";
import PageLayout from "../../components/PageLayout";
import InventoryCard from "./components/InventoryCard";
import ProductTable from "./components/ProductTable";
import ProductModal from "./components/ProductModal";
import FiltersSummary from "./components/FiltersSummary";
import ConfirmModal from "../../components/ConfirmModal";
import { useInventario } from "../../hooks/useInventario";
import { UI_CLASSES } from "../../constants/ui";

/**
 * InventoryPage handles the complete inventory management UI.
 * Refactored for better performance, scalability and readability.
 */
function InventoryPage() {
    const {
        // Data
        filtered,
        isLoading,
        
        // UI State
        modalOpen,
        deleteConfirmOpen,
        isUploading,
        
        // Form/Edit State
        form,
        editId,
        productToDelete,
        imagePreview,
        originalImageUrl,
        
        // Filters
        query,
        categoria,
        categorias,
        totalProductos,
        totalUnidades,
        
        // Actions
        setModalOpen,
        setDeleteConfirmOpen,
        setQuery,
        setCategoria,
        handleAdd,
        handleEdit,
        handleDelete,
        confirmDelete,
        handleSubmit,
        handleChange,
        handleImageChange,
        handleMovimiento
    } = useInventario();

    return (
        <PageLayout title="Gestión de Inventario">
            {/* Main Content Area */}
            <div className={`${UI_CLASSES.glassCard} p-4 md:p-8`}>
                {/* Header Actions */}
                <InventoryCard onAdd={handleAdd} />

                {/* Filters and Statistics */}
                <FiltersSummary
                    query={query}
                    onQueryChange={setQuery}
                    categorias={categorias}
                    categoriaSeleccionada={categoria}
                    onCategoriaChange={setCategoria}
                    totalProductos={totalProductos}
                    totalUnidades={totalUnidades}
                />

                {/* Product List (Table/Grid) */}
                {isLoading && filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-zinc-800 border-t-white rounded-full animate-spin mb-4"></div>
                        <p className="text-zinc-500 font-bold text-xs tracking-widest uppercase animate-pulse">Cargando inventario...</p>
                    </div>
                ) : (
                    <ProductTable
                        productos={filtered}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onMovimiento={handleMovimiento}
                    />
                )}
            </div>

            {/* Modals and Overlays */}
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

            <ConfirmModal
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="¿Eliminar Producto?"
                message={`¿Estás seguro de que quieres eliminar "${productToDelete?.nombre}"? Esta acción no se puede deshacer y el producto desaparecerá del inventario.`}
                confirmText="Sí, Eliminar"
                cancelText="No, Mantener"
                type="danger"
            />
        </PageLayout>
    );
}

export default memo(InventoryPage);
