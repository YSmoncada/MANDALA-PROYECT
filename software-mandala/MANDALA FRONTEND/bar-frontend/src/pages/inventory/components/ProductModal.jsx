import React, { useState } from "react";
import ImageUploader from "../../../components/ImageUploader";
import ProductFormFields from "../../../components/ProductFormFields";
import { Loader2, X } from "lucide-react";
import { UI_CLASSES } from "../../../constants/ui";

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
    <div className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${UI_CLASSES.fadeIn}`} onClick={onClose}>
      <div className={`${UI_CLASSES.glassCard} bg-[#1A103C] w-full max-w-2xl relative max-h-[90vh] overflow-y-auto ${UI_CLASSES.scaleIn}`} onClick={handleContentClick}>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="p-2">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {editId ? "Editar Producto" : "Agregar Nuevo Producto"}
          </h2>

          <form onSubmit={handleFormSubmit} className="flex flex-col items-center gap-6">
            <div>
              <ImageUploader
                imagePreview={imagePreview}
                onImageChange={onImageChange}
                editId={editId}
              />
            </div>

            {/* Form Fields */}
            <div className="w-full max-w-md">
                <ProductFormFields
                form={form}
                onChange={onChange}
                isEditing={!!editId}
              />
            </div>

            {/* Action Buttons */}
            <div className="w-full max-w-md mt-4 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button type="button" onClick={onClose} className={UI_CLASSES.buttonSecondary}>
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className={UI_CLASSES.buttonPrimary}
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
