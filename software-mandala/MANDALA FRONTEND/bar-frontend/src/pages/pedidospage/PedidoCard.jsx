import { memo } from 'react';
import { Plus } from 'lucide-react';
import StatusBadge from './StatusBadge';

const PedidoCard = memo(({ pedido, onAgregarProductos }) => {
    return (
        <div className="bg-purple-950/40 backdrop-blur-md border border-purple-700/40 rounded-2xl p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4 pb-3 border-b border-purple-700/30">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h2 className="font-bold text-xl">Pedido #{pedido.id}</h2>
                        <StatusBadge estado={pedido.estado} />
                    </div>
                    <p className="text-sm">
                        Mesa: <span className="text-pink-400 font-bold">{pedido.mesa_numero}</span>
                    </p>
                </div>
                <div className="text-right flex-shrink-0">
                    <p className="text-xs">{new Date(pedido.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-xs">{new Date(pedido.fecha_hora).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="space-y-2 mb-6 max-h-40 overflow-y-auto pr-2 flex-grow">
                {pedido.productos_detalle.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-purple-900/40 p-2 rounded-lg text-sm">
                        <div className="flex items-center gap-2">
                            <span className="bg-purple-600/30 text-purple-400 font-bold px-1.5 py-0.5 rounded text-xs">{item.cantidad}x</span>
                            <span>{item.producto_nombre}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-auto">
                <div className="flex items-center justify-between pt-4 border-t border-purple-700/30 mb-4">
                    <span className="text-sm">Total</span>
                    <span className="text-2xl font-black">${parseFloat(pedido.total).toLocaleString('es-CO')}</span>
                </div>

                <button
                    onClick={() => onAgregarProductos(pedido.mesa)}
                    className="w-full py-3 bg-purple-700 hover:bg-purple-500 text-white rounded-xl font-bold text-sm uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
                >
                    <Plus size={16} />
                    Agregar Productos
                </button>
            </div>
        </div>
    );
});

export default PedidoCard;