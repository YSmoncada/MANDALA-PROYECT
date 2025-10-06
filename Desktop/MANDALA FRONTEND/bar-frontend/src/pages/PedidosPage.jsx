// src/pages/PedidosPage.jsx
import HeaderPedidos from "../components/HeaderPedidos";

export default function PedidosPage({ mesera = "María González", onCambiar, tienePedido = false }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0E0D23] to-[#511F86]">
      {/* Header */}
      <HeaderPedidos />

      {/* Contenido principal */}
      <div className="flex flex-col items-center justify-center flex-1 p-6">
        {/* Nombre mesera y botón cambiar */}
        <div className="mb-6 text-white">
          <span className="mr-2">
            Mesera: <span className="font-bold">{mesera}</span>
          </span>
          <button
            onClick={onCambiar}
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
