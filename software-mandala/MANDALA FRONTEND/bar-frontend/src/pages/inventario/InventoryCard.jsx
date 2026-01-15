import { Plus } from "lucide-react";

export default function InventoryCard({ onAdd }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Inventario de Productos</h1>
        <p className="text-sm md:text-base text-gray-400">
          Gestiona las entradas, salidas y stock de tus productos.
        </p>
      </div>
      <button
        onClick={onAdd}
        className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black py-3 px-6 rounded-xl hover:scale-105 hover:shadow-cyan-500/25 transition-all duration-300 shadow-xl shadow-cyan-900/20 group"
      >
        <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" />
        <span className="tracking-wide">AGREGAR PRODUCTO</span>
      </button>
    </div>
  );
}