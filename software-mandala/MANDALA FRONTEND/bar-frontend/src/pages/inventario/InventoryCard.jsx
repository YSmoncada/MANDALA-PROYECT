import { Plus } from "lucide-react";

export default function InventoryCard({ onAdd }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Inventario de Productos</h1>
        <p className="text-gray-400">
          Gestiona las entradas, salidas y stock de tus productos.
        </p>
      </div>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 bg-purple-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20"
      >
        <Plus size={20} />
        <span>Agregar Producto</span>
      </button>
    </div>
  );
}