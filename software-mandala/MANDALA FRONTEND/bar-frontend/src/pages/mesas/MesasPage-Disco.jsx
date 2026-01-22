import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Users, Table } from 'lucide-react';
import MesaForm from './MesaForm';
import toast from 'react-hot-toast';
import { usePedidosContext } from '../../context/PedidosContext';
import { useMesasManagement } from '../../hooks/useMesasManagement';
import MesaCard from './components/MesaCard';
import StaffListItem from './components/StaffListItem';
import { UI_CLASSES } from '../../constants/ui';

/**
 * Premium Management Page for Mesas and Staff Profiles.
 * Organized with custom hooks and sub-components.
 */
const MesasPageDisco = () => {
    const navigate = useNavigate();
    const { auth } = usePedidosContext();
    const { 
        mesas, 
        loading, 
        handleAddMesa, 
        handleDeleteMesa 
    } = useMesasManagement();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
                </div>
                <p className="ml-4 font-bold tracking-widest text-[#C2B6D9] uppercase text-xs">Cargando...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white selection:bg-purple-500/30 overflow-x-hidden">
            {/* Background Aesthetics */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
            </div>

            <main className="flex-1 p-4 pt-24 pb-20 sm:p-8 relative z-10 max-w-7xl mx-auto w-full">
                {/* Back Navigation */}
                <button
                    onClick={() => navigate("/home-disco")}
                    className={`fixed top-6 left-6 z-50 ${UI_CLASSES.buttonBack} backdrop-blur-xl shadow-lg`}
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold uppercase tracking-wider text-xs">Volver</span>
                </button>

                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-black mb-4 text-white tracking-tight drop-shadow-[0_0_15px_rgba(168,85,247,0.3)] uppercase">
                        Configuración de Mesas
                    </h1>
                    <p className="text-lg text-[#C2B6D9] font-light italic">Administra la distribución de las mesas en el salón</p>
                    <div className="h-1.5 w-32 bg-gradient-to-r from-[#A944FF] via-[#FF4BC1] to-transparent rounded-full mx-auto mt-4 shadow-[0_0_10px_rgba(169,68,255,0.5)]"></div>
                </div>

                <div className="space-y-6 max-w-5xl mx-auto">
                    <div className={`${UI_CLASSES.glassCard} p-6 shadow-2xl relative overflow-hidden group border-white/10`}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A944FF] to-transparent"></div>
                        
                        <MesaForm key="form" onSubmit={handleAddMesa} />

                        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 mt-8">
                            {mesas.map((mesa) => (
                                <MesaCard 
                                    key={mesa.id} 
                                    mesa={mesa} 
                                    onDelete={handleDeleteMesa} 
                                />
                            ))}
                        </div>

                        {mesas.length === 0 && (
                            <div className="text-center py-20 border-2 border-dashed border-[#6C3FA8]/30 rounded-2xl bg-black/20">
                                <p className="text-[#8A7BAF] font-bold uppercase tracking-[0.2em] text-[10px]">No hay mesas configuradas</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MesasPageDisco;
