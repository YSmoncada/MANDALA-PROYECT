// src/pages/PedidosPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderPedidos from "../components/HeaderPedidos";  

export default function PedidosPage() {
  const [mesera, setMesera] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedMesera = localStorage.getItem("mesera");
    if (savedMesera) {
      setMesera(savedMesera);
    } else {
      // Si no hay mesera, redirigir al login
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("mesera");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0E0D23] to-[#511F86]">
      {/* Header */}
      <HeaderPedidos mesera={mesera} onLogout={handleLogout} />

      {/* Contenido principal */}
      <div className="flex flex-col items-center justify-center flex-1 p-6">
        {/* Nombre mesera y botón cambiar */}
        <div className="mb-6 text-white">
          <span className="mr-2">Mesera: <span className="font-bold">{mesera}</span></span>
          <button onClick={handleLogout} className="text-pink-400 hover:underline ml-2">
            Cambiar
          </button>
        </div>

        {/* Caja de pedido vacío */}
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
      </div>
    </div>
  );
}
