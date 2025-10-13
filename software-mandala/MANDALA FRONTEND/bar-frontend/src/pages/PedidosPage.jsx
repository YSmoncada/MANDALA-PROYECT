// src/pages/PedidosPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderPedidos from "../components/HeaderPedidos";  
import { usePedidosAuth } from "./usePedidosAuth";

export default function PedidosPage() {
  const {
    mesera,
    codigoConfirmado,
    isInitialized,
    meseras,
    handleSelectMesera,
    handleCodigoSubmit,
    handleLogout,
  } = usePedidosAuth();
  
  const navigate = useNavigate();
  const [tienePedido] = useState(false); // Estado temporal para controlar si hay pedido
  const [isLoading, setIsLoading] = useState(true);
  
  // Verificar autenticación solo después de la inicialización
  useEffect(() => {
    if (!isInitialized) return; // Esperar a que se inicialice

    if (!mesera || !codigoConfirmado) {
      navigate('/login', { replace: true });
    } else {
      setIsLoading(false);
    }
  }, [isInitialized, mesera, codigoConfirmado, navigate]);

  const handleCambiar = () => {
    handleLogout();
    navigate('/login');
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
      <HeaderPedidos mesera={mesera} onLogout={handleLogout} />

      {/* Contenido principal */}
      <div className="flex flex-col items-center justify-center flex-1 p-6">
        {/* Nombre mesera y botón cambiar */}
        <div className="mb-6 text-white">
          <span className="mr-2">Mesera: <span className="font-bold">{mesera}</span></span>
          <button
            onClick={handleCambiar}
            className="text-pink-400 hover:underline ml-2"
          >
            Cambiar
          </button>
        </div>
        {/* Mostrar caja de pedido vacío solo si no hay pedido */}
        {!tienePedido ? (
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
        ) : null}
        
      </div>
    </div>
  );
}
