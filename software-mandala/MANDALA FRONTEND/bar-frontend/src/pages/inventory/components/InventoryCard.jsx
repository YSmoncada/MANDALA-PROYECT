import React from "react";
import { Plus } from "lucide-react";
import { UI_CLASSES } from "../../../constants/ui";

const InventoryCard = ({ onAdd }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 border-b border-white/10 pb-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Listado de Productos</h2>
        <p className="text-gray-400 text-sm">Administra tu stock, precios y categorías de productos.</p>
      </div>
      <button
        onClick={onAdd}
        className={UI_CLASSES.buttonPrimary}
      >
        <Plus size={18} />
        <span>Agregar Producto</span>
      </button>
    </div>
  );
};

export default InventoryCard;
