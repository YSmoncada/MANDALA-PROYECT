// src/components/ProductTableWithModal.jsx
import React, { useState } from "react";
import axios from "axios";
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
    <>
      <div className="overflow-x-auto mt-6">
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
                        <button onClick={() => openModal(prod)} className="p-1.5 rounded-full text-green-400 hover:bg-green-500/20 hover:text-green-300 transition" title="Registrar Movimiento">
                          <PlusCircle size={20} />
                        </button>
                        <button onClick={() => onEdit && onEdit(prod)} className="p-1.5 rounded-full text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition" title="Editar Producto">
                          <Edit size={20} />
                        </button>
                        <button onClick={() => onDelete && onDelete(prod.id)} className="p-1.5 rounded-full text-red-500 hover:bg-red-500/20 hover:text-red-400 transition" title="Eliminar Producto">
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
