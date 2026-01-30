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
        <div className="w-full pb-32">
            {/* Search and Filter Section */}
            <div className="mb-8 space-y-6">
                <div className="relative max-w-2xl mx-auto group px-4 sm:px-0">
                    <div className="absolute inset-y-0 left-0 pl-7 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-[#8A7BAF] group-focus-within:text-[#A944FF] dark:text-zinc-500 dark:group-focus-within:text-white transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar en el menú..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-16 pr-8 py-4 bg-[#0E0D23] dark:bg-zinc-900/50 border-2 border-[#6C3FA8]/30 dark:border-white/5 rounded-2xl text-white dark:text-white placeholder-[#8A7BAF]/30 dark:placeholder-zinc-700 focus:outline-none focus:border-[#A944FF] dark:focus:border-white transition-all shadow-2xl backdrop-blur-xl font-black uppercase tracking-widest text-[10px]"
                    />
                </div>

                <div className="flex justify-center">
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 px-4 overflow-x-auto pb-4 scrollbar-hide">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setFiltro(cat.id)}
                                className={`
                                    px-8 sm:px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border whitespace-nowrap active:scale-95
                                    ${filtro === cat.id
                                        ? "bg-[#A944FF] dark:bg-white text-white dark:text-black border-transparent shadow-[0_20px_40px_-10px_rgba(169,68,255,0.4)] dark:shadow-none scale-105"
                                        : "bg-[#1A103C]/50 dark:bg-transparent text-[#8A7BAF] dark:text-zinc-500 border-white/5 dark:border-zinc-800 hover:border-[#A944FF]/30 dark:hover:border-zinc-400 hover:text-white dark:hover:text-white hover:bg-[#1A103C] dark:hover:bg-zinc-900/50"
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
                <div className="flex flex-col items-center justify-center py-40">
                    <div className="w-20 h-20 border-4 border-[#6C3FA8]/20 dark:border-zinc-800 border-t-[#A944FF] dark:border-t-white rounded-[2rem] animate-spin mb-8 shadow-2xl"></div>
                    <p className="text-[#8A7BAF] dark:text-zinc-500 font-black tracking-[0.4em] text-[11px] uppercase animate-pulse">Sincronizando Menú...</p>
                </div>
            ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 px-4 sm:px-0 animate-fadeIn">
                    {filteredProducts.map((producto) => (
                        <ProductCardDisco 
                            key={producto.id} 
                            producto={producto} 
                            onAgregarPedido={onProductAdd} 
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-40 px-4 animate-scaleIn">
                    <div className="inline-block p-12 rounded-[3rem] bg-[#1A103C]/50 dark:bg-zinc-900/30 mb-8 border-2 border-dashed border-white/5 dark:border-zinc-800 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#A944FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <Filter size={64} className="text-[#8A7BAF] dark:text-zinc-700 relative z-10" />
                    </div>
                    <p className="text-3xl text-white dark:text-white font-black mb-4 uppercase tracking-tighter italic shadow-2xl">No hay coincidencias</p>
                    <p className="text-[#8A7BAF] dark:text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-black">Prueba con otra categoría o término de búsqueda</p>
                </div>
            )}
        </div>
    );
}

export default memo(ProductGridDisco);
