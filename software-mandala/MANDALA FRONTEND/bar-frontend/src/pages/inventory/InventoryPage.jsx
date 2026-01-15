import React from "react";
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
 */
function InventoryPage() {
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
        deleteConfirmOpen, 
        setDeleteConfirmOpen, 
        productToDelete, 
        confirmDelete
    } = useInventario();

    return (
        <PageLayout title="Gestión de Inventario">
            {/* Main Content Area */}
            <div className={UI_CLASSES.glassCard}>
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

                <ProductTable
                    productos={filtered}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onMovimiento={handleMovimiento}
                />
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

export default InventoryPage;
