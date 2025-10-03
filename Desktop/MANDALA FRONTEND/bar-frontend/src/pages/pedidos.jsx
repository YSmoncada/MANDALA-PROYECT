import { useState } from "react";
import HeaderPedidos from "../components/HeaderPedidos";
import CodeInput from "../components/CodeInput";

export default function Pedidos() {
  const [mesera, setMesera] = useState(null);

  const meseras = [
    "María González",
    "Ana Rodríguez",
    "Carmen López",
    "Sofía Martínez",
    "Valentina Torres",
  ];

  return (
<div className="min-h-screen flex flex-col bg-gradient-to-tl from-[#0E0D23] to-[#511F86]">
      <HeaderPedidos />

      <div className="flex flex-1 items-center justify-center p-6">
        {!mesera ? (
          <div className="bg-purple-800/40 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
            <div className="flex flex-col items-center mb-6">
              <div className="bg-pink-500 p-4 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 17.804A9.969 9.969 0 0112 15c2.21 0 4.236.72 5.879 1.927M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h2 className="text-white text-2xl font-bold">
                Seleccionar Mesera
              </h2>
              <p className="text-gray-300 text-sm mt-2">
                Elige tu nombre para comenzar
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {meseras.map((nombre) => (
                <button
                  key={nombre}
                  onClick={() => setMesera(nombre)}
                  className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition"
                >
                  {nombre}
                </button>
              ))}
            </div>

            <button className="bg-transparent border border-gray-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg w-full transition">
              Agregar mesera
            </button>
          </div>
        ) : (
          <CodeInput
            mesera={mesera}
            onBack={() => setMesera(null)}
            onSubmit={(codigo) =>
              alert(`Mesera: ${mesera}\nCódigo: ${codigo}`)
            }
          />
        )}
      </div>
    </div>
  );
}
