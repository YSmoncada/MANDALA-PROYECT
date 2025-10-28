// src/components/ProductTableWithModal.jsx
import React, { useState } from "react";
import axios from "axios";
import { ArrowDownCircle, ArrowUpCircle, Edit, Trash2 } from "lucide-react";
import MovimientoModal from "./MovimientoModal";
import { getImageUrl } from "../../utils/imageUtils";

function ProductTableWithModal({ productos, onEdit, onDelete, onMovimiento }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState(null);

  const openModal = (prod, mode) => {
    setSelectedProduct(prod);
    setModalMode(mode);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
    setModalMode(null);
  };

  const handleSubmitMovimiento = async (payload) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/movimientos/", {
        tipo: payload.tipo,
        cantidad: payload.cantidad,
        motivo: payload.motivo,
        usuario: payload.usuario,
        producto: payload.producto?.id,
      });

      const updatedProduct = response.data.producto;
      if (typeof onMovimiento === "function") {
        onMovimiento(updatedProduct);
      }

      closeModal();
    } catch (error) {
      console.error("Error al registrar movimiento ❌", error.response?.data || error.message);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-xl p-6 shadow-inner">
      <table className="w-full">
        <thead>
          <tr className="text-gray-300 text-sm border-b border-purple-700">
            <th className="py-4 px-2 text-left">Imagen</th>
            <th className="py-4 px-2 text-left">Producto</th>
            <th className="py-4 px-2 text-left">Categoría</th>
            <th className="py-4 px-2 text-center">Stock Actual</th>
            <th className="py-4 px-2 text-center">Precio</th>
            <th className="py-4 px-2 text-center">Estado</th>
            <th className="py-4 px-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-16 text-center text-gray-300">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-5xl">📦</span>
                  <span className="text-lg font-bold text-white">
                    No se encontraron productos
                  </span>
                  <span className="text-sm text-gray-400">
                    Comienza agregando tu primer producto
                  </span>
                </div>
              </td>
            </tr>
          ) : (
            productos.map((prod) => {
              const stockBajo = prod.stock <= (prod.stock_minimo || 5);
              const stockAlto = prod.stock >= (prod.stock_maximo || 50);
              return (
                <tr key={prod.id} className="border-b border-purple-800 hover:bg-purple-950 transition">
                  <td className="py-4 px-2">
                    {prod.imagen ? (
                      <img
                        src={getImageUrl(prod.imagen)}
                        alt={prod.nombre}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-600"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    {!prod.imagen && (
                      <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                        Sin img
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-2 text-white font-semibold">{prod.nombre}</td>
                  <td className="py-4 px-2 text-gray-300">{prod.categoria}</td>
                  <td className="py-4 px-2 text-center text-blue-300 font-bold">{prod.stock}</td>
                  <td className="py-4 px-2 text-center text-green-400 font-bold">
                    ${parseFloat(prod.precio).toFixed(2)}
                  </td>
                  <td className="py-4 px-2 text-center">
                    {stockBajo ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-700 text-red-200">
                        ⚠️ Stock Bajo
                      </span>
                    ) : stockAlto ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-700 text-green-200">
                        ⚠️ Stock Alto
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-700 text-green-200">
                        Disponible
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-2 text-center">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => openModal(prod, "entrada")} className="text-green-400 hover:text-green-600 transition">
                        <ArrowDownCircle size={22} />
                      </button>
                      <button onClick={() => openModal(prod, "salida")} className="text-pink-400 hover:text-pink-600 transition">
                        <ArrowUpCircle size={22} />
                      </button>
                      <button onClick={() => onEdit && onEdit(prod)} className="text-blue-400 hover:text-blue-600 transition">
                        <Edit size={22} />
                      </button>
                      <button onClick={() => onDelete && onDelete(prod.id)} className="text-red-400 hover:text-red-600 transition">
                        <Trash2 size={22} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <MovimientoModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmitMovimiento}
        stockActual={selectedProduct?.stock ?? 0}
        categoria={selectedProduct?.categoria ?? "Categoría"}
        producto={selectedProduct ?? { id: null, nombre: "" }}
        tipo={modalMode} // 👈 para diferenciar entrada/salida
      />
    </div>
  );
}

export default ProductTableWithModal;
