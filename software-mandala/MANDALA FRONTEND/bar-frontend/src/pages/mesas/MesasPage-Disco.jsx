import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Table } from 'lucide-react';
import MesaForm from './MesaForm';
import { usePedidosContext } from '../../context/PedidosContext';
import { useMesasManagement } from '../../hooks/useMesasManagement';
import MesaCard from './components/MesaCard';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';

const MesasPageDisco = () => {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const { 
        mesas, 
        loading, 
        handleAddMesa, 
        handleDeleteMesa 
    } = useMesasManagement();

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-transparent text-white selection:bg-[#A944FF]/30 transition-all duration-500">
                <div className="w-24 h-24 border-4 border-[#6C3FA8]/20 dark:border-zinc-800 border-t-[#A944FF] dark:border-t-white rounded-[2rem] animate-spin mb-8 shadow-2xl"></div>
                <p className="font-black tracking-[0.4em] text-[#A944FF] dark:text-zinc-500 uppercase text-[11px] animate-pulse">Sincronizando Salón...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-transparent text-white dark:text-zinc-200 selection:bg-[#A944FF]/30 transition-colors duration-500 overflow-x-hidden relative">
            
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#441E73]/10 dark:bg-zinc-900/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#A944FF]/5 dark:bg-white/5 rounded-full blur-[100px]"></div>
            </div>

            <main className="flex-1 p-4 pt-24 pb-20 sm:p-10 relative z-10 max-w-7xl mx-auto w-full">
                {/* Header Controls */}
                <div className="fixed top-8 left-8 right-8 z-50 flex justify-between items-center no-print">
                    <button
                        onClick={() => navigate("/home-disco")}
                        className={UI_CLASSES.buttonBack}
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-black uppercase tracking-[0.2em] text-[10px]">Inicio</span>
                    </button>
                    <ThemeToggle />
                </div>

                <div className="text-center mb-20 pt-12 animate-scaleIn">
                    <h1 className="text-5xl sm:text-8xl font-black mb-4 text-white dark:text-white tracking-tighter uppercase italic drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                        Salón Mandala
                    </h1>
                    <p className="text-[11px] font-black text-[#A944FF] dark:text-zinc-500 uppercase tracking-[0.5em] opacity-80">Configuración de Mesas y Distribución</p>
                </div>

                <div className="space-y-6 max-w-6xl mx-auto animate-fadeInUp">
                    <div className="bg-[#1A103C]/90 dark:bg-zinc-900/10 backdrop-blur-3xl border border-white/10 dark:border-white/5 rounded-[3.5rem] p-8 sm:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] dark:shadow-none relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#A944FF]/40 dark:via-white/20 to-transparent"></div>
                        
                        <MesaForm key="form" onSubmit={handleAddMesa} />

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8 mt-16 pb-8">
                            {mesas.map((mesa) => (
                                <MesaCard 
                                    key={mesa.id} 
                                    mesa={mesa} 
                                    onDelete={handleDeleteMesa} 
                                 />
                            ))}
                        </div>

                        {mesas.length === 0 && (
                            <div className="text-center py-32 border-2 border-dashed border-white/5 dark:border-zinc-800 rounded-[3rem] bg-black/20">
                                <Table size={48} className="text-[#8A7BAF] dark:text-zinc-800 mx-auto mb-6 opacity-50" />
                                <p className="text-[#8A7BAF] dark:text-zinc-500 font-black uppercase tracking-[0.4em] text-[10px]">No hay mesas configuradas aún</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MesasPageDisco;
