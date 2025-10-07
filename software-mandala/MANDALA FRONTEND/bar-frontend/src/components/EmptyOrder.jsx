// src/components/EmptyOrder.jsx
export default function EmptyOrder() {
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-[#441E73]/40 border border-purple-600 rounded-2xl shadow-lg text-center text-white max-w-md mx-auto">
      {/* Icono */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-14 w-14 text-purple-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h18l-1 9H4L3 3z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 16a2 2 0 11-4 0m8 0a2 2 0 11-4 0"
        />
      </svg>

      {/* Texto */}
      <h2 className="text-2xl font-bold mb-2">Pedido Vacío</h2>
      <p className="text-gray-300 text-sm">
        Agrega productos desde el menú para comenzar
      </p>

      {/* Línea decorativa */}
      <div className="mt-4 w-12 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
    </div>
  );
}
