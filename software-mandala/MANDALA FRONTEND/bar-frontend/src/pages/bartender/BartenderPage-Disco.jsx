import React from 'react';
import { RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import TicketPrinter from '../../components/TicketPrinter';
import PageLayout from '../../components/PageLayout';
import { useBartenderOrders } from '../../hooks/useBartenderOrders';
import BartenderOrderCard from './components/BartenderOrderCard';

const BartenderPageDisco = () => {
    const {
        pedidos,
        loading,
        empresaConfig,
        pedidoAImprimir,
        handlePrint,
        handleUpdateEstado,
        handleDespacharProducto,
        handleCancelarPedido,
        refresh
    } = useBartenderOrders();

    return (
        <PageLayout title="Pedidos Pendientes">
            <TicketPrinter pedido={pedidoAImprimir} empresaConfig={empresaConfig} />

            <div className="max-w-7xl mx-auto pb-20 no-print">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-8 px-4 sm:px-0">
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                            Pedidos en Cola
                        </h2>
                        <p className="text-emerald-400/60 text-xs font-bold uppercase tracking-widest mt-1">
                            {pedidos.length} pendiente{pedidos.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button
                        onClick={() => refresh(true)}
                        className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 transition-all shadow-lg active:scale-95"
                        title="Actualizar pedidos"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Actualizar</span>
                    </button>
                </div>

                {/* Loading State */}
                {loading && pedidos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white/5 rounded-3xl border border-white/10">
                        <Loader2 size={48} className="text-emerald-400 animate-spin mb-6" />
                        <p className="text-emerald-400 font-black tracking-[0.3em] text-xs animate-pulse">
                            BUSCANDO PEDIDOS...
                        </p>
                    </div>
                ) : pedidos.length > 0 ? (
                    /* Orders Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0">
                        {pedidos.map(pedido => (
                            <BartenderOrderCard
                                key={pedido.id}
                                pedido={pedido}
                                onPrint={handlePrint}
                                onDespacharProducto={handleDespacharProducto}
                                onCancelar={handleCancelarPedido}
                                onCompletar={(id) => handleUpdateEstado(id, 'despachado')}
                            />
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-32 bg-white/5 rounded-[40px] border-2 border-dashed border-white/10">
                        <div className="p-4 bg-emerald-500/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="text-emerald-400" size={32} />
                        </div>
                        <p className="text-gray-400 font-black tracking-widest uppercase text-sm mb-2">
                            Todo Despejado
                        </p>
                        <p className="text-gray-600 text-xs">
                            No hay pedidos pendientes en este momento
                        </p>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .no-print { display: none !important; }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(16, 185, 129, 0.3);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(16, 185, 129, 0.5);
                }
            `}} />
        </PageLayout>
    );
};

export default BartenderPageDisco;
