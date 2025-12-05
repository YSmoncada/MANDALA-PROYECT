import React, { useState } from "react";
import ImageUploader from "../../components/ImageUploader";
import ProductFormFields from "../../components/ProductFormFields";
import { Loader2 } from "lucide-react";

function ProductModal({ open, onClose, onSubmit, form, onChange, editId, onImageChange, imagePreview, originalImageUrl }) {
  if (!open) return null;

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSubmit(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-[#1A103C] border border-[#6C3FA8] rounded-2xl shadow-2xl w-full max-w-4xl relative max-h-[90vh] overflow-y-auto" onClick={handleContentClick}>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            {editId ? "Editar Producto" : "Agregar Nuevo Producto"}
          </h2>

          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna de Imagen */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center">
              <label className="text-xs text-white font-bold uppercase mb-2 block w-full text-center">Imagen del Producto</label>
              <ImageUploader
                imagePreview={imagePreview}
                onImageChange={onImageChange}
                editId={editId}
              />
            </div>

            {/* Columna de Campos */}
            <div className="lg:col-span-2">
              <ProductFormFields
                form={form}
                onChange={onChange}
              />
            </div>

            {/* Botones de Acción (abarcan todo el ancho) */}
            <div className="lg:col-span-3 mt-4 flex justify-end gap-4">
              <button type="button" onClick={onClose} className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] text-white font-bold rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed min-w-[180px]"
              >
                {isSaving && <Loader2 size={16} className="animate-spin" />}
                {isSaving ? 'Guardando...' : (editId ? "Guardar Cambios" : "Guardar Producto")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
