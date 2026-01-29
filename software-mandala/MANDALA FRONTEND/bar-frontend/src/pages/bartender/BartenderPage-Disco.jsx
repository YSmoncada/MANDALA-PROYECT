import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Clock, X, Printer, RefreshCw } from 'lucide-react';
import TicketPrinter from '../../components/TicketPrinter';
import PageLayout from '../../components/PageLayout';
import { UI_CLASSES } from '../../constants/ui';
import { useBartenderOrders } from '../../hooks/useBartenderOrders';
import toast from 'react-hot-toast';

const BartenderPageDisco = () => {
    const {
        pedidos,
        loading,
        empresaConfig,
        refresh,
        updateOrderStatus,
        dispatchProduct,
        isUpdating
    } = useBartenderOrders();

    const [pedidoAImprimir, setPedidoAImprimir] = React.useState(null);
    const navigate = useNavigate();

    const handlePrint = (pedido) => {
        setPedidoAImprimir(pedido);
        setTimeout(() => {
            window.print();
        }, 500);
    };

    const handleUpdateEstado = (pedidoId, nuevoEstado) => {
        updateOrderStatus(pedidoId, nuevoEstado);
    };

    const handleDespacharProducto = (pedidoId, itemId) => {
        dispatchProduct(pedidoId, itemId);
    };

    return (
        <PageLayout title="Pedidos Pendientes">
            <TicketPrinter pedido={pedidoAImprimir} empresaConfig={empresaConfig} />

            <div className="max-w-7xl mx-auto pb-20 no-print">
                {/* Header Actions */}
                <div className="flex justify-end mb-10 gap-4 px-4 sm:px-0">
                    <button
                        onClick={refresh}
                        className={UI_CLASSES.buttonSecondary + " px-4 py-4"}
                        title="Refrescar pedidos"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>

                {loading && pedidos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <div className="relative w-20 h-20 mb-8">
                            <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-t-white rounded-full animate-spin"></div>
                        </div>
                        <p className="text-zinc-500 font-bold tracking-[0.4em] text-[10px] uppercase animate-pulse">Monitor de pedidos activo...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-0 animate-fadeIn">
                        {pedidos.length > 0 ? pedidos.map(pedido => (
                            <div
                                key={pedido.id}
                                className={`${UI_CLASSES.glassCard} bg-zinc-900/40 hover:border-white/20 p-8 flex flex-col justify-between transition-all duration-500 transform hover:-translate-y-1 shadow-2xl overflow-visible backdrop-blur-md`}
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h2 className="font-black text-3xl text-white tracking-tighter mb-1">
                                                #{pedido.id}
                                            </h2>
                                            <p className="text-[10px] text-zinc-500 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                                                <Clock size={12} className="text-white" /> 
                                                {new Date(pedido.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handlePrint(pedido)}
                                            className="p-4 bg-white/5 hover:bg-white rounded-2xl text-zinc-400 hover:text-black transition-all border border-white/5 shadow-xl group active:scale-95"
                                            title="Imprimir"
                                        >
                                            <Printer size={20} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-1">Mesa</span>
                                            <span className="font-black text-3xl text-white">#{pedido.mesa_numero}</span>
                                        </div>
                                        <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-1">Mesera</span>
                                            <span className="font-black text-xs text-white uppercase truncate block mt-2">{pedido.mesera_nombre}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em] block">Productos</span>
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                            {pedido.productos_detalle.map((item, index) => (
                                                <div key={index} className="flex justify-between items-center p-3 bg-white/[0.02] rounded-xl border border-white/5 group transition-colors hover:bg-white/[0.05]">
                                                    <div className="flex gap-4 items-center">
                                                        <span className="font-black text-white text-lg">x{item.cantidad}</span>
                                                        <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide leading-tight">{item.producto_nombre}</span>
                                                    </div>
                                                    {item.cantidad - (item.cantidad_despachada || 0) > 0 && (
                                                        <button
                                                            onClick={() => handleDespacharProducto(pedido.id, item.id)}
                                                            className="p-2 bg-zinc-800 hover:bg-white text-zinc-400 hover:text-black rounded-lg transition-all border border-white/5 shadow-xl active:scale-90"
                                                        >
                                                            <Check size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleUpdateEstado(pedido.id, 'cancelado')}
                                        className={UI_CLASSES.buttonDanger + " py-4"}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => handleUpdateEstado(pedido.id, 'despachado')}
                                        className={UI_CLASSES.buttonSuccess + " py-4"}
                                    >
                                        Listo
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-40 bg-white/[0.01] rounded-[3rem] border-2 border-dashed border-white/5">
                                <p className="text-zinc-600 font-bold tracking-[0.4em] uppercase text-[10px]">Silencio en la barra • No hay pedidos pendientes</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .no-print { display: none !important; }
                }
            `}} />
        </PageLayout>
    );
};

export default BartenderPageDisco;
