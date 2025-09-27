import React from "react";

function ProductModal({ open, onClose, onSubmit, form, onChange, editId }) {
  if (!open) return null;

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50" onClick={onClose}>
      <div className="bg-[#1A1B2F] w-full max-w-2xl rounded-xl shadow-lg p-8 relative text-white" onClick={handleContentClick}>
        {/* Cerrar */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          
        </button>
 
        <h2 className="text-2xl font-bold mb-6">
          {editId ? "Editar Producto" : "Nuevo Producto"}
        </h2>

        <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
          {/* Nombre */}
          <div className="col-span-1">
            <label className="text-sm block mb-1">Nombre del Producto *</label>
            <input
              type="text"
              name="nombre"
              placeholder="Ej: Whisky Jack Daniels"
              value={form.nombre}
              onChange={onChange}
              className="w-full bg-transparent border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          {/* Categoría */}
          <div className="col-span-1">
            <label className="text-sm block mb-1">Categoría *</label>
            <select
              name="categoria"
              value={form.categoria}
              onChange={onChange}
              className="w-full bg-gray-600 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            >
              <option value="">Seleccionar categoría</option>
              <option>destilados</option>
              <option>cerveza</option>
              <option>vinos</option>
            </select>
          </div>

          {/* Stock Actual */}
          <div>
            <label className="text-sm block mb-1">Stock Actual *</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={onChange}
              className="w-full bg-transparent border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          {/* Stock Mínimo */}
          <div>
            <label className="text-sm block mb-1">Stock Mínimo *</label>
            <input
              type="number"
              name="stock_minimo"
              value={form.stock_minimo || ""}
              onChange={onChange}
              className="w-full bg-transparent border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          {/* Stock Máximo */}
          <div>
            <label className="text-sm block mb-1">Stock Máximo *</label>
            <input
              type="number"
              name="stock_maximo"
              value={form.stock_maximo || ""}
              onChange={onChange}
              className="w-full bg-transparent border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          {/* Precio Unitario */}
          <div>
            <label className="text-sm block mb-1">Precio Unitario *</label>
            <input
              type="number"
              name="precio"
              value={form.precio}
              onChange={onChange}
              className="w-full bg-transparent border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          {/* Unidad de Medida */}
          <div>
            <label className="text-sm block mb-1">Unidad de Medida *</label>
            <select
              name="unidad"
              value={form.unidad || ""}
              onChange={onChange}
              className="w-full bg-gray-600 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            >
              <option value="">Seleccione una opción</option>
              <option value="375ml">Media botella (375 ml)</option>
              <option value="750ml">Botella estandar (700–750 ml)</option>
              <option value="1L">botella 1 Litro (1000 ml)</option>
              <option value="2000 ml">Garrafa (2000 ml)</option>
              <option value="330ml">Lata (330 ml)</option>
              <option value="330ml">Vidrio (330 ml)</option>
            </select>
          </div>


          {/* Proveedor */}
          <div>
            <label className="text-sm block mb-1">Proveedor</label>
            <input
              type="text"
              name="proveedor"
              placeholder="Nombre del proveedor"
              value={form.proveedor || ""}
              onChange={onChange}
              className="w-full bg-transparent border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Ubicación en almacén */}
          <div>
            <label className="text-sm block mb-1">Ubicación en Almacén</label>
            <input
              type="text"
              name="ubicacion"
              placeholder="Ej: Estante A1, Refrigerador B"
              value={form.ubicacion || ""}
              onChange={onChange}
              className="w-full bg-transparent border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

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
