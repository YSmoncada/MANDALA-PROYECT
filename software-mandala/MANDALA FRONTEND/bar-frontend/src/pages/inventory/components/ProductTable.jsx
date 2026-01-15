import React, { useState } from "react";
import { Edit2, Trash2, PlusCircle, LayoutGrid, List } from "lucide-react";
import MovementModal from "./MovementModal";
import { UI_CLASSES } from "../../../constants/ui";

const StockStatus = ({ stock, min, max }) => {
    let status = { label: 'Óptimo', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40' };

    if (stock === 0) {
        status = { label: 'Agotado', color: 'text-rose-500', bg: 'bg-rose-500/20', border: 'border-rose-500/40' };
    } else if (stock <= min) {
        status = { label: 'Bajo Stock', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/40' };
    } else if (max > 0 && stock >= max) {
        status = { label: 'Stock Alto', color: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500/40' };
    }

    return (
        <div className="flex flex-col items-center gap-1">
            <span className={`text-2xl font-black ${status.color}`}>{stock}</span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${status.bg} ${status.color} ${status.border} shadow-lg backdrop-blur-sm`}>
                {status.label}
            </span>
        </div>
    );
};

const ProductTable = ({ productos, onEdit, onDelete, onMovimiento }) => {
    const [movimientoModalOpen, setMovimientoModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

    const openMovimiento = (producto) => {
        setSelectedProduct(producto);
        setMovimientoModalOpen(true);
    };

    const handleMovimientoSubmit = async (payload) => {
        if (typeof onMovimiento === 'function') {
            await onMovimiento(payload);
        }
    };

    return (
        <div className="space-y-4">
            {/* View Toggle */}
            <div className="flex justify-end mb-2">
                <div className="bg-white/5 p-1 rounded-lg border border-white/10 flex gap-1">
                    <button 
                        onClick={() => setViewMode('table')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <List size={18} />
                    </button>
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <LayoutGrid size={18} />
                    </button>
                </div>
            </div>

            {viewMode === 'table' ? (
                <div className="overflow-x-auto rounded-xl border border-white/10 shadow-2xl">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#2B0D49] text-gray-300 font-bold uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4">Producto</th>
                                <th className="px-6 py-4">Categoría</th>
                                <th className="px-6 py-4 text-center">Disponibilidad / Stock</th>
                                <th className="px-6 py-4 text-center">Precio</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {productos.map((producto) => (
                                <tr key={producto.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {producto.imagen ? (
                                                <img src={producto.imagen} alt={producto.nombre} className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-purple-900/40 flex items-center justify-center border border-purple-500/20">
                                                    <span className="text-purple-400 font-bold">{producto.nombre?.charAt(0)}</span>
                                                </div>
                                            )}
                                            <span className="font-bold text-white group-hover:text-purple-400 transition-colors uppercase">{producto.nombre}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase border border-blue-500/20">
                                            {producto.categoria}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StockStatus 
                                            stock={producto.stock} 
                                            min={producto.stock_minimo} 
                                            max={producto.stock_maximo} 
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-white text-lg">
                                        ${Number(producto.precio).toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openMovimiento(producto)}
                                                className="p-2 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-lg border border-emerald-500/20"
                                                title="Registrar Movimiento"
                                            >
                                                <PlusCircle size={18} />
                                            </button>
                                            <button
                                                onClick={() => onEdit(producto)}
                                                className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-lg border border-blue-500/20"
                                                title="Editar Producto"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(producto)}
                                                className="p-2 bg-rose-600/20 text-rose-400 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-lg border border-rose-500/20"
                                                title="Eliminar Producto"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {productos.map((producto) => (
                        <div key={producto.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all group overflow-hidden relative">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    {producto.imagen ? (
                                        <img src={producto.imagen} alt={producto.nombre} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-xl bg-purple-900/40 flex items-center justify-center border border-purple-500/20">
                                            <span className="text-purple-400 font-bold text-xl">{producto.nombre?.charAt(0)}</span>
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-bold text-white uppercase group-hover:text-purple-400 transition-colors">{producto.nombre}</h3>
                                        <span className="text-[10px] text-blue-400 font-bold uppercase">{producto.categoria}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <StockStatus 
                                        stock={producto.stock} 
                                        min={producto.stock_minimo} 
                                        max={producto.stock_maximo} 
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                                <span className="text-xl font-bold text-white">${Number(producto.precio).toLocaleString('es-CO', { maximumFractionDigits: 0 })}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openMovimiento(producto)}
                                        className="p-2 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"
                                    >
                                        <PlusCircle size={18} />
                                    </button>
                                    <button
                                        onClick={() => onEdit(producto)}
                                        className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(producto)}
                                        className="p-2 bg-rose-600/20 text-rose-400 rounded-lg hover:bg-rose-600 hover:text-white transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
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
};

export default ProductTable;
