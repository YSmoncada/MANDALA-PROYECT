import { useState, useEffect, useCallback, useMemo, memo } from "react";
import ProductCardDisco from "../pedidospage/ProductCard-Disco";
import apiClient from "../../utils/apiClient";
import { Search, Filter, Loader2 } from 'lucide-react';

const CATEGORIES = [
    { id: "", label: "Todos" },
    { id: "cerveza", label: "Cervezas" },
    { id: "vinos", label: "Vinos" },
    { id: "destilados", label: "Destilados" },
    { id: "cocteles", label: "Cocteles" },
    { id: "bebidas", label: "Bebidas" },
];

/**
 * Grid component to display and filter products.
 * Memoized to prevent unnecessary re-renders.
 */
function ProductGridDisco({ onProductAdd }) {
    const [filtro, setFiltro] = useState("cerveza");
    const [productosData, setProductosData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchProductos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/productos/');
            setProductosData(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProductos();
    }, [fetchProductos]);

    // Optimize filter logic with useMemo
    const filteredProducts = useMemo(() => {
        return productosData.filter(producto => {
            const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = filtro === "" || producto.categoria === filtro;
            return matchesSearch && matchesCategory;
        });
    }, [productosData, searchTerm, filtro]);

    return (
        <div className="w-full pb-20">
            {/* Search and Filter Section */}
            <div className="mb-8 space-y-6">
                <div className="relative max-w-2xl mx-auto group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar en el menú..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-14 pr-6 py-5 border border-white/10 rounded-2xl leading-5 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:bg-zinc-900 focus:border-white/20 focus:ring-1 focus:ring-white/20 sm:text-sm transition-all shadow-lg backdrop-blur-sm"
                    />
                </div>

                <div className="flex justify-center">
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-4">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setFiltro(cat.id)}
                                className={`
                                    px-4 sm:px-8 py-3 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300 border
                                    ${filtro === cat.id
                                        ? "bg-white text-black border-white shadow-lg transform scale-105"
                                        : "bg-transparent text-zinc-500 border-zinc-700 hover:border-zinc-500 hover:text-white hover:bg-zinc-800"
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
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32">
                    <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
                    <p className="text-zinc-500 font-bold tracking-widest text-xs uppercase animate-pulse">Cargando menú...</p>
                </div>
            ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 px-4 sm:px-0">
                    {filteredProducts.map((producto) => (
                        <ProductCardDisco 
                            key={producto.id} 
                            producto={producto} 
                            onAgregarPedido={onProductAdd} 
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 px-4">
                    <div className="inline-block p-8 rounded-full bg-zinc-900/30 mb-6 border border-zinc-800">
                        <Filter size={48} className="text-zinc-600" />
                    </div>
                    <p className="text-xl sm:text-2xl text-white font-bold mb-2 uppercase tracking-tight">No se encontraron productos</p>
                    <p className="text-zinc-500 text-sm uppercase tracking-widest font-bold">Prueba con otra categoría o término</p>
                </div>
            )}
        </div>
    );
}

export default memo(ProductGridDisco);
