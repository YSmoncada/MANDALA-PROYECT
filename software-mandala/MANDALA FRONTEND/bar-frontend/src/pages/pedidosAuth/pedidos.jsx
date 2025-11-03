// src/pages/Pedidos.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderPedidos from "../pedidospage/HeaderPedidos";
import CodeInput from "./CodeInput";
import ProductGrid from "./ProductGrid";

export default function Pedidos({ auth, onProductAdd }) {
  const { // Desestructuramos desde la prop 'auth'
    mesera,
    codigoConfirmado,
    isInitialized,
    meseras,
    handleSelectMesera,
    handleCodigoSubmit,
    handleLogout,
    addMesera, // Importamos la nueva función
  } = auth;

  const [showAddForm, setShowAddForm] = useState(false);
  const [newMeseraName, setNewMeseraName] = useState("");
  const [newMeseraCode, setNewMeseraCode] = useState("");
  const navigate = useNavigate();

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

  const handleAddMeseraSubmit = async (e) => {
    e.preventDefault();
    if (newMeseraName.trim() === "" || newMeseraCode.length !== 4) {
      alert("Por favor, complete el nombre y un código de 4 dígitos.");
      return;
    }
    const result = await addMesera(newMeseraName, newMeseraCode);
    if (!result.success) {
      alert(`Error: ${result.message}`);
    } else {
      // El formulario se ocultará automáticamente porque `mesera` tendrá un valor
      setShowAddForm(false);
      setNewMeseraName("");
      setNewMeseraCode("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0E0D23] to-[#511F86] relative">
      {/* El Header se muestra solo si no estamos en la pantalla de ingreso de código */}
      {!(mesera && !codigoConfirmado) && (
        <HeaderPedidos mesera={mesera} onLogout={handleLogout} codigoConfirmado={codigoConfirmado} />
      )}

      <div className="flex flex-1 items-center justify-center p-6">
        {/* Formulario para agregar nueva mesera */}
        {showAddForm && !mesera && (
          <div className="bg-[#441E73]/90 border border-[#6C3FA8] p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
            <h2 className="text-white text-2xl font-bold mb-6">Agregar Nueva Mesera</h2>
            <form onSubmit={handleAddMeseraSubmit} className="flex flex-col gap-4">
              <input type="text" placeholder="Nombre completo" value={newMeseraName} onChange={(e) => setNewMeseraName(e.target.value)} className="w-full text-center text-lg py-3 rounded-lg bg-[#2B0D49] text-white placeholder-[#8A7BAF] focus:outline-none focus:ring-2 focus:ring-[#A944FF]" />
              <input type="password" placeholder="Crear código de 4 dígitos" value={newMeseraCode} onChange={(e) => /^\d{0,4}$/.test(e.target.value) && setNewMeseraCode(e.target.value)} maxLength={4} className="w-full text-center text-lg tracking-widest py-3 rounded-lg bg-[#2B0D49] text-white placeholder-[#8A7BAF] focus:outline-none focus:ring-2 focus:ring-[#A944FF]" />
              <div className="flex gap-4 mt-4">
                <button type="button" onClick={() => setShowAddForm(false)} className="w-full bg-gray-700 text-gray-300 hover:bg-gray-600 py-2 rounded-lg font-bold transition">Cancelar</button>
                <button type="submit" className="w-full bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] text-white py-2 rounded-lg font-bold hover:opacity-90 transition">Guardar</button>
              </div>
            </form>
          </div>
        )}

        {/* Paso 1: Selección de mesera (si no se está agregando una nueva) */}
        {!mesera && !codigoConfirmado && !showAddForm && (
          <>
            <button
              onClick={() => navigate("/")}
              className="absolute top-20 left-6 flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Volver al Inicio</span>
            </button>
            <div className="bg-[#441E73]/90 border border-[#6C3FA8] p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
              <h2 className="text-white text-2xl font-bold mb-2">Seleccionar Mesera</h2>
              <p className="text-[#C2B6D9] text-sm mb-6">
                Elige tu nombre para comenzar
              </p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Ahora 'meseras' es una lista de objetos */}
                {meseras.map((meseraObj) => (
                  <button
                    key={meseraObj.id}
                    onClick={() => handleSelectMesera(meseraObj)} // Pasamos el objeto completo
                    className="bg-transparent border border-gray-500 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition"
                  >
                    {meseraObj.nombre}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="border border-gray-500 text-gray-300 hover:bg-gray-600/30 py-2 px-4 rounded-lg w-full transition"
              >
                + Otro nombre
              </button>
            </div>
          </>
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
