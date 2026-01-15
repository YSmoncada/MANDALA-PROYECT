import React, { useState } from "react";
import { Edit2, Trash2, PlusCircle, LayoutGrid, List } from "lucide-react";
import MovementModal from "./MovementModal";
import { UI_CLASSES } from "../../../constants/ui";

const ProductTable = ({ productos, onEdit, onDelete, onMovimiento }) => {
    const [movimientoModalOpen, setMovimientoModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

    const openMovimiento = (producto) => {
        setSelectedProduct(producto);
        setMovimientoModalOpen(true);
    };

    const handleMovimientoSubmit = async (payload) => {
        await onMovimiento(payload);
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
                                <th className="px-6 py-4 text-center">Stock</th>
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
                                                    <span className="text-purple-400 font-bold">{producto.nombre.charAt(0)}</span>
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
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className={`text-lg font-black ${producto.stock <= producto.stock_minimo ? 'text-rose-500' : 'text-emerald-400'}`}>
                                                {producto.stock}
                                            </span>
                                            {producto.stock <= producto.stock_minimo && (
                                                <span className="text-[10px] text-rose-400 font-bold uppercase animate-pulse">Bajo Stock</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-white">
                                        ${parseFloat(producto.precio).toFixed(2)}
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
                                            <span className="text-purple-400 font-bold text-xl">{producto.nombre.charAt(0)}</span>
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-bold text-white uppercase group-hover:text-purple-400 transition-colors">{producto.nombre}</h3>
                                        <span className="text-[10px] text-blue-400 font-bold uppercase">{producto.categoria}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-xl font-black ${producto.stock <= producto.stock_minimo ? 'text-rose-500' : 'text-emerald-400'}`}>
                                        {producto.stock}
                                    </div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase">Stock</div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                                <span className="text-lg font-bold text-white">${parseFloat(producto.precio).toFixed(2)}</span>
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
