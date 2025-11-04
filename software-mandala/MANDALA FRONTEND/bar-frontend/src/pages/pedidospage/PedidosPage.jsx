// src/pages/PedidosPage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HeaderPedidos from "./HeaderPedidos"; // Asumo que este componente existe
import { usePedido } from "../../hooks/usePedido"; // Importamos el nuevo hook
import toast from 'react-hot-toast'; // Importamos la librería de notificaciones


export default function PedidosPage({
  auth, // Recibimos la prop 'auth'
  orderItems,
  onClearOrder,
  onUpdateCantidad,
  onRemoveItem,
}) {
  const { // Desestructuramos desde la prop 'auth'
    mesera,
    meseraId,
    codigoConfirmado,
    isInitialized,
    meseras,
    handleSelectMesera,
    handleCodigoSubmit,
    handleLogout,
  } = auth;

  const navigate = useNavigate();
  const { mesas, selectedMesaId, setSelectedMesaId, isLoading, finalizarPedido } = usePedido();


  const totalPedido = orderItems.reduce(
    (total, item) => total + item.producto.precio * item.cantidad,
    0
  );

  // Verificar autenticación solo después de la inicialización
  useEffect(() => {
    if (!isInitialized) return; // Esperar a que se inicialice

    if (!mesera || !codigoConfirmado) {
      navigate('/login', { replace: true });
    }
  }, [isInitialized, mesera, codigoConfirmado, navigate]);

  const handleFinalizarPedido = async () => {
    if (orderItems.length === 0) {
      alert("No hay productos en el pedido para finalizar.");
      return;
    }

    if (!meseraId) {
      alert("Error: No se pudo verificar la identidad de la mesera. Por favor, intente iniciar sesión de nuevo.");
      return;
    }

    // Validar que una mesa esté seleccionada
    if (!selectedMesaId) {
      alert("Por favor, seleccione una mesa.");
      return;
    }

    // Formatear los productos para el backend
    const productosParaBackend = orderItems.map(item => ({
      producto_id: item.producto.id,
      cantidad: item.cantidad,
    }));

    const pedidoData = {
      mesera: meseraId,
      mesa: selectedMesaId,
      estado: "activa", // Estado inicial del pedido
      productos: productosParaBackend, // Ahora contiene 'producto_id'
      // El campo 'total' se calculará en el backend, no lo enviamos desde aquí.
    };

    const result = await finalizarPedido(pedidoData);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }

    if (result.success) {
      onClearOrder(); // Limpiar el pedido del estado del frontend
      navigate('/login'); // Redirigir a la página de inicio de sesión o donde sea apropiado
    }
  };

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0E0D23] to-[#511F86]">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no hay mesera autenticada, no mostrar nada (se está redirigiendo)
  if (!mesera || !codigoConfirmado) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0E0D23] to-[#511F86]">
      {/* Header */}
      <HeaderPedidos mesera={mesera} onLogout={handleLogout} codigoConfirmado={codigoConfirmado} />

      {/* Contenido principal */}
      <div className="flex flex-col items-center justify-center flex-1 p-6">
        {/* Contenido condicional: Pedido vacío o lista de productos */}
        {orderItems.length === 0 ? (
          <div className="bg-[#441E73]/50 border border-[#6C3FA8] rounded-2xl p-10 text-center shadow-lg max-w-md w-full">
            <div className="flex justify-center mb-4">
              {/* Icono */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Pedido Vacío</h2>
            <p className="text-sm text-gray-300">
              Agrega productos desde el menú para comenzar
            </p>
            <div className="h-1 w-16 bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] rounded-full mx-auto mt-4"></div>
          </div>
        ) : (
          <>
            {/* Selector de Mesa */}
            <div className="mb-4 w-full max-w-2xl">
              <label htmlFor="mesa-select" className="block mb-2 text-sm font-medium text-white">Seleccionar Mesa:</label>
              <select
                id="mesa-select"
                value={selectedMesaId}
                onChange={(e) => setSelectedMesaId(e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                disabled={mesas.length === 0}
              >
                {mesas.length > 0 ? (
                  mesas.map((mesa) => (
                    <option key={mesa.id} value={mesa.id}>Mesa #{mesa.numero} (Capacidad: {mesa.capacidad})</option>
                  ))
                ) : <option>No hay mesas disponibles</option>}
              </select>
            </div>
            <div className="bg-[#2B0D49]/80 border border-[#6C3FA8] rounded-xl p-6 w-full max-w-2xl">
              <h2 className="text-white text-2xl font-bold mb-4 border-b border-purple-700 pb-2">
                Tu Pedido Actual
              </h2>
              <div className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-2 mb-4">
                {orderItems.map((item, index) => (
                  <div
                    key={item.producto.id || index}
                    className="flex justify-between items-center text-white bg-black/20 p-2 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.producto.imagen}
                        alt={item.producto.nombre}
                        className="w-16 h-16 object-contain rounded-md bg-white p-1"
                      />
                      <div>
                        <p className="font-semibold">{item.producto.nombre}</p>
                        <p className="text-sm text-gray-400">
                          ${parseFloat(item.producto.precio).toLocaleString("es-CO")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Controles de cantidad */}
                      <div className="flex items-center gap-2 bg-purple-900/50 rounded-full p-1">
                        <button
                          onClick={() => {
                            if (item.cantidad > 1) {
                              onUpdateCantidad(item.producto.id, item.cantidad - 1);
                            } else {
                              onRemoveItem(item.producto.id); // Elimina si la cantidad es 1
                            }
                          }}
                          className="w-8 h-8 flex items-center justify-center text-lg rounded-full hover:bg-purple-700 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-2 font-bold text-md w-6 text-center">{item.cantidad}</span>
                        <button
                          onClick={() => onUpdateCantidad(item.producto.id, item.cantidad + 1)}
                          className="w-8 h-8 flex items-center justify-center text-lg rounded-full hover:bg-purple-700 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      {/* Precio total por item */}
                      <p className="font-bold text-lg w-28 text-right">
                        ${(parseFloat(item.producto.precio) * item.cantidad).toLocaleString("es-CO")}
                      </p>
                      {/* Botón de eliminar */}
                      <button onClick={() => onRemoveItem(item.producto.id)} className="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-red-500/20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-purple-700 mt-4 pt-4">
                <div className="flex justify-between text-white text-xl font-bold mb-4">
                  <span>Total:</span>
                  <span>${totalPedido.toLocaleString("es-CO")}</span>
                </div>
                <div className="flex gap-4">
                  <button onClick={handleFinalizarPedido} className="w-full bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] text-white py-3 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50" disabled={orderItems.length === 0}>
                    Finalizar Pedido
                  </button>
                  <button onClick={onClearOrder} className="w-full bg-gray-700 text-gray-300 hover:bg-gray-600 py-3 rounded-lg font-bold transition">Limpiar</button>
                </div>
              </div>
            </div></>
        )}
      </div>
    </div>
  );
}
