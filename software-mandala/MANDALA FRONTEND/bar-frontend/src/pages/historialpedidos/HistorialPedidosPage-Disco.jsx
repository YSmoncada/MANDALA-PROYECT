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
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white selection:bg-purple-500/30 overflow-x-hidden relative" style={{ WebkitOverflowScrolling: 'touch' }}>
            {/* Background Glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Hidden Print Section */}
            <TicketPrinter pedido={pedidoAImprimir} empresaConfig={empresaConfig} />

            <main className="flex-1 p-4 pt-24 pb-20 sm:p-8 relative z-10">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className={`fixed top-6 left-6 z-50 ${UI_CLASSES.buttonBack} backdrop-blur-xl no-print shadow-lg`}
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                    <span className="font-bold uppercase tracking-wider text-xs">Volver</span>
                </button>

                <div className="max-w-6xl mx-auto no-print">
                    <header className="mb-12 text-center">
                        <h1 className="text-4xl sm:text-6xl font-black mb-4 text-white tracking-tighter drop-shadow-[0_0_25px_rgba(168,85,247,0.4)] uppercase italic">
                            Historial de Ventas
                        </h1>
                        <p className="text-purple-300/60 font-bold uppercase tracking-[0.3em] text-[10px]">
                            Registro Maestro de Operaciones
                        </p>
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
                            <div className="flex flex-col items-center justify-center py-24 bg-[#441E73]/20 rounded-3xl border border-[#6C3FA8]/30">
                                <Loader2 size={48} className="text-[#A944FF] animate-spin mb-4" />
                                <p className="text-purple-300 font-bold uppercase tracking-widest text-sm animate-pulse">Cargando Historial...</p>
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
                            <div className="text-center py-20 bg-[#441E73]/20 rounded-3xl border border-dashed border-[#6C3FA8]/50">
                                <div className="p-4 bg-[#A944FF]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <AlertCircle className="text-[#A944FF]" size={32} />
                                </div>
                                <p className="text-[#C2B6D9] font-bold uppercase tracking-widest text-sm">No hay resultados</p>
                                <p className="text-gray-500 text-xs mt-2">Intenta ajustar los filtros o selecciona un vendedor</p>
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
                    background: rgba(169, 68, 255, 0.3);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(169, 68, 255, 0.5);
                }
            `}} />
        </div>
    );
};

export default HistorialPedidosPageDisco;
