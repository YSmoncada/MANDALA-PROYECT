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
import ThemeToggle from '../../components/ThemeToggle';

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
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-zinc-900 dark:text-white transition-colors duration-300">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-zinc-100 dark:border-zinc-800 border-t-zinc-900 dark:border-t-white rounded-full animate-spin mx-auto mb-4 shadow-xl"></div>
                </div>
                <p className="ml-4 font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase text-xs animate-pulse">Cargando...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-transparent text-white dark:text-zinc-200 selection:bg-purple-500/30 transition-colors duration-500 overflow-x-hidden">
            {/* Background Aesthetics - Lux only */}
            {!auth.isDark && (
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none"></div>
                </div>
            )}

            <main className="flex-1 p-4 pt-24 pb-20 sm:p-8 relative z-10 max-w-7xl mx-auto w-full">
                {/* Header Controls */}
                <div className="fixed top-6 left-6 right-6 z-50 flex justify-between items-center no-print px-4 sm:px-0">
                    <button
                        onClick={() => navigate("/home-disco")}
                        className={UI_CLASSES.buttonBack}
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold uppercase tracking-wider text-xs">Volver</span>
                    </button>
                    <ThemeToggle />
                </div>

                <div className="text-center mb-16 pt-8 animate-fadeIn">
                    <h1 className="text-4xl sm:text-6xl font-black mb-4 text-zinc-900 dark:text-white tracking-tight uppercase drop-shadow-lg italic">
                        Mesas
                    </h1>
                    <p className="text-sm font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.4em]">Gestión de Salón</p>
                    <div className="h-1 w-24 bg-zinc-900 dark:bg-white mx-auto mt-8 opacity-10 dark:opacity-20 rounded-full"></div>
                </div>

                <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
                    <div className="bg-[#1A103C]/80 dark:bg-zinc-900/20 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-[3rem] p-6 sm:p-10 shadow-2xl dark:shadow-none relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A944FF]/20 dark:via-white/10 to-transparent text-white"></div>
                        
                        <MesaForm key="form" onSubmit={handleAddMesa} />

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 mt-12">
                            {mesas.map((mesa) => (
                                <MesaCard 
                                    key={mesa.id} 
                                    mesa={mesa} 
                                    onDelete={handleDeleteMesa} 
                                 />
                            ))}
                        </div>

                        {mesas.length === 0 && (
                            <div className="text-center py-20 border-2 border-dashed border-zinc-100 dark:border-zinc-800/50 rounded-[2.5rem] bg-zinc-50/50 dark:bg-black/20">
                                <p className="text-zinc-300 dark:text-zinc-700 font-black uppercase tracking-[0.4em] text-[10px]">No hay mesas configuradas</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MesasPageDisco;
