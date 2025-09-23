function InventoryCard({ onAdd }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold"> <span className="text-white">Gestión de Inventario</span></h2>
        <p className="text-gray-300">Administra, edita y elimina productos.</p>
      </div>
      <button
        onClick={onAdd}
        className="bg-gradient-to-r from-purple-900 to-purple-900 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-pink-600 hover:to-purple-600 transition"
      >
        + Agregar Producto
      </button>
    </div>
  );
}
export default InventoryCard;