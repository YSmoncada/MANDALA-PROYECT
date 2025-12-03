import React from "react";
import ImageUploader from "../../components/ImageUploader";
import ProductFormFields from "../../components/ProductFormFields";

function ProductModal({ open, onClose, onSubmit, form, onChange, editId, onImageChange, imagePreview, originalImageUrl }) {
  if (!open) return null;

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
      <div className="bg-[#1A1B2F] w-full max-w-2xl rounded-xl shadow-2xl p-6 md:p-8 relative text-white max-h-[90vh] overflow-y-auto" onClick={handleContentClick}>
        {/* Cerrar */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800/50 rounded-full p-1 transition-colors"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <h2 className="text-xl md:text-2xl font-bold mb-6 pr-8">
          {editId ? "Editar Producto" : "Nuevo Producto"}
        </h2>

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Imagen del Producto */}
          <div className="md:col-span-1 flex justify-center md:block">
            <ImageUploader
              imagePreview={imagePreview}
              onImageChange={onImageChange}
              editId={editId}
            />
          </div>

          {/* Campos del Formulario */}
          <div className="md:col-span-1 space-y-4">
            <ProductFormFields
              form={form}
              onChange={onChange}
            />
          </div>

          {/* Botones */}
          <div className="col-span-1 md:col-span-2 flex flex-col-reverse md:flex-row justify-end gap-3 md:gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 md:py-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 md:py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition font-bold text-center"
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
