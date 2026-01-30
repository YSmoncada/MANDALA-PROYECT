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
    <div className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4 md:p-10 ${UI_CLASSES.fadeIn}`} onClick={onClose}>
      <div className={`${UI_CLASSES.glassCard} bg-white dark:bg-black w-full max-w-2xl relative max-h-[85vh] overflow-y-auto ${UI_CLASSES.scaleIn} shadow-2xl border-zinc-200 dark:border-white/20 transition-colors duration-300`} onClick={handleContentClick}>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="p-2">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 text-center uppercase tracking-tight">
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
            <div className="w-full max-w-md mt-6 flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-zinc-100 dark:bg-rose-500/10 border border-zinc-200 dark:border-rose-500/30 text-zinc-500 dark:text-rose-400 rounded-xl hover:bg-zinc-200 dark:hover:bg-rose-500 hover:text-white transition-all font-black uppercase text-[11px] tracking-[0.2em] active:scale-95"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 px-4 py-3 bg-zinc-900 dark:bg-emerald-500/20 border border-transparent dark:border-emerald-500/50 text-white dark:text-emerald-400 rounded-xl hover:bg-black dark:hover:bg-emerald-500 hover:text-white transition-all font-black uppercase text-[11px] tracking-[0.2em] shadow-xl active:scale-95 flex items-center justify-center gap-2"
              >
                {isSaving && <Loader2 size={16} className="animate-spin" />}
                <span>{isSaving ? 'Guardando...' : (editId ? "Guardar" : "Guardar")}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
