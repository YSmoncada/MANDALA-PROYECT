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
                            <div className="absolute inset-0 border-4 border-zinc-100 dark:border-zinc-800 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-t-zinc-900 dark:border-t-white rounded-full animate-spin"></div>
                        </div>
                        <p className="text-zinc-400 dark:text-zinc-500 font-black tracking-[0.4em] text-[10px] uppercase animate-pulse">Monitor de pedidos activo...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-0 animate-fadeIn text-zinc-900 dark:text-white">
                        {pedidos.length > 0 ? pedidos.map(pedido => (
                            <div
                                key={pedido.id}
                                className="bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200 dark:border-white/5 p-8 rounded-[2.5rem] flex flex-col justify-between transition-all duration-500 transform hover:-translate-y-2 shadow-xl dark:shadow-none overflow-visible group"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h2 className="font-black text-4xl text-zinc-900 dark:text-white tracking-tighter mb-1 uppercase">
                                                #{pedido.id}
                                            </h2>
                                            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5 font-black uppercase tracking-[0.2em]">
                                                <Clock size={12} className="text-zinc-900 dark:text-zinc-300" /> 
                                                {new Date(pedido.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handlePrint(pedido)}
                                            className="p-4 bg-zinc-50 dark:bg-white/5 hover:bg-zinc-900 dark:hover:bg-white rounded-[1.25rem] text-zinc-400 hover:text-white dark:hover:text-black transition-all border border-zinc-100 dark:border-white/10 shadow-inner group active:scale-95"
                                            title="Imprimir"
                                        >
                                            <Printer size={20} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-zinc-50 dark:bg-black/30 p-5 rounded-[1.5rem] border border-zinc-100 dark:border-white/5 shadow-inner">
                                            <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-widest block mb-2">Mesa</span>
                                            <span className="font-black text-3xl text-zinc-900 dark:text-white tracking-tighter">#{pedido.mesa_numero}</span>
                                        </div>
                                        <div className="bg-zinc-50 dark:bg-black/30 p-5 rounded-[1.5rem] border border-zinc-100 dark:border-white/5 shadow-inner">
                                            <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-widest block mb-2">Responsable</span>
                                            <span className="font-black text-[11px] text-zinc-900 dark:text-white uppercase truncate block mt-1 tracking-wider leading-tight">{pedido.mesera_nombre}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-[0.3em] block">Comanda</span>
                                            <div className="h-px flex-grow bg-zinc-100 dark:bg-white/5"></div>
                                        </div>
                                        <div className="space-y-2 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                                            {pedido.productos_detalle.map((item, index) => (
                                                <div key={index} className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-white/[0.02] rounded-2xl border border-zinc-100 dark:border-white/5 group transition-all hover:bg-zinc-100 dark:hover:bg-white/[0.05]">
                                                    <div className="flex gap-4 items-center">
                                                        <span className="font-black text-zinc-900 dark:text-white text-xl">x{item.cantidad}</span>
                                                        <span className="text-[11px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest leading-tight">{item.producto_nombre}</span>
                                                    </div>
                                                    {item.cantidad - (item.cantidad_despachada || 0) > 0 && (
                                                        <button
                                                            onClick={() => handleDespacharProducto(pedido.id, item.id)}
                                                            className="p-2.5 bg-white dark:bg-zinc-800 hover:bg-emerald-500 dark:hover:bg-emerald-500 text-zinc-400 dark:text-zinc-500 hover:text-white dark:hover:text-white rounded-xl transition-all border border-zinc-200 dark:border-white/5 shadow-sm active:scale-90"
                                                        >
                                                            <Check size={16} />
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
                                        className="py-4 px-6 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-500 dark:text-rose-400 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-rose-500 dark:hover:bg-rose-500 hover:text-white dark:hover:text-white transition-all active:scale-95"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => handleUpdateEstado(pedido.id, 'despachado')}
                                        className="py-4 px-6 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:text-white dark:hover:text-white transition-all active:scale-95 shadow-lg shadow-emerald-500/5 dark:shadow-none"
                                    >
                                        Listo
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-40 bg-zinc-50 dark:bg-white/[0.01] rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-white/10">
                                <div className="inline-block p-10 rounded-full bg-white dark:bg-white/5 mb-8 shadow-inner border border-zinc-100 dark:border-white/10">
                                    <Clock size={40} className="text-zinc-200 dark:text-zinc-800" />
                                </div>
                                <p className="text-zinc-400 dark:text-zinc-600 font-black tracking-[0.4em] uppercase text-[10px]">Silencio en la barra • No hay pedidos pendientes</p>
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
