import React, { useState, memo, useCallback } from "react";
import { Edit2, Trash2, PlusCircle, LayoutGrid, List } from "lucide-react";
import MovementModal from "./MovementModal";
import { UI_CLASSES } from "../../../constants/ui";

/**
 * Visual indicator for stock levels.
 */
/**
 * Visual indicator for stock levels.
 */
const StockStatus = memo(({ stock, min, max }) => {
    let status = { 
        label: 'Óptimo', 
        color: 'text-emerald-600 dark:text-emerald-400', 
        bg: 'bg-emerald-50 dark:bg-emerald-500/20', 
        border: 'border-emerald-100 dark:border-emerald-500/30' 
    };

    if (stock === 0) {
        status = { 
            label: 'Agotado', 
            color: 'text-rose-600 dark:text-rose-400', 
            bg: 'bg-rose-50 dark:bg-rose-500/20', 
            border: 'border-rose-100 dark:border-rose-500/30' 
        };
    } else if (stock <= min) {
        status = { 
            label: 'Bajo Stock', 
            color: 'text-amber-600 dark:text-amber-400', 
            bg: 'bg-amber-50 dark:bg-amber-500/20', 
            border: 'border-amber-100 dark:border-amber-500/30' 
        };
    } else if (max > 0 && stock >= max) {
        status = { 
            label: 'Stock Alto', 
            color: 'text-indigo-600 dark:text-indigo-400', 
            bg: 'bg-indigo-50 dark:bg-indigo-500/20', 
            border: 'border-indigo-100 dark:border-indigo-500/30' 
        };
    }

    return (
        <div className="flex flex-col items-center gap-1">
            <span className={`text-2xl font-black ${status.color}`}>{stock}</span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${status.bg} ${status.color} ${status.border} shadow-sm backdrop-blur-sm text-center whitespace-nowrap`}>
                {status.label}
            </span>
        </div>
    );
});

/**
 * Table/Grid view for products.
 * Optimized with memoization to prevent unnecessary re-renders.
 */
const ProductTable = memo(({ productos, onEdit, onDelete, onMovimiento }) => {
    const [movimientoModalOpen, setMovimientoModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [viewMode, setViewMode] = useState(window.innerWidth < 768 ? 'grid' : 'table');

    // Handle responsive view mode
    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768 && viewMode === 'table') {
                setViewMode('grid');
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [viewMode]);

    const openMovimiento = useCallback((producto) => {
        setSelectedProduct(producto);
        setMovimientoModalOpen(true);
    }, []);

    const handleMovimientoSubmit = useCallback(async (payload) => {
        if (typeof onMovimiento === 'function') {
            await onMovimiento(payload);
        }
    }, [onMovimiento]);

    const renderActionButtons = useCallback((producto, size = 14) => (
        <div className="flex items-center justify-end gap-1 md:gap-2">
            <button
                onClick={() => openMovimiento(producto)}
                className="p-2 md:p-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:text-white transition-all shadow-sm border border-emerald-100 dark:border-emerald-500/20 group/btn"
                title="Registrar Movimiento"
            >
                <PlusCircle size={size} className="md:w-[18px] md:h-[18px] group-active/btn:scale-90 transition-transform" />
            </button>
            <button
                onClick={() => onEdit(producto)}
                className="p-2 md:p-2.5 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl hover:bg-sky-500 dark:hover:bg-sky-500 hover:text-white transition-all shadow-sm border border-sky-100 dark:border-sky-500/20 group/btn"
                title="Editar Producto"
            >
                <Edit2 size={size} className="md:w-[18px] md:h-[18px] group-active/btn:scale-90 transition-transform" />
            </button>
            <button
                onClick={() => onDelete(producto)}
                className="p-2 md:p-2.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-500 dark:hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-rose-100 dark:border-rose-500/20 group/btn"
                title="Eliminar Producto"
            >
                <Trash2 size={size} className="md:w-[18px] md:h-[18px] group-active/btn:scale-90 transition-transform" />
            </button>
        </div>
    ), [onEdit, onDelete, openMovimiento]);

    return (
        <div className="space-y-4">
            {/* View Toggle - Hidden on mobile as grid is required */}
            <div className="hidden md:flex justify-end mb-4">
                <div className="bg-zinc-50 dark:bg-zinc-950 p-1.5 rounded-2xl border border-zinc-100 dark:border-white/5 flex gap-1 shadow-inner">
                    <button 
                        onClick={() => setViewMode('table')}
                        className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${viewMode === 'table' ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-lg shadow-black/5 dark:shadow-none' : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
                    >
                        <List size={16} />
                        Tabla
                    </button>
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${viewMode === 'grid' ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-lg shadow-black/5 dark:shadow-none' : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
                    >
                        <LayoutGrid size={16} />
                        Cuadrícula
                    </button>
                </div>
            </div>

            {viewMode === 'table' ? (
                <div className="overflow-x-auto rounded-[2rem] border border-zinc-200 dark:border-white/5 shadow-xl dark:shadow-none bg-white dark:bg-transparent transition-all duration-500">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-50 dark:bg-black/40 text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px] border-b border-zinc-100 dark:border-white/5">
                            <tr>
                                <th className="px-6 py-6">Producto</th>
                                <th className="px-6 py-6">Categoría</th>
                                <th className="px-6 py-6 text-center">Gestión Inventario</th>
                                <th className="px-6 py-6 text-center">Valor Comercial</th>
                                <th className="px-6 py-6 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50 dark:divide-white/[0.03] transition-colors duration-300">
                            {productos.map((producto) => (
                                <tr key={producto.id} className="hover:bg-zinc-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            {producto.imagen ? (
                                                <div className="p-1.5 bg-zinc-50 dark:bg-white/5 rounded-xl border border-zinc-100 dark:border-white/10 group-hover:border-zinc-300 dark:group-hover:border-white/20 transition-all duration-500">
                                                    <img src={producto.imagen} alt={producto.nombre} className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-contain" />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-white/5 shadow-inner">
                                                    <span className="text-zinc-300 dark:text-zinc-700 font-black text-xl">{producto.nombre?.charAt(0)}</span>
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="font-black text-zinc-900 dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors uppercase text-xs md:text-sm tracking-tight">{producto.nombre}</span>
                                                <span className="text-[10px] text-zinc-400 dark:text-zinc-600 font-bold uppercase tracking-widest">{producto.unidad}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase border border-zinc-200 dark:border-white/10 whitespace-nowrap tracking-widest group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-all duration-500">
                                            {producto.categoria}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex justify-center">
                                            <StockStatus 
                                                stock={producto.stock} 
                                                min={producto.stock_minimo} 
                                                max={producto.stock_maximo} 
                                            />
                                        </div>
                                    </td>
                                    <td className="px-3 md:px-6 py-3 text-center font-bold text-zinc-900 dark:text-white text-sm md:text-lg">
                                        ${Number(producto.precio).toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                    </td>
                                    <td className="px-3 md:px-6 py-3 text-right">
                                        {renderActionButtons(producto)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 animate-fadeIn transition-all duration-500">
                    {productos.map((producto) => (
                        <div key={producto.id} className="bg-[#1A103C]/80 dark:bg-zinc-900/30 border border-white/5 dark:border-white/5 rounded-2xl p-4 md:p-6 hover:shadow-2xl dark:hover:shadow-none transition-all duration-500 group flex flex-col justify-between backdrop-blur-md hover:scale-[1.02]">
                             <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-3 py-1 rounded-full bg-[#A944FF]/10 dark:bg-zinc-800/50 text-[#A944FF] dark:text-zinc-500 text-[9px] md:text-[10px] font-black uppercase border border-[#A944FF]/30 dark:border-white/10 tracking-widest transition-all">
                                        {producto.categoria}
                                    </span>
                                    {renderActionButtons(producto, 16)}
                                </div>
                                <div className="flex flex-col items-center mb-4">
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center border border-white/10 dark:border-white/10 shadow-inner mb-3 group-hover:scale-110 transition-transform duration-500">
                                        {producto.imagen ? (
                                            <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-contain p-2" />
                                        ) : (
                                            <span className="text-3xl font-black text-zinc-200 dark:text-zinc-700 uppercase">{producto.nombre?.charAt(0)}</span>
                                        )}
                                    </div>
                                    <h3 className="font-bold dark:font-black text-base md:text-lg text-white dark:text-zinc-200 uppercase tracking-tight text-center">{producto.nombre}</h3>
                                    <p className="text-[10px] text-[#8A7BAF] dark:text-zinc-600 font-bold dark:font-black uppercase tracking-widest mt-1">{producto.unidad}</p>
                                </div>
                            </div>
                            <div className="bg-[#0E0D23] dark:bg-zinc-900/50 rounded-xl p-4 flex items-center justify-between border border-[#6C3FA8]/30 dark:border-white/5 shadow-inner">
                                <StockStatus 
                                    stock={producto.stock} 
                                    min={producto.stock_minimo} 
                                    max={producto.stock_maximo} 
                                />
                                <div className="text-right">
                                    <p className="text-[9px] text-[#8A7BAF] dark:text-zinc-500 font-bold uppercase tracking-widest mb-1">Precio</p>
                                    <p className="text-lg md:text-xl font-black text-green-400 dark:text-white tracking-tighter">
                                        ${Number(producto.precio).toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {movimientoModalOpen && (
                <MovementModal
                    open={movimientoModalOpen}
                    onClose={() => setMovimientoModalOpen(false)}
                    onSubmit={handleMovimientoSubmit}
                    stockActual={selectedProduct?.stock}
                    categoria={selectedProduct?.categoria}
                    producto={selectedProduct}
                />
            )}
        </div>
    );
});

export default ProductTable;
