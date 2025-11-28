import React from "react";
import ImageUploader from "../../components/ImageUploader";
import ProductFormFields from "../../components/ProductFormFields";

function ProductModal({ open, onClose, onSubmit, form, onChange, editId, onImageChange, imagePreview, originalImageUrl }) {
  if (!open) return null;

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-[#1A1B2F] w-full max-w-2xl rounded-xl shadow-lg p-8 relative text-white" onClick={handleContentClick}>
        {/* Cerrar */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {editId ? "Editar Producto" : "Nuevo Producto"}
        </h2>

        <form onSubmit={onSubmit} className="grid grid-cols-2 gap-x-6 gap-y-4">
          {/* Imagen del Producto */}
          <ImageUploader
            imagePreview={imagePreview}
            onImageChange={onImageChange}
            editId={editId}
          />

          {/* Campos del Formulario */}
          <ProductFormFields
            form={form}
            onChange={onChange}
          />

          {/* Botones */}
          <div className="col-span-2 flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition"
            >
              {editId ? "Guardar Cambios" : "Guardar Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;
