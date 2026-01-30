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
            <div className="max-w-7xl mx-auto space-y-12 pb-20">
                
                {/* Global Actions */}
                <div className="flex justify-end gap-4 px-4 sm:px-0">
                    <button
                        onClick={refresh}
                        className="flex items-center gap-2 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm dark:shadow-lg active:scale-95 group"
                        title="Refrescar datos"
                    >
                        <RefreshCw size={18} className={`${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                    </button>
                    
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 border border-transparent dark:border-white text-white dark:text-black hover:bg-black dark:hover:bg-white transition-all font-bold text-xs uppercase tracking-widest shadow-xl active:scale-95"
                    >
                        <Plus size={18} />
                        Nuevo Personal
                    </button>
                    <button
                        onClick={() => navigate('/configuracion-ticket')}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all font-bold text-xs uppercase tracking-widest shadow-sm dark:shadow-xl active:scale-95"
                    >
                        <Settings size={18} />
                        Configurar Ticket
                    </button>
                </div>

                {loading && usuarios.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 animate-fadeIn">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-white rounded-full animate-spin mb-6 shadow-xl"></div>
                        </div>
                        <p className="text-zinc-400 dark:text-zinc-500 font-bold tracking-[0.4em] text-[10px] animate-pulse uppercase">Cargando base de datos...</p>
                    </div>
                ) : (
                    <div className="space-y-16 animate-fadeIn">
                        {/* System Users Section */}
                        <section className="px-4 sm:px-0">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px w-8 bg-zinc-300 dark:bg-zinc-500"></div>
                                <h2 className="text-sm font-black tracking-[0.4em] uppercase text-zinc-900 dark:text-white">
                                    Usuarios del Sistema
                                </h2>
                                <div className="h-px flex-grow bg-gradient-to-r from-zinc-200 dark:from-zinc-800 to-transparent"></div>
                                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">{usuarios.length} activos</span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                                    <div className="col-span-full py-16 text-center bg-zinc-50 dark:bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-none">
                                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No se encontraron usuarios del sistema.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Staff Profiles Section */}
                        <section className="px-4 sm:px-0">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px w-8 bg-zinc-300 dark:bg-zinc-500"></div>
                                <h2 className="text-sm font-black tracking-[0.4em] uppercase text-zinc-900 dark:text-white">
                                    Personal de Operación
                                </h2>
                                <div className="h-px flex-grow bg-gradient-to-r from-zinc-200 dark:from-zinc-800 to-transparent"></div>
                                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">{meseras.length} perfiles</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                                    <div className="col-span-full py-16 text-center bg-zinc-50 dark:bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-none">
                                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No se encontró personal registrado.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                )}
            </div>

            {/* Credential Reset Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 animate-fadeIn" onClick={() => setShowModal(false)}>
                    <div className={`${UI_CLASSES.glassCard} bg-zinc-950 w-full max-w-md relative shadow-2xl border-white/10 transform animate-scaleIn`} onClick={e => e.stopPropagation()}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                        
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors bg-white/5 rounded-xl hover:bg-white/10"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-10 pt-4">
                            <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner">
                                <ShieldCheck className="text-white" size={40} />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                                Actualizar Acceso
                            </h2>
                            <p className="text-zinc-500 text-[10px] mt-3 uppercase tracking-[0.2em] font-bold">
                                Perfil: <span className="text-white">{selectedItem?.username || selectedItem?.nombre}</span>
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="group relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors z-10">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={selectedItem?._type === 'usuario' ? "text" : "text"}
                                    inputMode="text"
                                    placeholder={selectedItem?._type === 'usuario' ? "Nueva contraseña" : "Nueva contraseña"}
                                    value={newValue}
                                    autoFocus
                                    onChange={(e) => {
                                        setNewValue(e.target.value);
                                    }}
                                    onKeyPress={(e) => e.key === 'Enter' && handleUpdateCredentials()}
                                    className={`${UI_CLASSES.input} pl-12 font-mono text-center text-xl tracking-[0.4em] py-5 border-white/10 focus:border-white bg-black`}
                                />
                            </div>

                            <p className="text-[9px] text-zinc-500 text-center uppercase tracking-widest leading-relaxed">
                                Los cambios se aplicarán de forma inmediata y el usuario deberá usar sus nuevas credenciales en el siguiente inicio de sesión.
                            </p>

                            <div className="flex gap-4 pt-6">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3 bg-zinc-900 border border-white/5 text-zinc-400 rounded-xl hover:bg-zinc-800 hover:text-white transition-all font-bold uppercase text-[11px] tracking-[0.2em] active:scale-95"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleUpdateCredentials}
                                    className="flex-1 px-4 py-3 bg-white text-black border border-white rounded-xl hover:bg-zinc-200 transition-all font-bold uppercase text-[11px] tracking-[0.2em] shadow-xl active:scale-95"
                                >
                                    Confirmar
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
