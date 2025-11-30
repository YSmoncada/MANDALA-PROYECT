import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import axios from "axios";
import { API_URL } from "../../apiConfig"; // Importar la URL centralizada
export default function ProductGrid({ mesera, onCambiar, onProductAdd }) {
  const [filtro, setFiltro] = useState("cerveza");
  const [productosData, setProductosData] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  // [{producto: {}, cantidad: 2}, ...]
  useEffect(() => {
    fetchProductos(filtro);
  }, [filtro]);

  const fetchProductos = (filtro) => {
    axios.get(`${API_URL}/productos/`) // Usar la URL centralizada
      .then((response) => {
        console.log("Productos fetched:", response.data);
        console.log("Current filtro:", response.data.filter(p => p.categoria === filtro));
        if (filtro === "") {
          setProductosData(response.data);
          return;
        }
        setProductosData(response.data.filter(p => p.categoria === filtro));
      })
      .catch((error) => {
        console.error("Error fetching productos:", error);
      });
  }
  // Lista de productos con ruta de imagen en /public/productos/


  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Filtros */}
      <div className="mb-9 flex justify-center">
        <div className="flex sm:inline-flex overflow-x-auto pb-2 space-x-2 sm:overflow-x-visible">
          <button
            onClick={() => setFiltro("")}
            className={`py-2 px-5 rounded-full transition text-sm font-semibold whitespace-nowrap ${filtro === ""
              ? "bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] text-white shadow-lg"
              : "bg-gray-800/60 text-gray-300 hover:bg-gray-700"
              }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltro("vinos")}
            className={`py-2 px-5 rounded-full transition text-sm font-semibold whitespace-nowrap ${filtro === "vinos"
              ? "bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] text-white shadow-lg"
              : "bg-gray-800/60 text-gray-300 hover:bg-gray-700"
              }`}
          >
            Vinos
          </button>
          <button
            onClick={() => setFiltro("cerveza")}
            className={`py-2 px-5 rounded-full transition text-sm font-semibold whitespace-nowrap ${filtro === "cerveza"
              ? "bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] text-white shadow-lg"
              : "bg-gray-800/60 text-gray-300 hover:bg-gray-700"
              }`}
          >
            Cervezas
          </button>
          <button
            onClick={() => setFiltro("destilados")}
            className={`py-2 px-5 rounded-full transition text-sm font-semibold whitespace-nowrap ${filtro === "destilados"
              ? "bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] text-white shadow-lg"
              : "bg-gray-800/60 text-gray-300 hover:bg-gray-700"
              }`}
          >
            Destilados
          </button>
        </div>
      </div>

      {/* Productos */}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {productosData.map((producto, i) => (
          <ProductCard key={i} producto={producto} onAgregarPedido={onProductAdd} />
        ))}
      </div>
    </div>
  );
}
