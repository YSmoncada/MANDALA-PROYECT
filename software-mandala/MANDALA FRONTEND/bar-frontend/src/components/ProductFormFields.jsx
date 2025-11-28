import React from "react";

/**
 * Componente que agrupa todos los campos del formulario de producto
 */
export default function ProductFormFields({ form, onChange }) {
    return (
        <>
            {/* Nombre */}
            <div className="col-span-1">
                <label className="text-sm block mb-1">Nombre del Producto *</label>
                <input
                    type="text"
                    name="nombre"
                    placeholder="Ej: Whisky Jack Daniels"
                    value={form.nombre}
                    onChange={(e) => {
                        const { name, value } = e.target;
                        // Solo permite letras y espacios
                        const filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
                        // Llama al onChange original con el valor filtrado
                        onChange({ target: { name, value: filteredValue } });
                    }}
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
                    onChange={(e) => {
                        const { name, value } = e.target;
                        const filteredValue = value.replace(/[^0-9]/g, '');
                        onChange({ target: { name, value: filteredValue } });
                    }}
                    className="w-full bg-transparent border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    min={parseInt(form.stock_minimo, 10) || 0}
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
                    onChange={(e) => {
                        const { name, value } = e.target;
                        const filteredValue = value.replace(/[^0-9]/g, '');
                        onChange({ target: { name, value: filteredValue } });
                    }}
                    className="w-full bg-transparent border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    min="0"
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
                    onChange={(e) => {
                        const { name, value } = e.target;
                        const filteredValue = value.replace(/[^0-9]/g, '');
                        onChange({ target: { name, value: filteredValue } });
                    }}
                    className="w-full bg-transparent border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    min={parseInt(form.stock_minimo || 0, 10) + 1}
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
                    onChange={(e) => {
                        const { name, value } = e.target;
                        const filteredValue = value.replace(/[^0-9]/g, '');
                        onChange({ target: { name, value: filteredValue } });
                    }}
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
        </>
    );
}
