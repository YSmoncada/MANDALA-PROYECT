import React, { memo } from 'react';
import { Search, Filter, Package, Database } from 'lucide-react';
import { UI_CLASSES } from '../../../constants/ui';

const FiltersSummary = memo(({
  query,
  onQueryChange,
  categorias,
  categoriaSeleccionada,
  onCategoriaChange,
  totalProductos,
  totalUnidades
}) => {
  return (
    <div className="space-y-6 mb-8">
      {/* Search and Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search Input */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-white transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className={`${UI_CLASSES.input} pl-10 bg-zinc-900 border-zinc-800 focus:border-white/20`}
          />
        </div>

        {/* Category Filter */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-zinc-500 group-focus-within:text-white transition-colors" />
          </div>
          <select
            value={categoriaSeleccionada || "all"}
            onChange={(e) => onCategoriaChange(e.target.value)}
            className={`${UI_CLASSES.select} pl-10 bg-zinc-900 border-zinc-800 focus:border-white/20`}
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'Todas las Categorías' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900/30 border border-white/5 rounded-xl p-4 flex items-center gap-4 transition-all hover:bg-zinc-900/50">
          <div className="p-3 bg-zinc-800 rounded-lg">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{totalProductos}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Total Productos</div>
          </div>
        </div>

        <div className="bg-zinc-900/30 border border-white/5 rounded-xl p-4 flex items-center gap-4 transition-all hover:bg-zinc-900/50">
          <div className="p-3 bg-zinc-800 rounded-lg">
            <Database className="h-6 w-6 text-zinc-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{totalUnidades}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Total Unidades</div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default FiltersSummary;
