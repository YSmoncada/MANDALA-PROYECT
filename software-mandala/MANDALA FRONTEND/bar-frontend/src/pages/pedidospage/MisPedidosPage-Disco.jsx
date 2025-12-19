import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { usePedidosContext } from '../../context/PedidosContext';
import HeaderPedidosDisco from '../pedidospage/HeaderPedidos-Disco';
import { useMisPedidos } from '../../hooks/useMisPedidos'; // Importamos el nuevo Hook
import PedidoCard from './components/PedidoCard'; // Importar componente

const MisPedidosPageDisco = () => {
    const { auth, setSelectedMesaId, setIsTableLocked } = usePedidosContext();
    const { mesera, meseraId, codigoConfirmado, handleLogout } = auth;
    const navigate = useNavigate();

    useEffect(() => {
        if (!mesera || !codigoConfirmado) {
            navigate('/login-disco');
            return;
        }
    }, [mesera, codigoConfirmado, navigate]);

    // Usamos el hook para obtener los datos y el estado de carga. ¡Así de simple!
    const { pedidos, loading } = useMisPedidos(meseraId);

    const handleAgregarProductos = useCallback((mesaId) => {
        setSelectedMesaId(mesaId);
        setIsTableLocked(true);
        navigate('/login-disco');
    }, [setSelectedMesaId, setIsTableLocked, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
            <HeaderPedidosDisco mesera={mesera} onLogout={handleLogout} codigoConfirmado={codigoConfirmado} />

            <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-8 pt-24">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-black mb-3 text-white">
                        Mis Pedidos de Hoy
                    </h1>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block p-4 bg-white/5 rounded-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                        </div>
                        <p className="mt-4">Cargando tus pedidos...</p>
                    </div>
                ) : pedidos.length === 0 ? (
                    <div className="text-center py-16 bg-purple-900/20 rounded-3xl border border-purple-500/30 backdrop-blur-sm">
                        <ShoppingBag size={48} className="mx-auto text-purple-400 mb-4" />
                        <p className="text-xl font-bold mb-2">No tienes pedidos hoy</p>
                        <button
                            onClick={() => navigate('/login-disco')}
                            className="mt-4 px-6 py-3 bg-purple-600 rounded-xl font-bold text-white hover:scale-105 transition-transform"
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
