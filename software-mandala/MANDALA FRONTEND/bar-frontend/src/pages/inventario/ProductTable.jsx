// src/components/ProductTableWithModal.jsx
import React, { useState } from "react";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import MovimientoModal from "./MovimientoModal";
import { getImageUrl } from "../../utils/imageUtils";

function ProductTableWithModal({ productos, onEdit, onDelete, onMovimiento }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openModal = (prod) => {
    setSelectedProduct(prod);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSubmitMovimiento = (payload) => {
    if (typeof onMovimiento === "function") {
      onMovimiento(payload);
      closeModal();
    }
  };

  return (
    <>
      <div className="mt-6">
        {/* Vista de Escritorio */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300 border-collapse">
            <thead>
              <tr className="text-xs text-gray-400 uppercase border-b-2 border-purple-800">
                <th scope="col" className="px-6 py-4 font-medium">Producto</th>
                <th scope="col" className="px-6 py-4 font-medium">Categoría</th>
                <th scope="col" className="px-6 py-4 font-medium text-center">Stock</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Precio</th>
                <th scope="col" className="px-6 py-4 font-medium text-center">Estado</th>
                <th scope="col" className="px-6 py-4 font-medium text-center">Acciones</th>
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
                productos.map((prod, index) => {
                  const stockBajo = prod.stock <= (prod.stock_minimo || 5);
                  const stockAlto = prod.stock >= (prod.stock_maximo || 50);
                  return (
                    <tr key={prod.id} className="border-b border-purple-900/50 hover:bg-purple-900/20 transition-colors duration-200">
                      <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={getImageUrl(prod.imagen)}
                            alt={prod.nombre}
                            className="w-10 h-10 object-contain rounded-md bg-white p-1"
                            onError={(e) => {
                              // En caso de error, podrías mostrar una imagen por defecto
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/40';
                            }}
                          />
                          <span>{prod.nombre}</span>
                        </div>
                      </th>
                      <td className="px-6 py-4">{prod.categoria}</td>
                      <td className={`px-6 py-4 text-center font-bold ${stockBajo ? 'text-red-400' : 'text-white'}`}>
                        {prod.stock}
                      </td>
                      <td className="px-6 py-4 text-right">
                        ${prod.precio.toLocaleString("es-CO")}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {stockBajo ? (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400">
                            ⚠️ Stock Bajo
                          </span>
                        ) : stockAlto ? (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400">
                            ⚠️ Stock Alto
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                            Disponible
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => openModal(prod)}
                            className="p-1.5 rounded-full text-green-400 hover:bg-green-500/20 hover:text-green-300 transition"
                            title="Registrar Movimiento"
                            aria-label={`Registrar movimiento para ${prod.nombre}`}
                          >
                            <PlusCircle size={20} />
                          </button>
                          <button
                            onClick={() => onEdit && onEdit(prod)}
                            className="p-1.5 rounded-full text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition"
                            title="Editar Producto"
                            aria-label={`Editar ${prod.nombre}`}
                          >
                            <Edit size={20} />
                          </button>
                          <button
                            onClick={() => onDelete && onDelete(prod)}
                            className="p-1.5 rounded-full text-red-500 hover:bg-red-500/20 hover:text-red-400 transition"
                            title="Eliminar Producto"
                            aria-label={`Eliminar ${prod.nombre}`}
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Vista Móvil */}
        <div className="md:hidden space-y-4">
          {productos.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <span className="text-4xl block mb-2">📦</span>
              <p>No se encontraron productos</p>
            </div>
          ) : (
            productos.map((prod) => {
              const stockBajo = prod.stock <= (prod.stock_minimo || 5);
              const stockAlto = prod.stock >= (prod.stock_maximo || 50);

              return (
                <div key={prod.id} className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 shadow-sm">
                  <div className="flex items-start gap-4">
                    <img
                      src={getImageUrl(prod.imagen)}
                      alt={prod.nombre}
                      className="w-16 h-16 object-contain rounded-lg bg-white p-1 flex-shrink-0"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/40';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-lg truncate">{prod.nombre}</h3>
                      <p className="text-purple-300 text-sm mb-1">{prod.categoria}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-white">${prod.precio.toLocaleString("es-CO")}</span>
                        {stockBajo ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400">
                            Stock Bajo
                          </span>
                        ) : stockAlto ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/20 text-yellow-400">
                            Stock Alto
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400">
                            Disponible
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-purple-500/20 pt-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400">Stock Actual</span>
                      <span className={`font-bold text-lg ${stockBajo ? 'text-red-400' : 'text-white'}`}>
                        {prod.stock} u
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(prod)}
                        className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition"
                      >
                        <PlusCircle size={20} />
                      </button>
                      <button
                        onClick={() => onEdit && onEdit(prod)}
                        className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => onDelete && onDelete(prod)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <MovimientoModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmitMovimiento}
        stockActual={selectedProduct?.stock ?? 0}
        producto={selectedProduct ?? { id: null, nombre: "" }}
        productName={selectedProduct?.nombre}
      />
    </>
  );
}

export default ProductTableWithModal;
