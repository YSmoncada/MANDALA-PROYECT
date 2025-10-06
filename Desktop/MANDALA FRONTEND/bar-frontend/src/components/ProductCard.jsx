import { useState } from "react";

export default function ProductCard({ producto }) {
  const [cantidad, setCantidad] = useState(1);

  const aumentar = () => setCantidad(cantidad + 1);
  const disminuir = () => setCantidad(cantidad > 1 ? cantidad - 1 : 1);

  return (
    <div className="bg-[#2B0D49] border border-[#6C3FA8] rounded-xl p-4 shadow-lg text-center text-white hover:scale-105 transition-transform duration-300">
      {/* Imagen */}
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className="w-full h-70 object-contain rounded-lg mb-4 bg-[#ffffff] p-2"
      />

      {/* Nombre */}
      <h3 className="font-bold text-lg">{producto.nombre}</h3>
      <p className="text-sm text-gray-400">{producto.unidad}</p>

      {/* Precio */}
      <p className="text-green-400 font-semibold mt-2">
        ${producto.precio.toLocaleString("es-CO")}
      </p>

      {/* Controles */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={disminuir}
          className="px-3 py-1 bg-purple-700 rounded hover:bg-purple-600"
        >
          -
        </button>
        <span className="px-3">{cantidad}</span>
        <button
          onClick={aumentar}
          className="px-3 py-1 bg-purple-700 rounded hover:bg-purple-600"
        >
          +
        </button>
      </div>

      {/* Botón agregar */}
      <button className="mt-4 bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] text-white py-2 px-4 w-full rounded-lg hover:opacity-90">
        + Agregar al Pedido
      </button>
    </div>
  );
}
