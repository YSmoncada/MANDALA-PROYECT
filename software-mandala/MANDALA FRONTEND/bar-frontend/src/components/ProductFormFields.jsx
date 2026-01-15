import React from "react";

const commonInputClasses = "w-full p-3 bg-[#2B0D49] border border-[#6C3FA8]/50 rounded-lg text-white focus:ring-2 focus:ring-[#A944FF] outline-none transition-all placeholder:text-gray-500 selection:bg-purple-500/30 autofill:shadow-[0_0_0_30px_#2B0D49_inset] autofill:text-fill-white";

export default function ProductFormFields({ form, onChange, isEditing }) {
    // Función auxiliar para manejar valores de texto y evitar "undefined" o campos en blanco erróneos
    const getValue = (val) => val ?? "";
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="sm:col-span-2">
                <label className="text-xs font-bold text-gray-300 uppercase mb-1 block">Nombre del Producto *</label>
                <input
                    type="text"
                    name="nombre"
                    placeholder="Ej: Aguardiente, cerveza, vino, destilado, coctel, etc."
                    value={getValue(form.nombre)}
                    onChange={onChange}
                    onKeyDown={(e) => {
                        // No prevenir ninguna tecla
                        e.stopPropagation();
                    }}
                    className={commonInputClasses}
                    autoComplete="off"
                    spellCheck="false"
                    inputMode="text"
                    required
                />
            </div>

            {/* Categoría */}
            <div>
                <label className="text-xs font-bold text-gray-300 uppercase mb-1 block">Categoría *</label>
                <select
                    name="categoria"
                    value={getValue(form.categoria)}
                    onChange={onChange}
                    className={`${commonInputClasses} appearance-none [&>option]:bg-[#1A103C] [&>option]:text-white`}
                    required
                >
                    <option value="">Seleccione una categoría</option>
                    <option value="cerveza">Cervezas</option>
                    <option value="vinos">Vinos</option>
                    <option value="destilados">Destilados</option>
                    <option value="cocteles">Cocteles</option>
                    <option value="bebidas">Bebidas</option>
                </select>
            </div>

            {/* Unidad de Medida */}
            <div>
                <label className="text-xs font-bold text-gray-300 uppercase mb-1 block">Unidad de Medida *</label>
                <select
                    name="unidad"
                    value={getValue(form.unidad)}
                    onChange={onChange}
                    className={`${commonInputClasses} appearance-none [&>option]:bg-[#1A103C] [&>option]:text-white`}
                    required
                >
                    <option value="">Seleccione una opción</option>
                    <option value="375ml">Media botella (375 ml)</option>
                    <option value="750ml">Botella estandar (700–750 ml)</option>
                    <option value="1L">botella 1 Litro (1000 ml)</option>
                    <option value="2000 ml">Garrafa (2000 ml)</option>
                    <option value="330ml">Lata (330 ml)</option>
                    <option value="Vidrio 330ml">Vidrio (330 ml)</option>
                </select>
            </div>

            {/* Precio Unitario */}
            <div>
                <label className="text-xs font-bold text-gray-300 uppercase mb-1 block">Precio Unitario *</label>
                <input
                    type="number"
                    name="precio"
                    value={form.precio ?? ""}
                    onChange={(e) => {
                        const val = e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value));
                        onChange({ target: { name: 'precio', value: val } });
                    }}
                    className={commonInputClasses}
                    placeholder="0.00"
                    step="0.01"
                    required
                />
            </div>

            {/* Stock Actual */}
            <div>
                <label className="text-xs font-bold text-gray-300 uppercase mb-1 block">Stock Actual *</label>
                <div className="relative group">
                    <input
                        type="number"
                        name="stock"
                        value={form.stock ?? ""}
                        onChange={(e) => {
                            if (isEditing) return;
                            const val = e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value, 10));
                            onChange({ target: { name: 'stock', value: val } });
                        }}
                        className={`${commonInputClasses} ${isEditing ? 'opacity-50 cursor-not-allowed bg-black/20 text-gray-400' : ''}`}
                        placeholder="0"
                        readOnly={isEditing}
                        title={isEditing ? "El stock se ajusta mediante Movimientos (Botón + en la tabla)" : ""}
                        required={!isEditing}
                    />
                    {isEditing && (
                        <div className="absolute top-full left-0 mt-1 text-[10px] text-purple-400 font-medium animate-fadeIn">
                             Ajustar mediante "Movimientos" en la tabla
                        </div>
                    )}
                </div>
            </div>

            {/* Stock Mínimo */}
            <div className="sm:col-span-2">
                <hr className="border-white/10 my-2" />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-300 uppercase mb-1 block">Stock Mínimo *</label>
                <input
                    type="number"
                    name="stock_minimo"
                    value={form.stock_minimo ?? ""}
                    onChange={(e) => {
                        const val = e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value, 10));
                        onChange({ target: { name: 'stock_minimo', value: val } });
                    }}
                    className={commonInputClasses}
                    placeholder="0"
                    required
                />
            </div>

            {/* Stock Máximo */}
            <div>
                <label className="text-xs font-bold text-gray-300 uppercase mb-1 block">Stock Máximo *</label>
                <input
                    type="number"
                    name="stock_maximo"
                    value={form.stock_maximo ?? ""}
                    onChange={(e) => {
                        const val = e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value, 10));
                        onChange({ target: { name: 'stock_maximo', value: val } });
                    }}
                    className={commonInputClasses}
                    placeholder="0"
                    required
                />
            </div>

            {/* Proveedor */}
            <div className="sm:col-span-2">
                <hr className="border-white/10 my-2" />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-300 uppercase mb-1 block">Proveedor</label>
                <input
                    type="text"
                    name="proveedor"
                    placeholder="Nombre del proveedor"
                    value={getValue(form.proveedor)}
                    onChange={onChange}
                    className={commonInputClasses}
                />
            </div>

            {/* Ubicación en almacén */}
            <div>
                <label className="text-xs font-bold text-gray-300 uppercase mb-1 block">Ubicación en Almacén</label>
                <input
                    type="text"
                    name="ubicacion"
                    placeholder="Ej: Estante A1, Refrigerador B"
                    value={getValue(form.ubicacion)}
                    onChange={onChange}
                    className={commonInputClasses}
                />
            </div>
        </div >
    );
}
