import { useState, useEffect } from "react";
import ProductCardDisco from "../pedidospage/ProductCard-Disco";
import axios from "axios";
import { API_URL } from "../../apiConfig";
import { Search, Filter } from 'lucide-react';

export default function ProductGridDisco({ mesera, onCambiar, onProductAdd }) {
    const [filtro, setFiltro] = useState("cerveza");
    const [productosData, setProductosData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchProductos(filtro);
    }, [filtro]);

    const fetchProductos = (filtro) => {
        axios.get(`${API_URL}/productos/`)
            .then((response) => {
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

    const filteredProducts = productosData.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categories = [
        { id: "", label: "Todos" },
        { id: "cerveza", label: "Cervezas" },
        { id: "vinos", label: "Vinos" },
        { id: "destilados", label: "Destilados" },
        { id: "cocteles", label: "Cocteles" },
        { id: "bebidas", label: "Bebidas" },
    ];

    return (
        <div className="w-full pb-20">
            {/* Search and Filter Section */}
            <div className="mb-8 space-y-6">
                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-[#8A7BAF] group-focus-within:text-[#A944FF] transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar en el menú..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-14 pr-6 py-5 border border-[#6C3FA8] rounded-2xl leading-5 bg-[#441E73]/50 text-white placeholder-[#8A7BAF] focus:outline-none focus:bg-[#2B0D49]/80 focus:border-[#A944FF] focus:ring-1 focus:ring-[#A944FF] sm:text-sm transition-all shadow-lg backdrop-blur-sm"
                    />
                </div>

                {/* Categories */}
                <div className="flex justify-center">
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setFiltro(cat.id)}
                                className={`
                  px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 border
                  ${filtro === cat.id
                                        ? "bg-[#A944FF] text-white border-[#FF4BC1] shadow-[0_0_20px_rgba(169,68,255,0.4)] transform scale-105"
                                        : "bg-transparent text-[#C2B6D9] border-[#6C3FA8] hover:border-[#A944FF] hover:text-white hover:bg-[#441E73]/50"
                                    }
                `}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredProducts.map((producto, i) => (
                        <ProductCardDisco key={i} producto={producto} onAgregarPedido={onProductAdd} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-32">
                    <div className="inline-block p-8 rounded-full bg-[#441E73]/30 mb-6 border border-[#6C3FA8]">
                        <Filter size={48} className="text-[#8A7BAF]" />
                    </div>
                    <p className="text-2xl text-white font-bold mb-2">No se encontraron productos</p>
                    <p className="text-[#8A7BAF]">Intenta con otra categoría o término de búsqueda</p>
                </div>
            )}
        </div>
    );
}
