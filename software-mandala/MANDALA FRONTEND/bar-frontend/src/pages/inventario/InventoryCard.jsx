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
        className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#6C3FA8] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#5A328E] transition-all shadow-lg min-w-[180px]"
      >
        <Plus size={18} />
        <span>Agregar Producto</span>
      </button>
    </div>
  );
}