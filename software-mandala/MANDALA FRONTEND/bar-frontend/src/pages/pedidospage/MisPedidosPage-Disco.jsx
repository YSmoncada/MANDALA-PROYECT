import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { usePedidosContext } from '../../context/PedidosContext';
import HeaderPedidosDisco from './HeaderPedidos-Disco';
import { useMisPedidos } from '../../hooks/useMisPedidos';
import PedidoCard from './PedidoCard';

const MisPedidosPageDisco = () => {
    const { auth, setSelectedMesaId, setIsTableLocked } = usePedidosContext();
    const { userName, userId, role, codigoConfirmado, handleLogout } = auth;
    const navigate = useNavigate();

    useEffect(() => {
        // Redirigir si no hay un perfil seleccionado o el código no está confirmado
        if (!userName || !codigoConfirmado) {
            navigate('/login');
            return;
        }
    }, [userName, codigoConfirmado, navigate]);

    // Usar el hook para obtener los pedidos filtrados por el usuario actual
    const { pedidos, loading } = useMisPedidos(userId, role);

    const handleAgregarProductos = useCallback((mesaId) => {
        setSelectedMesaId(mesaId);
        setIsTableLocked(true);
        navigate('/pedidos-disco');
    }, [setSelectedMesaId, setIsTableLocked, navigate]);

    return (
        <div className="min-h-screen bg-transparent text-white dark:text-white transition-colors duration-500 selection:bg-[#A944FF]/30">
            <HeaderPedidosDisco user={userName} onLogout={handleLogout} codigoConfirmado={codigoConfirmado} />

            {/* Background effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#441E73]/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#A944FF]/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto p-6 sm:p-10 pt-32">
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-6xl font-black mb-4 text-white dark:text-white uppercase tracking-tighter italic drop-shadow-2xl">
                        Mis Pedidos de Hoy
                    </h1>
                    <p className="text-[#8A7BAF] dark:text-zinc-500 font-black uppercase tracking-[0.4em] text-[10px]">Gestiona tus pedidos activos del turno</p>
                </div>

                {loading ? (
                    <div className="text-center py-32 animate-fadeIn">
                        <div className="inline-block p-6 bg-[#1A103C]/50 dark:bg-zinc-900/50 rounded-[2rem] border border-white/10 mb-8 shadow-2xl">
                            <div className="animate-spin rounded-[1rem] h-12 w-12 border-4 border-[#6C3FA8]/20 border-t-[#A944FF] dark:border-t-white shadow-inner"></div>
                        </div>
                        <p className="text-[#8A7BAF] dark:text-zinc-500 font-black tracking-[0.4em] text-[11px] uppercase animate-pulse">Sincronizando Ordenes...</p>
                    </div>
                ) : pedidos.length === 0 ? (
                    <div className="text-center py-20 px-10 bg-[#1A103C]/80 dark:bg-zinc-900/30 rounded-[3rem] border border-white/10 dark:border-white/5 backdrop-blur-2xl max-w-2xl mx-auto shadow-2xl dark:shadow-none animate-scaleIn">
                        <div className="inline-block p-8 rounded-[2rem] bg-[#0E0D23] dark:bg-zinc-800/30 mb-8 border border-white/5 shadow-inner">
                            <ShoppingBag size={56} className="text-[#A944FF] dark:text-white opacity-80" />
                        </div>
                        <p className="text-xl font-black mb-3 uppercase tracking-tighter text-white italic">No tienes pedidos activos</p>
                        <p className="text-[#8A7BAF] dark:text-zinc-500 mb-10 font-black uppercase tracking-[0.2em] text-[10px]">Comienza a tomar pedidos para verlos aquí</p>
                        <button
                            onClick={() => navigate('/pedidos-disco')}
                            className="px-12 py-5 bg-gradient-to-r from-[#8A44FF] to-[#A944FF] dark:from-white dark:to-zinc-200 text-white dark:text-black hover:brightness-110 rounded-2xl font-black shadow-[0_20px_40px_-10px_rgba(169,68,255,0.4)] transition-all active:scale-95 uppercase text-[11px] tracking-[0.3em] border border-white/20 dark:border-transparent"
                        >
                            Tomar Nuevo Pedido
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
                        {pedidos.map(pedido => (
                            <PedidoCard
                                key={pedido.id}
                                pedido={pedido}
                                onAgregarProductos={handleAgregarProductos}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MisPedidosPageDisco;
