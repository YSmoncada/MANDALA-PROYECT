// src/pages/Pedidos.jsx
import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react"; // Importamos un ícono para el botón
import { useNavigate, Link } from "react-router-dom";
import HeaderPedidos from "../pedidospage/HeaderPedidos";
import CodeInput from "./CodeInput";
import ProductGrid from "./ProductGrid";

import { usePedidosContext } from "../../context/PedidosContext";

export default function Pedidos() {
  const { auth, addProductToOrder: onProductAdd } = usePedidosContext();

  const { // Desestructuramos desde la prop 'auth'
    mesera,
    codigoConfirmado,
    isInitialized,
    meseras,
    handleSelectMesera,
    handleCodigoSubmit,
    handleLogout,
    addMesera,
    deleteMesera, // Obtenemos la función para eliminar
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

  const handleDeleteClick = async (e, meseraObj) => {
    e.stopPropagation(); // MUY IMPORTANTE: Evita que se seleccione la mesera al hacer clic en eliminar
    if (window.confirm(`¿Estás seguro de que quieres eliminar a ${meseraObj.nombre}? Esta acción no se puede deshacer.`)) {
      const result = await deleteMesera(meseraObj.id);
      if (!result.success) {
        // Si falla, mostramos una alerta con el error
        alert(`Error: ${result.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0E0D23] to-[#511F86] relative">
      {/* El Header se muestra en la vista de productos y en la selección de mesera */}
      {!(mesera && !codigoConfirmado) && (
        <HeaderPedidos mesera={mesera} onLogout={handleLogout} codigoConfirmado={codigoConfirmado} />
      )}

      <div className="flex flex-1 items-start sm:items-center justify-center p-6">
        {/* Formulario para agregar nueva mesera */}
        {showAddForm && !mesera && (
          <div className="bg-[#441E73]/90 border border-[#6C3FA8] p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
            <h2 className="text-white text-2xl font-bold mb-6">Agregar Nueva Mesera</h2>
            <form onSubmit={handleAddMeseraSubmit} className="flex flex-col gap-4 text-left sm:text-center">
              <input type="text" placeholder="Nombre completo" value={newMeseraName} onChange={(e) => setNewMeseraName(e.target.value)} className="w-full text-center text-lg py-3 rounded-lg bg-[#2B0D49] text-white placeholder-[#8A7BAF] focus:outline-none focus:ring-2 focus:ring-[#A944FF]" />
              <input type="password" inputMode="numeric" placeholder="Crear código de 4 dígitos" value={newMeseraCode} onChange={(e) => /^\d{0,4}$/.test(e.target.value) && setNewMeseraCode(e.target.value)} maxLength={4} className="w-full text-center text-lg tracking-widest py-3 rounded-lg bg-[#2B0D49] text-white placeholder-[#8A7BAF] focus:outline-none focus:ring-2 focus:ring-[#A944FF]" />
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button type="button" onClick={() => setShowAddForm(false)} className="w-full bg-gray-700 text-gray-300 hover:bg-gray-600 py-2 rounded-lg font-bold transition">Cancelar</button>
                <button type="submit" className="w-full bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] text-white py-2 rounded-lg font-bold hover:opacity-90 transition">Guardar</button>
              </div>
            </form>
          </div>
        )}

        {/* Paso 1: Selección de mesera (si no se está agregando una nueva) */}
        {!mesera && !codigoConfirmado && !showAddForm && (
          <>
            {/* Botón Volver al Inicio (solo en esta vista) */}
            <button
              onClick={() => navigate("/")}
              className="absolute top-20 left-6 z-10 flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white shadow-lg transition-colors hover:bg-purple-700 sm:top-24"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Volver al Inicio</span>
            </button>
            <div className="bg-[#441E73]/90 border border-[#6C3FA8] p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md text-center mt-20 sm:mt-0">
              <h2 className="text-white text-2xl font-bold mb-2">Seleccionar Mesera</h2>
              <p className="text-[#C2B6D9] text-sm mb-6">
                Elige tu nombre para comenzar
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Ahora 'meseras' es una lista de objetos */}
                {meseras.map((meseraObj) => (
                  // 1. Envolvemos el botón en un div con posición relativa
                  <div key={meseraObj.id} className="relative group">
                    <button
                      onClick={() => handleSelectMesera(meseraObj)}
                      className="w-full bg-transparent border border-gray-500 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition"
                    >
                      {meseraObj.nombre}
                    </button>
                    {/* 2. Añadimos el botón de eliminar con posición absoluta */}
                    <button
                      onClick={(e) => handleDeleteClick(e, meseraObj)}
                      className="absolute top-0 right-0 -mt-2 -mr-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                      aria-label={`Eliminar a ${meseraObj.nombre}`}>
                      <Trash2 size={14} />
                    </button>
                  </div>
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
        {mesera && codigoConfirmado && (
          <div className="w-full max-w-7xl mx-auto">
            {/* --- MEJORA DE DISEÑO: SALUDO A LA MESERA --- */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-light text-gray-300">
                Hola, <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#A944FF] to-[#FF4BC1]">{mesera}</span>
              </h2>
              <p className="text-gray-400">Selecciona los productos para el pedido</p>
            </div>
            <ProductGrid
              onProductAdd={onProductAdd}
            />
          </div>
        )}

      </div>
    </div>
  );
}
