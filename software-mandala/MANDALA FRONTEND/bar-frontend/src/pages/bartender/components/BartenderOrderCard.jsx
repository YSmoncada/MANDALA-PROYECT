import React from 'react';
import { Check, Clock, X, Printer } from 'lucide-react';
import { UI_CLASSES } from '../../../constants/ui';

const BartenderOrderCard = ({ 
    pedido, 
    onPrint, 
    onDespacharProducto, 
    onCancelar, 
    onCompletar 
}) => {
    return (
        <div
            className={`${UI_CLASSES.glassCard} hover:border-emerald-500/40 p-5 flex flex-col justify-between transition-all duration-300 transform hover:translate-y-[-4px] active:scale-[0.98] relative overflow-hidden group`}
        >
            {/* Accent Border */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-cyan-400"></div>

            <div>
                {/* Header */}
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
                    <h2 className="font-black text-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent italic">
                        #{pedido.id}
                    </h2>
                    <button
                        onClick={() => onPrint(pedido)}
                        className="p-2 bg-white/5 hover:bg-emerald-500/20 rounded-lg text-emerald-400 hover:text-emerald-300 transition-all border border-white/5 shadow-lg active:scale-95"
                        title="Imprimir Ticket"
                    >
                        <Printer size={18} />
                    </button>
                </div>

                {/* Order Info */}
                <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Mesa</span>
                        <span className="font-black text-2xl text-white">{pedido.mesa_numero}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Atiende</span>
                        <span className="text-sm font-bold text-gray-300 uppercase">{pedido.mesera_nombre}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 flex items-center justify-end gap-1 font-mono">
                        <Clock size={10} /> {new Date(pedido.fecha_hora).toLocaleTimeString()}
                    </p>
                </div>

                {/* Products List */}
                <div className="space-y-3 mb-6 bg-black/20 p-4 rounded-xl border border-white/5 max-h-64 overflow-y-auto custom-scrollbar">
                    {pedido.productos_detalle.map((item, index) => {
                        const pendientes = item.cantidad - (item.cantidad_despachada || 0);
                        const isCompleted = pendientes === 0;

                        return (
                            <div 
                                key={index} 
                                className={`flex justify-between items-start group/item ${isCompleted ? 'opacity-50' : ''}`}
                            >
                                <div className="flex gap-3 flex-1">
                                    <span className={`font-black text-lg ${isCompleted ? 'text-gray-600' : 'text-emerald-400'}`}>
                                        x{item.cantidad}
                                    </span>
                                    <div className="flex flex-col">
                                        <span className={`text-sm font-bold uppercase leading-tight ${isCompleted ? 'text-gray-600 line-through' : 'text-white'}`}>
                                            {item.producto_nombre}
                                        </span>
                                        {item.cantidad_despachada > 0 && (
                                            <span className="text-[10px] text-emerald-400 font-bold mt-1">
                                                ✓ {item.cantidad_despachada} despachado{item.cantidad_despachada > 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {pendientes > 0 && (
                                    <button
                                        onClick={() => onDespacharProducto(pedido.id, item.id)}
                                        className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-lg transition-all border border-emerald-500/20 shadow-lg active:scale-95"
                                        title="Marcar como listo"
                                    >
                                        <Check size={14} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                    onClick={() => onCancelar(pedido.id)}
                    className={`${UI_CLASSES.buttonDanger} text-xs py-3 uppercase tracking-tighter flex items-center justify-center gap-2`}
                >
                    <X size={16} /> Cancelar
                </button>
                <button
                    onClick={() => onCompletar(pedido.id)}
                    className={`${UI_CLASSES.buttonSuccess} text-xs py-3 uppercase tracking-tighter bg-emerald-600 flex items-center justify-center gap-2`}
                >
                    <Check size={16} /> Completar
                </button>
            </div>
        </div>
    );
};

export default BartenderOrderCard;
