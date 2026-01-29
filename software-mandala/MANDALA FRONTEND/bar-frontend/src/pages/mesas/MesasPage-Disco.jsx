import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Users, Table } from 'lucide-react';
import MesaForm from './MesaForm';
import toast from 'react-hot-toast';
import { usePedidosContext } from '../../context/PedidosContext';
import { useMesasManagement } from '../../hooks/useMesasManagement';
import MesaCard from './components/MesaCard';
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
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-zinc-800 border-t-white rounded-full animate-spin mx-auto mb-4 shadow-2xl"></div>
                    <div className="absolute inset-0 bg-white/5 blur-xl rounded-full"></div>
                </div>
                <p className="ml-4 font-bold tracking-widest text-zinc-500 uppercase text-xs animate-pulse">Cargando...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-black text-white selection:bg-zinc-800 overflow-x-hidden">
            {/* Background Aesthetics */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-zinc-900/20 to-transparent pointer-events-none"></div>
            </div>

            <main className="flex-1 p-4 pt-24 pb-20 sm:p-8 relative z-10 max-w-7xl mx-auto w-full">
                {/* Back Navigation */}
                <button
                    onClick={() => navigate("/home-disco")}
                    className={`fixed top-6 left-6 z-50 ${UI_CLASSES.buttonBack} shadow-none border-white/5 bg-black/50 hover:bg-zinc-900`}
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold uppercase tracking-wider text-xs">Volver</span>
                </button>

                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-black mb-4 text-white tracking-tight uppercase drop-shadow-lg">
                        Configuración de Mesas
                    </h1>
                    <p className="text-lg text-zinc-400 font-light italic">Administra la distribución de las mesas en el salón</p>
                    <div className="h-px w-32 bg-gradient-to-r from-transparent via-zinc-700 to-transparent mx-auto mt-6 opaque-50"></div>
                </div>

                <div className="space-y-6 max-w-5xl mx-auto">
                    <div className={`${UI_CLASSES.glassCard} p-6 shadow-2xl relative overflow-hidden group border-white/5 bg-zinc-900/30 backdrop-blur-xl`}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                        
                        <MesaForm key="form" onSubmit={handleAddMesa} />

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-8">
                            {mesas.map((mesa) => (
                                <MesaCard 
                                    key={mesa.id} 
                                    mesa={mesa} 
                                    onDelete={handleDeleteMesa} 
                                />
                            ))}
                        </div>

                        {mesas.length === 0 && (
                            <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-2xl bg-black/40">
                                <p className="text-zinc-600 font-bold uppercase tracking-[0.2em] text-[10px]">No hay mesas configuradas</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MesasPageDisco;
