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
            <div className="mb-12 space-y-8">
                <div className="relative max-w-2xl mx-auto group px-4 sm:px-0">
                    <div className="absolute inset-y-0 left-0 pl-5 sm:pl-5 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar en el menú..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-14 pr-6 py-5 border border-zinc-200 dark:border-white/10 rounded-[1.5rem] leading-5 bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-400 dark:focus:border-white/20 focus:ring-1 focus:ring-zinc-200 dark:focus:ring-white/20 sm:text-sm transition-all shadow-sm dark:shadow-2xl backdrop-blur-sm"
                    />
                </div>

                <div className="flex justify-center">
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 px-4 overflow-x-auto pb-2 scrollbar-hide">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setFiltro(cat.id)}
                                className={`
                                    px-6 sm:px-8 py-3 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 border whitespace-nowrap
                                    ${filtro === cat.id
                                        ? "bg-zinc-900 dark:bg-white text-white dark:text-black border-transparent shadow-xl transform scale-105 active:scale-95"
                                        : "bg-white dark:bg-transparent text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/50 active:scale-95"
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
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-zinc-100 dark:border-zinc-800 border-t-zinc-900 dark:border-t-white rounded-full animate-spin mb-6 shadow-sm"></div>
                    </div>
                    <p className="text-zinc-400 dark:text-zinc-500 font-bold tracking-[0.4em] text-[10px] uppercase animate-pulse">Consultando menú...</p>
                </div>
            ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-8 px-4 sm:px-0 animate-fadeIn">
                    {filteredProducts.map((producto) => (
                        <ProductCardDisco 
                            key={producto.id} 
                            producto={producto} 
                            onAgregarPedido={onProductAdd} 
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 px-4 animate-fadeIn">
                    <div className="inline-block p-10 rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/30 mb-8 border border-dashed border-zinc-200 dark:border-zinc-800">
                        <Filter size={48} className="text-zinc-300 dark:text-zinc-700" />
                    </div>
                    <p className="text-2xl text-zinc-900 dark:text-white font-black mb-2 uppercase tracking-tight">No se encontraron productos</p>
                    <p className="text-zinc-400 dark:text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-black">Prueba con otra categoría o término</p>
                </div>
            )}
        </div>
    );
}

export default memo(ProductGridDisco);
