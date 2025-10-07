// src/pages/Pedidos.jsx
import { useState, useEffect } from "react";
import HeaderPedidos from "../components/HeaderPedidos";
import CodeInput from "../components/CodeInput";
import ProductGrid from "../components/ProductGrid";

export default function Pedidos() {
  const [mesera, setMesera] = useState(null);
  const [codigoConfirmado, setCodigoConfirmado] = useState(false);

  // Cargar mesera guardada en localStorage
  useEffect(() => {
    const savedMesera = localStorage.getItem("mesera");
    if (savedMesera) {
      setMesera(savedMesera);
      setCodigoConfirmado(true);
    }
  }, []);

  const meseras = [
    "María González",
    "Ana Rodríguez",
    "Carmen López",
    "Sofía Martínez",
    "Valentina Torres",
  ];

  const handleSelectMesera = (nombre) => {
    setMesera(nombre);
    setCodigoConfirmado(false);
  };

  const handleCodigoSubmit = (codigo) => {
    if (codigo.length === 4) {
      setCodigoConfirmado(true);
      localStorage.setItem("mesera", mesera);
    } else {
      alert("El código debe tener 4 dígitos");
    }
  };

  const handleCambiarMesera = () => {
    setMesera(null);
    setCodigoConfirmado(false);
    localStorage.removeItem("mesera");
  };

  const handleBackToMeseras = () => {
    handleCambiarMesera();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0E0D23] to-[#511F86]">
      {/* Header con mesera y botón de logout */}
      <HeaderPedidos mesera={mesera} onLogout={handleCambiarMesera} />

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
            onBack={handleBackToMeseras}
            onSubmit={handleCodigoSubmit}
          />
        )}

        {/* Paso 3: Interfaz de productos */}
        {mesera && codigoConfirmado && (
          <ProductGrid mesera={mesera} onCambiar={handleCambiarMesera} />
        )}
      </div>
    </div>
  );
}
