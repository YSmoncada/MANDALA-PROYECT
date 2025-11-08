import React from "react";
import { Search } from "lucide-react";

function FiltersSummary({
  query = '',
  onQueryChange = () => { },
  categoriaSeleccionada = '', // Renombrado para mayor claridad
  categorias = [], // Ahora es un array simple
  onCategoriaChange = () => { },
  totalProductos = 0,
  totalUnidades = 0
}) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      {/* Barra de búsqueda */}
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre del producto..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-600 bg-opacity-80 text-white placeholder-gray-300 focus:outline-none focus:ring-0 border-0"
        />
      </div>

      {/* Selector de categoría */}
      <div>
        <select
          value={categoriaSeleccionada}
          onChange={(e) => onCategoriaChange(e.target.value)}
          className="px-4 py-3 rounded-lg bg-gray-600 bg-opacity-80 text-white focus:outline-none focus:ring-0 border-0 cursor-pointer min-w-[200px]"
        >
          <option value="all">Todas las categorías</option>
          {categorias.filter(cat => cat && cat !== 'all').map((cat, i) => (
            <option key={i} value={cat.toString()}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Contadores */}
      <div className="flex gap-8">
        {/* Contador de productos */}
        <div className="text-center">
          <div className="text-3xl font-bold text-white">
            {(totalProductos || 0)}
          </div>
          <div className="text-sm text-gray-300">
            Productos
          </div>
        </div>

        {/* Contador de unidades */}
        <div className="text-center">
          <div className="text-3xl font-bold text-white">
            {(totalUnidades || 0)}
          </div>
          <div className="text-sm text-gray-300">
            Unidades
          </div>
        </div>
      </div>
    </div>
  );
}
export default FiltersSummary;