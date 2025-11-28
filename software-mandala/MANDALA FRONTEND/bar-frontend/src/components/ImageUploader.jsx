import React from "react";
import { getImageUrl } from "../utils/imageUtils";

/**
 * Componente para cargar y previsualizar imágenes de productos
 */
export default function ImageUploader({ imagePreview, onImageChange, editId }) {
    return (
        <div className="col-span-2">
            <label className="text-sm block mb-1">
                Imagen del Producto <span className="text-gray-500">(Opcional)</span>
            </label>
            <div className="flex items-center gap-4">
                <input
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    className="w-full bg-transparent border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-pink-600 file:text-white file:cursor-pointer hover:file:bg-pink-700"
                />
                {imagePreview && (
                    <div className="flex-shrink-0 relative">
                        <img
                            src={imagePreview.startsWith('data:') ? imagePreview : getImageUrl(imagePreview)}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded-lg border border-gray-600"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                // Crear evento personalizado para limpiar imagen
                                const clearEvent = { target: { files: [] } };
                                onImageChange(clearEvent);
                                // Limpiar el input file
                                const fileInput = document.querySelector('input[type="file"]');
                                if (fileInput) fileInput.value = '';
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition"
                            title={editId ? "Restaurar imagen original" : "Quitar imagen"}
                        >
                            ×
                        </button>
                    </div>
                )}
            </div>
            <p className="text-xs text-gray-400 mt-1">
                {editId
                    ? "Selecciona una nueva imagen solo si quieres cambiarla"
                    : "Opcional: selecciona una imagen (JPEG, PNG, GIF, WebP - máx 5MB)"}
            </p>
        </div>
    );
}
