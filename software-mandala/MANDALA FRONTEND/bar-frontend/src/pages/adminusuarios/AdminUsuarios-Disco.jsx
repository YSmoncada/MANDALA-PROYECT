import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, X, Settings, RefreshCw, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePedidosContext } from '../../context/PedidosContext';
import { useAdminUsers } from '../../hooks/useAdminUsers';
import UserCard from './components/UserCard';
import PageLayout from '../../components/PageLayout';
import ConfirmModal from '../../components/ConfirmModal';
import AddProfileForm from '../pedidosAuth/components/AddProfileForm';
import { UI_CLASSES } from '../../constants/ui';

/**
 * Admin Panel for managing System Users and Staff Profiles.
 * Refactored for better organization and scalability.
 */
const AdminUsuariosDisco = () => {
    const navigate = useNavigate();
    const { auth } = usePedidosContext();
    const { role, userRole } = auth;
    
    const {
        usuarios,
        meseras, // still using meseras internally for mapping
        loading,
        updateCredentials,
        deleteItem,
        refresh
    } = useAdminUsers();

    const [selectedItem, setSelectedItem] = useState(null);
    const [newValue, setNewValue] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Add Profile State
    const [showAddForm, setShowAddForm] = useState(false);
    const [newProfileName, setNewProfileName] = useState("");
    const [newProfileCode, setNewProfileCode] = useState("");

    const handleAddProfileSubmit = async (e) => {
        e.preventDefault();
        if (newProfileName.trim() === "" || newProfileCode.length < 4) {
            toast.error("El nombre y la contraseña (min 4 caracteres) son obligatorios.");
            return;
        }
        
        // Use auth.addProfile from context
        const result = await auth.addProfile(newProfileName, newProfileCode);
        
        if (!result.success) {
            toast.error(`Error: ${result.message}`);
        } else {
            setShowAddForm(false);
            setNewProfileName("");
            setNewProfileCode("");
            toast.success("Perfil añadido correctamente");
            refresh(); // Refresh the list in this view
        }
    };

    const handleOpenResetModal = (item, type) => {
        setSelectedItem({ ...item, _type: type });
        setNewValue('');
        setShowModal(true);
    };

    const handleUpdateCredentials = async () => {
        const cleanValue = newValue.trim();
        if (!cleanValue || cleanValue.length < 4) {
            toast.error("Debe tener al menos 4 caracteres.");
            return;
        }

        const result = await updateCredentials(selectedItem.id, selectedItem._type, cleanValue);
        if (result.success) {
            setShowModal(false);
        }
    };

    const handleDeleteConfirm = (item, type) => {
        setItemToDelete({ ...item, _type: type });
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        const result = await deleteItem(itemToDelete.id, itemToDelete._type);
        if (result.success) {
            setDeleteModalOpen(false);
            setItemToDelete(null);
        }
    };

    const isCurrentUserAdmin = role === 'admin' || userRole === 'admin' || sessionStorage.getItem('userRole') === 'admin';

    return (
        <PageLayout title="Gestión de Personal">
            <div className="max-w-7xl mx-auto space-y-16 pb-24">
                
                {/* Global Actions */}
                <div className="flex justify-between items-center gap-6 px-4 sm:px-0">
                    <div className="flex gap-4">
                        <button
                            onClick={refresh}
                            className="flex items-center justify-center p-4 rounded-2xl bg-[#0E0D23] dark:bg-zinc-900 border border-white/5 text-[#8A7BAF] hover:bg-[#1A103C] dark:hover:bg-zinc-800 hover:text-white transition-all shadow-2xl active:scale-90 group"
                            title="Refrescar"
                        >
                            <RefreshCw size={18} className={`${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                        </button>
                    </div>
                    
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/configuracion-ticket')}
                            className="hidden sm:flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#0E0D23] dark:bg-zinc-900 border border-white/5 text-[#8A7BAF] dark:text-zinc-400 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl active:scale-95"
                        >
                            <Settings size={18} />
                            Configurar Ticket
                        </button>

                        <button
                            onClick={() => setShowAddForm(true)}
                            className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-[#A944FF] dark:bg-white text-white dark:text-black hover:brightness-110 transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(169,68,255,0.4)] dark:shadow-none active:scale-95"
                        >
                            <Plus size={18} />
                            Nuevo Personal
                        </button>
                    </div>
                </div>

                {loading && usuarios.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 animate-fadeIn">
                        <div className="w-20 h-20 border-4 border-[#6C3FA8]/20 dark:border-zinc-800 border-t-[#A944FF] dark:border-t-white rounded-[2rem] animate-spin mb-8 shadow-2xl"></div>
                        <p className="text-[#8A7BAF] dark:text-zinc-500 font-black tracking-[0.4em] text-[11px] animate-pulse uppercase">Conectando con la base de datos...</p>
                    </div>
                ) : (
                    <div className="space-y-24 animate-fadeIn">
                        {/* System Users Section */}
                        <section className="px-4 sm:px-0">
                            <div className="flex items-center gap-6 mb-12">
                                <div className="h-0.5 w-10 bg-[#A944FF] dark:bg-zinc-500 rounded-full shadow-[0_0_10px_#A944FF]"></div>
                                <h2 className="text-sm font-black tracking-[0.4em] uppercase text-white dark:text-white italic">
                                    Usuarios del Sistema
                                </h2>
                                <div className="h-0.5 flex-grow bg-gradient-to-r from-[#A944FF]/30 dark:from-zinc-800 to-transparent"></div>
                                <span className="text-[10px] font-black text-[#8A7BAF] dark:text-zinc-600 uppercase tracking-[0.2em] bg-[#1A103C] px-4 py-1.5 rounded-full border border-white/5">{usuarios.length} activos</span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {usuarios.map(user => (
                                    <UserCard
                                        key={`u-${user.id}`}
                                        item={user}
                                        type="usuario"
                                        onEdit={() => handleOpenResetModal(user, 'usuario')}
                                        onDelete={() => handleDeleteConfirm(user, 'usuario')}
                                        canDelete={isCurrentUserAdmin}
                                    />
                                ))}
                                {usuarios.length === 0 && !loading && (
                                    <div className="col-span-full py-24 text-center bg-[#1A103C]/30 dark:bg-zinc-900/30 rounded-[3rem] border-2 border-dashed border-white/5 shadow-inner">
                                        <p className="text-[#8A7BAF] font-black uppercase tracking-[0.25em] text-[10px]">No se encontraron usuarios activos.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Staff Profiles Section */}
                        <section className="px-4 sm:px-0">
                            <div className="flex items-center gap-6 mb-12">
                                <div className="h-0.5 w-10 bg-[#8A44FF] dark:bg-zinc-500 rounded-full shadow-[0_0_10px_#8A44FF]"></div>
                                <h2 className="text-sm font-black tracking-[0.4em] uppercase text-white dark:text-white italic">
                                    Personal de Operación
                                </h2>
                                <div className="h-0.5 flex-grow bg-gradient-to-r from-[#8A44FF]/30 dark:from-zinc-800 to-transparent"></div>
                                <span className="text-[10px] font-black text-[#8A7BAF] dark:text-zinc-600 uppercase tracking-[0.2em] bg-[#1A103C] px-4 py-1.5 rounded-full border border-white/5">{meseras.length} perfiles</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {meseras.map(mesera => (
                                    <UserCard
                                        key={`m-${mesera.id}`}
                                        item={mesera}
                                        type="mesera"
                                        onEdit={() => handleOpenResetModal(mesera, 'mesera')}
                                        onDelete={() => handleDeleteConfirm(mesera, 'mesera')}
                                        canDelete={isCurrentUserAdmin}
                                    />
                                ))}
                                {meseras.length === 0 && !loading && (
                                    <div className="col-span-full py-24 text-center bg-[#1A103C]/30 dark:bg-zinc-900/30 rounded-[3rem] border-2 border-dashed border-white/5 shadow-inner">
                                        <p className="text-[#8A7BAF] font-black uppercase tracking-[0.25em] text-[10px]">No se encontró personal registrado.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                )}
            </div>

            {/* Credential Reset Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md animate-fadeIn" onClick={() => setShowModal(false)}>
                    <div className="bg-[#1A103C]/95 dark:bg-zinc-900 w-full max-w-sm relative rounded-[2.5rem] p-10 shadow-2xl border border-white/10 transform animate-scaleIn" onClick={e => e.stopPropagation()}>
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#A944FF] to-transparent"></div>
                        
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-8 right-8 p-3 text-[#8A7BAF] hover:text-white transition-colors bg-white/5 rounded-2xl hover:bg-white/10 border border-white/5"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-12">
                            <div className="w-24 h-24 bg-[#0E0D23] dark:bg-zinc-800 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-2xl">
                                <ShieldCheck className="text-[#A944FF] dark:text-white" size={48} />
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-white italic">
                                Reset Access
                            </h2>
                            <p className="text-[#8A7BAF] text-[10px] mt-4 uppercase tracking-[0.3em] font-black">
                                Perfil: <span className="text-white bg-[#A944FF] px-2 py-0.5 rounded ml-1">{selectedItem?.username || selectedItem?.nombre}</span>
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="group relative">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8A7BAF] group-focus-within:text-white transition-colors z-10">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="text"
                                    autoComplete="new-password"
                                    placeholder="Nueva contraseña"
                                    value={newValue}
                                    autoFocus
                                    onChange={(e) => setNewValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleUpdateCredentials()}
                                    className="w-full pl-14 pr-6 py-5 bg-[#0E0D23] dark:bg-black/50 border-2 border-[#6C3FA8]/30 dark:border-white/5 text-white placeholder-[#8A7BAF]/20 rounded-2xl font-black text-center text-xl tracking-[0.5em] focus:border-[#A944FF] dark:focus:border-white outline-none transition-all shadow-inner"
                                />
                            </div>

                            <p className="text-[9px] text-[#8A7BAF] text-center uppercase tracking-[0.2em] font-bold leading-relaxed px-4 opacity-60">
                                Los cambios serán permanentes e irreversibles tras confirmar.
                            </p>
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-4 bg-white/5 text-white/50 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] border border-white/5 hover:bg-white/10 transition-all font-bold"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={handleUpdateCredentials}
                                    className="flex-2 px-8 py-4 bg-[#A944FF] dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:brightness-110 transition-all active:scale-95"
                                >
                                    Actualizar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="¿Eliminar Permanente?"
                message={`¿Estás seguro de que deseas eliminar permanentemente a "${itemToDelete?.username || itemToDelete?.nombre}"? Esta acción no se puede revertir.`}
                confirmText="Eliminar Perfil"
                cancelText="Mantener"
                type="danger"
            />
            {/* Add Profile Modal Form (Reused Component) */}
            {showAddForm && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 animate-fadeIn">
                    <div className="relative w-full max-w-md" onClick={e => e.stopPropagation()}>
                         {/* Close Button on top-right of the modal area roughly, or let the form handle back. 
                             AddProfileForm has onBack which calls setShowAddForm(false). 
                             But visually we want it centered.
                          */}
                        <AddProfileForm
                            name={newProfileName}
                            code={newProfileCode}
                            onNameChange={setNewProfileName}
                            onCodeChange={setNewProfileCode}
                            onSubmit={handleAddProfileSubmit}
                            onBack={() => {
                                setShowAddForm(false);
                                setNewProfileName("");
                                setNewProfileCode("");
                            }}
                        />
                    </div>
                </div>
            )}
        </PageLayout>
    );
};

export default memo(AdminUsuariosDisco);
