import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import TicketPrinter from '../../components/TicketPrinter';
import { usePedidosContext } from '../../context/PedidosContext';
import { useHistorialPedidos } from '../../hooks/useHistorialPedidos';
import { UI_CLASSES } from '../../constants/ui';

// Sub-components
import StatsCards from './components/StatsCards';
import HistoryFilter from './components/HistoryFilter';
import OrderHistoryItem from './components/OrderHistoryItem';

import ThemeToggle from '../../components/ThemeToggle';

const HistorialPedidosPageDisco = () => {
    const navigate = useNavigate();
    const { auth } = usePedidosContext();
    const { role, userRole } = auth;
    
    // Admin check for deletion permissions
    const isAdmin = role === 'admin' || userRole === 'admin' || role === 'prueba' || userRole === 'prueba';

    const {
        pedidos,
        vendedores,
        loading,
        totalVentas,
        fechaSeleccionada,
        vendedorSeleccionado,
        pedidoAImprimir,
        empresaConfig,
        setFechaSeleccionada,
        setVendedorSeleccionado,
        handlePrint,
        handleUpdateEstado,
        handleBorrarHistorial
    } = useHistorialPedidos();

    const handleClearFilters = () => {
        setVendedorSeleccionado('');
        setFechaSeleccionada('');
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black text-zinc-900 dark:text-white selection:bg-zinc-200 dark:selection:bg-zinc-800 transition-colors duration-300 overflow-x-hidden relative" style={{ WebkitOverflowScrolling: 'touch' }}>
            {/* Background Glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-zinc-100 dark:from-zinc-900/20 to-transparent pointer-events-none"></div>
            </div>

            {/* Hidden Print Section */}
            <TicketPrinter pedido={pedidoAImprimir} empresaConfig={empresaConfig} />

            <main className="flex-1 p-4 pt-24 pb-20 sm:p-8 relative z-10">
                {/* Header Controls */}
                <div className="fixed top-6 left-6 right-6 z-50 flex justify-between items-center no-print">
                    <button
                        onClick={() => navigate('/')}
                        className={`${UI_CLASSES.buttonBack} backdrop-blur-xl shadow-none border-zinc-200 dark:border-white/5 bg-white/50 dark:bg-black/50 hover:bg-zinc-200 dark:hover:bg-zinc-900 text-zinc-900 dark:text-white`}
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                        <span className="font-bold uppercase tracking-wider text-xs">Volver</span>
                    </button>
                    <ThemeToggle />
                </div>

                <div className="max-w-6xl mx-auto no-print">
                    <header className="mb-12 text-center pt-8">
                        <h1 className="text-4xl sm:text-6xl font-black mb-4 text-zinc-900 dark:text-white tracking-tighter uppercase italic drop-shadow-lg">
                            Historial de Ventas
                        </h1>
                    </header>

                    {/* Filters Section */}
                    <HistoryFilter 
                        vendedores={vendedores}
                        vendedorSeleccionado={vendedorSeleccionado}
                        setVendedorSeleccionado={setVendedorSeleccionado}
                        fechaSeleccionada={fechaSeleccionada}
                        setFechaSeleccionada={setFechaSeleccionada}
                        onClear={handleClearFilters}
                        onDeleteHistory={handleBorrarHistorial}
                        isAdmin={isAdmin}
                    />

                    {/* Stats Section */}
                    <StatsCards 
                        totalVentas={totalVentas}
                        totalPedidos={pedidos.length}
                    />

                    {/* Orders List */}
                    <div className="space-y-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-24 bg-zinc-100 dark:bg-zinc-900/30 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-sm">
                                <Loader2 size={48} className="text-zinc-900 dark:text-white animate-spin mb-4" />
                                <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm animate-pulse">Cargando Historial...</p>
                            </div>
                        ) : pedidos.length > 0 ? (
                            pedidos.map(pedido => (
                                <OrderHistoryItem 
                                    key={pedido.id}
                                    pedido={pedido}
                                    onPrint={handlePrint}
                                    onUpdateStatus={handleUpdateEstado}
                                />
                            ))
                        ) : (
                            <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
                                <div className="p-4 bg-zinc-100 dark:bg-zinc-800/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <AlertCircle className="text-zinc-400" size={32} />
                                </div>
                                <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">No hay resultados</p>
                                <p className="text-zinc-400 dark:text-zinc-600 text-xs mt-2">Intenta ajustar los filtros o selecciona un vendedor</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.4);
                }
            `}} />
        </div>
    );
};

export default HistorialPedidosPageDisco;
