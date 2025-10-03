import { useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ mesera, onCambiar }) {
  const [filtro, setFiltro] = useState("licores");

  // Lista de productos con ruta de imagen en /public/productos/
  const productos = [
    { nombre: "Aguardiente Antioqueño", detalle: "Botella 750ml", precio: 45000, categoria: "licores", imagen: "/antioqueño.png" },
    { nombre: "Ron Medellín Añejo", detalle: "Botella 750ml", precio: 85000, categoria: "licores", imagen: "/ron-medellin.png" },
    { nombre: "Whisky Old Parr", detalle: "Botella 750ml", precio: 120000, categoria: "licores", imagen: "/old-parr.png" },
    { nombre: "Vodka Absolut", detalle: "Botella 750ml", precio: 95000, categoria: "licores", imagen: "/absolut.png" },

    { nombre: "Aguila", detalle: "Cerveza Nacional - Botella 330ml", precio: 4500, categoria: "cervezas", imagen: "/aguila.png" },
    { nombre: "Club Colombia", detalle: "Cerveza Premium - Botella 330ml", precio: 5000, categoria: "cervezas", imagen: "/club-colombia.png" },
    { nombre: "Poker", detalle: "Cerveza Nacional - Botella 330ml", precio: 4200, categoria: "cervezas", imagen: "/poker.png" },
    { nombre: "Costeña", detalle: "Cerveza Nacional - Botella 330ml", precio: 4000, categoria: "cervezas", imagen: "/costena.png" },
    { nombre: "Pilsen", detalle: "Cerveza Nacional - Botella 330ml", precio: 4300, categoria: "cervezas", imagen: "/pilsen.png" },
    { nombre: "Andina", detalle: "Cerveza Nacional - Botella 330ml", precio: 4800, categoria: "cervezas", imagen: "/andina.png" },
  ];

  const productosFiltrados = productos.filter((p) => p.categoria === filtro);

  return (
    <div className="w-full max-w-6xl">
      {/* Mesera */}
      <div className="flex justify-center mb-4 text-white items-center gap-2">
        <span>Mesera:</span>
        <span className="font-bold">{mesera}</span>
        <span
          onClick={onCambiar}
          className="ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-pink-500 text-white shadow-md cursor-pointer hover:bg-purple-700 transition-all duration-300"
        >
          Cambiar
        </span>
      </div>

      {/* Filtros */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setFiltro("licores")}
          className={`py-2 px-6 rounded-l-lg transition ${filtro === "licores"
              ? "bg-purple-700 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
        >
          Licores
        </button>
        <button
          onClick={() => setFiltro("cervezas")}
          className={`py-2 px-6 rounded-r-lg transition ${filtro === "cervezas"
              ? "bg-purple-700 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
        >
          Cervezas
        </button>
      </div>

      {/* Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productosFiltrados.map((producto, i) => (
          <ProductCard key={i} producto={producto} />
        ))}
      </div>
    </div>
  );
}
