import { useState, useEffect } from "react";
import ProductCard from "../pedidospage/ProductCard";
import axios from "axios";
export default function ProductGrid({ mesera, onCambiar, onProductAdd }) {
  const [filtro, setFiltro] = useState("cerveza");
  const [productosData, setProductosData] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  // [{producto: {}, cantidad: 2}, ...]
  useEffect(() => {
    fetchProductos(filtro);
  }, [filtro]);

  const productosAPIUrl = "http://localhost:8000/api/productos/";
  const fetchProductos = (filtro) => {
    axios.get(productosAPIUrl)
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
      <div className="flex justify-center mb-9 gap-2">
        <button
          onClick={() => setFiltro("")}
          className={`py-2 px-6 rounded transition ${filtro === ""
            ? "bg-purple-700 text-white"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFiltro("vinos")}
          className={`py-2 px-6 rounded transition ${filtro === "vinos"
            ? "bg-purple-700 text-white"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
        >
          Vinos
        </button>
        <button
          onClick={() => setFiltro("cerveza")}
          className={`py-2 px-6 rounded transition ${filtro === "cerveza"
            ? "bg-purple-700 text-white"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
        >
          Cervezas
        </button>
        <button
          onClick={() => setFiltro("destilados")}
          className={`py-2 px-6 rounded transition ${filtro === "destilados"
            ? "bg-purple-700 text-white"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
        >
          Destilados
        </button>
      </div>

      {/* Productos */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productosData.map((producto, i) => (
          <ProductCard key={i} producto={producto} onAgregarPedido={onProductAdd} />
        ))}
      </div>
    </div>
  );
}
