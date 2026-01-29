import { memo } from 'react';
import { Plus } from 'lucide-react';
import StatusBadge from './StatusBadge';

const PedidoCard = memo(({ pedido, onAgregarProductos }) => {
    return (
        <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-4 pb-3 border-b border-white/5">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h2 className="font-bold text-xl text-white">Pedido #{pedido.id}</h2>
                        <StatusBadge estado={pedido.estado} />
                    </div>
                    <p className="text-sm text-zinc-400">
                        Mesa: <span className="text-white font-bold">{pedido.mesa_numero}</span>
                    </p>
                </div>
                <div className="text-right flex-shrink-0 text-zinc-500">
                    <p className="text-xs">{new Date(pedido.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-xs">{new Date(pedido.fecha_hora).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="space-y-2 mb-6 max-h-40 overflow-y-auto pr-2 flex-grow custom-scrollbar">
                {pedido.productos_detalle.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-black/40 p-2 rounded-lg text-sm border border-white/5">
                        <div className="flex items-center gap-2">
                            <span className="bg-white/10 text-white font-bold px-1.5 py-0.5 rounded text-xs">{item.cantidad}x</span>
                            <span className="text-zinc-300">{item.producto_nombre}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-auto">
                <div className="flex items-center justify-between pt-4 border-t border-white/5 mb-4 text-white">
                    <span className="text-sm text-zinc-400">Total</span>
                    <span className="text-2xl font-black">${parseFloat(pedido.total).toLocaleString('es-CO')}</span>
                </div>

                <button
                    onClick={() => onAgregarProductos(pedido.mesa)}
                    className="w-full py-3 bg-white hover:bg-zinc-200 text-black rounded-xl font-bold text-sm uppercase tracking-wide transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
                >
                    <Plus size={16} />
                    Agregar Productos
                </button>
            </div>
        </div>
    );
});

export default PedidoCard;