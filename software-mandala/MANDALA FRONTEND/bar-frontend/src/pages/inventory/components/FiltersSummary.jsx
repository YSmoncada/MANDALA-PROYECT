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
    <div className="space-y-8 mb-10 transition-all duration-500">
      {/* Search and Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Search Input */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#8A7BAF] dark:text-zinc-600 group-focus-within:text-[#A944FF] dark:group-focus-within:text-white transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Buscar productos por nombre..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-[#0E0D23] dark:bg-black/40 border-2 border-[#6C3FA8]/30 dark:border-white/5 text-white dark:text-white placeholder-[#8A7BAF]/30 dark:placeholder-zinc-800 rounded-2xl focus:border-[#A944FF] dark:focus:border-white outline-none transition-all uppercase tracking-widest text-[10px] font-black"
          />
        </div>

        {/* Category Filter */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-[#8A7BAF] dark:text-zinc-600 group-focus-within:text-[#A944FF] dark:group-focus-within:text-white transition-colors" />
          </div>
          <select
            value={categoriaSeleccionada || "all"}
            onChange={(e) => onCategoriaChange(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-[#0E0D23] dark:bg-black/40 border-2 border-[#6C3FA8]/30 dark:border-white/5 text-white dark:text-white rounded-2xl focus:border-[#A944FF] dark:focus:border-white outline-none transition-all uppercase tracking-widest text-[10px] font-black appearance-none"
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat} className="bg-[#1A103C] dark:bg-zinc-900 text-white">
                {cat === 'all' ? 'Todas las Categorías' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-[#1A103C]/80 dark:bg-zinc-900/30 border border-white/10 dark:border-white/5 rounded-3xl p-6 flex items-center gap-6 transition-all hover:bg-[#2B0D49] dark:hover:bg-zinc-900/50 shadow-2xl dark:shadow-none relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#A944FF] to-transparent opacity-50"></div>
          <div className="p-4 bg-[#0E0D23] dark:bg-zinc-800 rounded-2xl border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
            <Package className="h-6 w-6 text-[#A944FF] dark:text-white" />
          </div>
          <div>
            <div className="text-3xl font-black text-white dark:text-white tracking-tighter italic">{totalProductos}</div>
            <div className="text-[10px] text-[#8A7BAF] dark:text-zinc-500 uppercase tracking-[0.2em] font-black">Total Productos</div>
          </div>
        </div>

        <div className="bg-[#1A103C]/80 dark:bg-zinc-900/30 border border-white/10 dark:border-white/5 rounded-3xl p-6 flex items-center gap-6 transition-all hover:bg-[#2B0D49] dark:hover:bg-zinc-900/50 shadow-2xl dark:shadow-none relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#A944FF] to-transparent opacity-50"></div>
          <div className="p-4 bg-[#0E0D23] dark:bg-zinc-800 rounded-2xl border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
            <Database className="h-6 w-6 text-emerald-400 dark:text-zinc-400" />
          </div>
          <div>
            <div className="text-3xl font-black text-white dark:text-white tracking-tighter italic">{totalUnidades}</div>
            <div className="text-[10px] text-[#8A7BAF] dark:text-zinc-500 uppercase tracking-[0.2em] font-black">Total Unidades</div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default FiltersSummary;
