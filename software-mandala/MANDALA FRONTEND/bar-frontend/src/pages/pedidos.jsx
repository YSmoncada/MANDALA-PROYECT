// src/pages/Pedidos.jsx
import React, { useEffect } from "react";
import HeaderPedidos from "../components/HeaderPedidos";
import CodeInput from "../components/CodeInput";
import ProductGrid from "../components/ProductGrid";
import { usePedidosAuth } from "../hooks/usePedidosAuth";

export default function Pedidos({ onProductAdd }) {
  const {
    mesera,
    codigoConfirmado,
    isInitialized,
    meseras,
    handleSelectMesera,
    handleCodigoSubmit,
    handleLogout,
  } = usePedidosAuth();

  // Mostrar loading mientras se inicializa
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0E0D23] to-[#511F86]">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0E0D23] to-[#511F86]">
      {/* Header con mesera y botón de logout */}
      <HeaderPedidos mesera={mesera} onLogout={handleLogout} />

      <div className="flex flex-1 items-center justify-center p-6">
        {/* Paso 1: Selección mesera */}
        {!mesera && !codigoConfirmado && (
          <div className="bg-[#441E73]/90 border border-[#6C3FA8] p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
            <h2 className="text-white text-2xl font-bold mb-2">Seleccionar Mesera</h2>
            <p className="text-[#C2B6D9] text-sm mb-6">
              Elige tu nombre para comenzar
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {meseras.map((nombre) => (
                <button
                  key={nombre}
                  onClick={() => handleSelectMesera(nombre)}
                  className="bg-transparent border border-gray-500 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition"
                >
                  {nombre}
                </button>
              ))}
            </div>
            <button className="border border-gray-500 text-gray-300 hover:bg-gray-600/30 py-2 px-4 rounded-lg w-full transition">
              + Otro nombre
            </button>
          </div>
        )}

        {/* Paso 2: Código de acceso */}
        {mesera && !codigoConfirmado && (
          <CodeInput
            mesera={mesera}
            onBack={handleLogout}
            onSubmit={handleCodigoSubmit}
          />
        )}

        {/* Paso 3: Interfaz de productos */}
        {mesera && codigoConfirmado && <ProductGrid mesera={mesera} onCambiar={handleLogout} onProductAdd={onProductAdd} />}
      </div>
    </div>
  );
}
