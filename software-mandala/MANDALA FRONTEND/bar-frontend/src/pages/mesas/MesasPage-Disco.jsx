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
        staff, 
        loading, 
        handleAddMesa, 
        handleDeleteMesa, 
        handleDeleteStaff 
    } = useMesasManagement();

    // Custom deletion confirmation using toast
    const confirmDeleteStaff = (personId) => {
        const person = staff.find(s => s.id === personId);
        if (!person) return;

        toast((t) => (
            <div className="bg-[#1A103C] text-white p-5 rounded-xl shadow-lg border border-purple-700/50 max-w-sm">
                <p className="font-bold text-lg mb-2">Confirmar Eliminación</p>
                <p className="text-sm text-gray-300 mb-4">
                    ¿Estás seguro de que quieres eliminar a <span className="font-bold capitalize text-pink-400">{person.nombre}</span>? Esta acción no se puede deshacer.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            handleDeleteStaff(personId);
                        }}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition text-sm"
                    >
                        Sí, eliminar
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition text-sm"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        ), { duration: 6000 });
    };

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
                        Configuración de Salón
                    </h1>
                    <p className="text-lg text-[#C2B6D9] font-light italic">Gestiona las mesas y perfiles del personal</p>
                    <div className="h-1.5 w-32 bg-gradient-to-r from-[#A944FF] via-[#FF4BC1] to-transparent rounded-full mx-auto mt-4 shadow-[0_0_10px_rgba(169,68,255,0.5)]"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Column 1: Mesas Management */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                            <div className="p-2 bg-[#A944FF]/10 rounded-lg">
                                <Table className="text-[#A944FF]" size={20} />
                            </div>
                            <h2 className="text-xl font-bold uppercase tracking-wider text-white">Mesas Configuradas</h2>
                        </div>

                        <div className={`${UI_CLASSES.glassCard} p-6 shadow-2xl relative overflow-hidden group`}>
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A944FF] to-transparent"></div>
                            
                            <MesaForm key="form" onSubmit={handleAddMesa} />

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
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

                    {/* Column 2: Staff Management */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                            <div className="p-2 bg-[#FF4BC1]/10 rounded-lg">
                                <Users className="text-[#FF4BC1]" size={20} />
                            </div>
                            <h2 className="text-xl font-bold uppercase tracking-wider text-white">Personal Registrado</h2>
                        </div>

                        <div className={`${UI_CLASSES.glassCard} p-6 shadow-2xl relative overflow-hidden`}>
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF4BC1] to-transparent"></div>
                            
                            <div className="space-y-3">
                                {staff.map(person => (
                                    <StaffListItem 
                                        key={person.id} 
                                        staff={person} 
                                        onDelete={confirmDeleteStaff} 
                                    />
                                ))}
                            </div>

                            {staff.length === 0 && (
                                <div className="text-center py-20 border-2 border-dashed border-[#6C3FA8]/30 rounded-2xl bg-black/20">
                                    <p className="text-[#8A7BAF] font-bold uppercase tracking-[0.2em] text-[10px]">No hay personal registrado</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MesasPageDisco;
