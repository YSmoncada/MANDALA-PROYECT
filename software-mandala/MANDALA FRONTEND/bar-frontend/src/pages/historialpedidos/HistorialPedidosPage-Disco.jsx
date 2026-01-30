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
        <div className="min-h-screen flex flex-col bg-transparent text-white dark:text-zinc-200 selection:bg-[#A944FF]/30 transition-colors duration-500 overflow-x-hidden relative" style={{ WebkitOverflowScrolling: 'touch' }}>
            
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 pointer-events-none no-print">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#441E73]/10 dark:bg-zinc-900/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#A944FF]/5 dark:bg-white/5 rounded-full blur-[100px]"></div>
            </div>

            {/* Hidden Print Section */}
            <TicketPrinter pedido={pedidoAImprimir} empresaConfig={empresaConfig} />

            <main className="flex-1 p-4 pt-24 pb-20 sm:p-10 relative z-10">
                {/* Header Controls */}
                <div className="fixed top-8 left-8 right-8 z-50 flex justify-between items-center no-print">
                    <button
                        onClick={() => navigate('/')}
                        className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#0E0D23] dark:bg-zinc-800 border border-white/10 dark:border-white/5 text-[#8A7BAF] dark:text-zinc-400 hover:text-white dark:hover:text-white transition-all shadow-2xl active:scale-95 no-print"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                        <span className="font-black uppercase tracking-[0.2em] text-[10px]">Inicio</span>
                    </button>
                    <ThemeToggle />
                </div>

                <div className="max-w-7xl mx-auto no-print">
                    <header className="mb-20 text-center pt-12">
                        <h1 className="text-5xl sm:text-8xl font-black mb-4 text-white dark:text-white tracking-tighter uppercase italic drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]">
                            Ventas Mandala
                        </h1>
                        <p className="text-[11px] font-black text-[#A944FF] dark:text-zinc-500 uppercase tracking-[0.4em] opacity-80">Registro histórico de transacciones</p>
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
                    <div className="space-y-8">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-40">
                                <div className="w-20 h-20 border-4 border-[#6C3FA8]/20 dark:border-zinc-800 border-t-[#A944FF] dark:border-t-white rounded-[2rem] animate-spin mb-8 shadow-2xl"></div>
                                <p className="text-[#8A7BAF] dark:text-zinc-500 font-black tracking-[0.4em] text-[11px] uppercase animate-pulse">Consultando Registros...</p>
                            </div>
                        ) : pedidos.length > 0 ? (
                            <div className="grid grid-cols-1 gap-10">
                                {pedidos.map(pedido => (
                                    <OrderHistoryItem 
                                        key={pedido.id}
                                        pedido={pedido}
                                        onPrint={handlePrint}
                                        onUpdateStatus={handleUpdateEstado}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-40 px-4">
                                <div className="inline-block p-12 rounded-[3.5rem] bg-[#1A103C]/50 dark:bg-zinc-900/30 mb-8 border-2 border-dashed border-white/5 dark:border-zinc-800 relative group overflow-hidden">
                                     <div className="absolute inset-0 bg-gradient-to-br from-[#A944FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                    <AlertCircle className="text-[#8A7BAF] dark:text-zinc-700 relative z-10" size={64} />
                                </div>
                                <p className="text-3xl text-white dark:text-white font-black mb-4 uppercase tracking-tighter italic shadow-2xl">Sin Coincidencias</p>
                                <p className="text-[#8A7BAF] dark:text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-black">Intenta ajustar los filtros para encontrar lo que buscas</p>
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
