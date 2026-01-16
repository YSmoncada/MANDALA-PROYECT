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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
            <HeaderPedidosDisco user={userName} onLogout={handleLogout} codigoConfirmado={codigoConfirmado} />

            <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-8 pt-24">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-black mb-3 text-white uppercase tracking-tight drop-shadow-[0_0_20px_rgba(169,68,255,0.4)]">
                        Mis Pedidos de Hoy
                    </h1>
                    <p className="text-[#C2B6D9] font-light">Gestiona tus pedidos activos</p>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block p-4 bg-white/5 rounded-full mb-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#A944FF]"></div>
                        </div>
                        <p className="text-[#8A7BAF] font-bold tracking-widest text-xs uppercase">Cargando tus pedidos...</p>
                    </div>
                ) : pedidos.length === 0 ? (
                    <div className="text-center py-20 bg-[#441E73]/20 rounded-3xl border border-[#6C3FA8]/30 backdrop-blur-sm max-w-2xl mx-auto">
                        <div className="inline-block p-6 rounded-full bg-[#441E73]/30 mb-6">
                            <ShoppingBag size={48} className="text-[#8A7BAF]" />
                        </div>
                        <p className="text-xl font-bold mb-2 uppercase text-white">No tienes pedidos hoy</p>
                        <p className="text-[#8A7BAF] mb-8">Comienza a tomar pedidos para verlos aquí</p>
                        <button
                            onClick={() => navigate('/pedidos-disco')}
                            className="px-8 py-4 bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] rounded-xl font-bold text-white shadow-lg shadow-[#A944FF]/20 hover:scale-105 transition-transform active:scale-95 uppercase text-sm tracking-widest"
                        >
                            Crear Nuevo Pedido
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
