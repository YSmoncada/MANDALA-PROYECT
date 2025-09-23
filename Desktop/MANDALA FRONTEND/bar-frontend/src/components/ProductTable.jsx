// src/components/ProductTableWithModal.jsx
import React, { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, Edit, Trash2 } from "lucide-react";
import MovimientoModal from "./MovimientoModal";

function ProductTableWithModal({ productos, onEdit, onDelete, onMovimiento }) {
  // Estado para el modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'entrada' | 'salida'

  // Abrir modal con producto y modo
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

  // Maneja el envío del movimiento desde MovimientoModal
  const handleSubmitMovimiento = (payload) => {
    // payload contiene: { tipo, cantidad, motivo, usuario, producto }
    // Aquí delegas al callback de alto nivel (por ejemplo, API call) pasando producto y datos
    // Puedes adaptar según tu lógica:
    // onMovimiento(payload);
    // Por claridad, mapeo a la forma esperada por tu lógica:
    const data = {
      productoId: payload.producto?.id,
      nombreProducto: payload.producto?.nombre,
      tipo: payload.tipo,
      cantidad: payload.cantidad,
      motivo: payload.motivo,
      usuario: payload.usuario,
    };
    if (typeof onMovimiento === "function") onMovimiento(data);
    closeModal();
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-xl p-6 shadow-inner">
      <table className="w-full">
        <thead>
          <tr className="text-gray-300 text-sm border-b border-purple-700">
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
              <td colSpan={6} className="py-16 text-center text-gray-300">
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
              const stockAlto = prod.stock >= (prod.stock_maximo || 5);
              return (
                <tr
                  key={prod.id}
                  className="border-b border-purple-800 hover:bg-purple-950 transition"
                >
                  {/* Producto */}
                  <td className="py-4 px-2 text-white font-semibold">
                    {prod.nombre}
                  </td>

                  {/* Categoría */}
                  <td className="py-4 px-2 text-gray-300">{prod.categoria}</td>

                  {/* Stock */}
                  <td className="py-4 px-2 text-center text-blue-300 font-bold">
                    {prod.stock}
                  </td>

                  {/* Precio */}
                  <td className="py-4 px-2 text-center text-green-400 font-bold">
                    ${parseFloat(prod.precio).toFixed(2)}
                  </td>

                  {/* Estado */}
                  <td className="py-4 px-2 text-center">
                    {stockBajo ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-700 text-red-200 flex items-center justify-center gap-1">
                        ⚠️ Stock Bajo
                      </span>
                    ) : (
                      stockAlto ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-700 text-green-200">
                        ⚠️ Stock Alto
                      </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-700 text-green-200">
                        Disponible
                        </span>
                      )
                    )}
                  </td>

                  {/* Acciones */}
                  <td className="py-4 px-2 text-center">
                    <div className="flex justify-center gap-3">
                      {/* Entrada */}
                      <button
                        onClick={() => openModal(prod, "entrada")}
                        className="text-green-400 hover:text-green-600 transition"
                        title="Entrada"
                      >
                        <ArrowDownCircle size={22} />
                      </button>

                      {/* Salida */}
                      <button
                        onClick={() => openModal(prod, "salida")}
                        className="text-pink-400 hover:text-pink-600 transition"
                        title="Salida"
                      >
                        <ArrowUpCircle size={22} />
                      </button>

                      {/* Editar */}
                      <button
                        onClick={() => onEdit && onEdit(prod)}
                        className="text-blue-400 hover:text-blue-600 transition"
                        title="Editar"
                      >
                        <Edit size={22} />
                      </button>

                      {/* Eliminar */}
                      <button
                        onClick={() => onDelete && onDelete(prod.id)}
                        className="text-red-400 hover:text-red-600 transition"
                        title="Eliminar"
                      >
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

      {/* Modal Movimiento (Entrada / Salida) */}
      <MovimientoModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmitMovimiento}
        // Valores por defecto/opcionales; puedes pasarlos dinámicamente si lo prefieres
        stockActual={selectedProduct?.stock ?? 200000}
        categoria={selectedProduct?.categoria ?? "Categoría"}
        producto={selectedProduct ?? { id: null, nombre: "" }}
      />
    </div>
  );
}

export default ProductTableWithModal;