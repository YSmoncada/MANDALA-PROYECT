import React from "react";
import { UI_CLASSES } from "../constants/ui";

export default function ProductFormFields({ form, onChange, isEditing }) {
    // Función auxiliar para manejar valores de texto y evitar "undefined" o campos en blanco erróneos
    const getValue = (val) => val ?? "";
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="sm:col-span-2">
                <label className="text-xs font-bold text-zinc-500 dark:text-gray-300 uppercase mb-1 block">Nombre del Producto *</label>
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
                    className={UI_CLASSES.input}
                    autoComplete="off"
                    spellCheck="false"
                    inputMode="text"
                    required
                />
            </div>

            {/* Categoría */}
            <div>
                <label className="text-xs font-bold text-zinc-500 dark:text-gray-300 uppercase mb-1 block">Categoría *</label>
                <select
                    name="categoria"
                    value={getValue(form.categoria)}
                    onChange={onChange}
                    className={`${UI_CLASSES.select} appearance-none`}
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
                <label className="text-xs font-bold text-zinc-500 dark:text-gray-300 uppercase mb-1 block">Unidad de Medida *</label>
                <select
                    name="unidad"
                    value={getValue(form.unidad)}
                    onChange={onChange}
                    className={`${UI_CLASSES.select} appearance-none`}
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
                <label className="text-xs font-bold text-zinc-500 dark:text-gray-300 uppercase mb-1 block">Precio Unitario *</label>
                <input
                    type="number"
                    name="precio"
                    value={form.precio ?? ""}
                    onChange={onChange}
                    className={UI_CLASSES.input}
                    placeholder="0.00"
                    step="0.01"
                    required
                />
            </div>

            {/* Stock Actual */}
            <div>
                <label className="text-xs font-bold text-zinc-500 dark:text-gray-300 uppercase mb-1 block">Stock Actual *</label>
                <div className="relative group">
                    <input
                        type="number"
                        name="stock"
                        value={form.stock ?? ""}
                        onChange={onChange}
                        className={`${UI_CLASSES.input} ${isEditing ? 'opacity-50 cursor-not-allowed bg-zinc-100 dark:bg-black/20 text-zinc-400 dark:text-gray-400' : ''}`}
                        placeholder="0"
                        readOnly={isEditing}
                        title={isEditing ? "El stock se ajusta mediante Movimientos (Botón + en la tabla)" : ""}
                        required={!isEditing}
                    />
                    {isEditing && (
                        <div className="absolute top-full left-0 mt-1 text-[10px] text-zinc-400 dark:text-purple-400 font-medium animate-fadeIn">
                             Ajustar mediante "Movimientos" en la tabla
                        </div>
                    )}
                </div>
            </div>

            {/* Stock Mínimo */}
            <div className="sm:col-span-2">
                <hr className="border-zinc-100 dark:border-white/10 my-2" />
            </div>
            <div>
                <label className="text-xs font-bold text-zinc-500 dark:text-gray-300 uppercase mb-1 block">Stock Mínimo *</label>
                <input
                    type="number"
                    name="stock_minimo"
                    value={form.stock_minimo ?? ""}
                    onChange={onChange}
                    className={UI_CLASSES.input}
                    placeholder="0"
                    required
                />
            </div>

            {/* Stock Máximo */}
            <div>
                <label className="text-xs font-bold text-zinc-500 dark:text-gray-300 uppercase mb-1 block">Stock Máximo *</label>
                <input
                    type="number"
                    name="stock_maximo"
                    value={form.stock_maximo ?? ""}
                    onChange={onChange}
                    className={UI_CLASSES.input}
                    placeholder="0"
                    required
                />
            </div>

            {/* Proveedor */}
            <div className="sm:col-span-2">
                <hr className="border-zinc-100 dark:border-white/10 my-2" />
            </div>
            <div>
                <label className="text-xs font-bold text-zinc-500 dark:text-gray-300 uppercase mb-1 block">Proveedor</label>
                <input
                    type="text"
                    name="proveedor"
                    placeholder="Nombre del proveedor"
                    value={getValue(form.proveedor)}
                    onChange={onChange}
                    className={UI_CLASSES.input}
                />
            </div>

            {/* Ubicación en almacén */}
            <div>
                <label className="text-xs font-bold text-zinc-500 dark:text-gray-300 uppercase mb-1 block">Ubicación en Almacén</label>
                <input
                    type="text"
                    name="ubicacion"
                    placeholder="Ej: Estante A1, Refrigerador B"
                    value={getValue(form.ubicacion)}
                    onChange={onChange}
                    className={UI_CLASSES.input}
                />
            </div>
        </div >
    );
}
