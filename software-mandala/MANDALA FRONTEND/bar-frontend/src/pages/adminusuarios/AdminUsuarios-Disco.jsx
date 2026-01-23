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
                <div className="flex justify-end gap-3 px-4 sm:px-0">
                    <button
                        onClick={refresh}
                        className={UI_CLASSES.buttonSecondary + " px-4"}
                        title="Refrescar datos"
                    >
                        <RefreshCw size={18} className={`${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                    </button>
                    
                    <button
                        onClick={() => setShowAddForm(true)}
                        className={UI_CLASSES.buttonSuccess}
                    >
                        <Plus size={18} />
                        Nuevo Personal
                    </button>
                    <button
                        onClick={() => navigate('/configuracion-ticket')}
                        className={UI_CLASSES.buttonPrimary}
                    >
                        <Settings size={18} />
                        Ticket
                    </button>
                </div>

                {loading && usuarios.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 animate-fadeIn">
                        <div className="relative w-16 h-16 mb-8">
                            <div className="absolute inset-0 border-4 border-[#A944FF]/10 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-t-[#A944FF] rounded-full animate-spin"></div>
                        </div>
                        <p className="text-[#A944FF] font-black tracking-[0.4em] text-[10px] animate-pulse uppercase">Sincronizando base de datos...</p>
                    </div>
                ) : (
                    <div className="space-y-20 animate-fadeIn">
                        {/* System Users Section */}
                        <section className="px-4 sm:px-0">
                            <div className="flex items-center gap-6 mb-10">
                                <h2 className={UI_CLASSES.titleSection}>
                                    <ShieldCheck className="text-[#A944FF]" size={20} />
                                    <span>Usuarios Sistema</span>
                                </h2>
                                <div className="h-[1px] flex-grow bg-white/5"></div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{usuarios.length} activos</span>
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
                                    <div className="col-span-full py-20 text-center bg-white/[0.02] rounded-[2.5rem] border border-dashed border-white/5">
                                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No hay usuarios registrados</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Staff Profiles Section */}
                        <section className="px-4 sm:px-0">
                            <div className="flex items-center gap-6 mb-10">
                                <h2 className={UI_CLASSES.titleSection}>
                                    <Lock className="text-[#A944FF]" size={20} />
                                    <span>Personal Operación</span>
                                </h2>
                                <div className="h-[1px] flex-grow bg-white/5"></div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{meseras.length} perfiles</span>
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
                                    <div className="col-span-full py-20 text-center bg-white/[0.02] rounded-[2.5rem] border border-dashed border-white/5">
                                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No hay personal registrado</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                )}
            </div>

            {/* Credential Reset Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fadeIn" onClick={() => setShowModal(false)}>
                    <div className={`${UI_CLASSES.glassCard} bg-[#120F25] w-full max-w-sm relative shadow-2xl border-white/10 transform animate-scaleIn overflow-visible`} onClick={e => e.stopPropagation()}>
                        
                        <div className="text-center p-8">
                            <div className="w-20 h-20 bg-[#A944FF]/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <ShieldCheck className="text-[#A944FF]" size={36} />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
                                Seguridad
                            </h2>
                            <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black mb-8">
                                Reset: {selectedItem?.username || selectedItem?.nombre}
                            </p>

                            <div className="space-y-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="NUEVA CLAVE"
                                        value={newValue}
                                        autoFocus
                                        onChange={(e) => {
                                            setNewValue(e.target.value);
                                        }}
                                        onKeyPress={(e) => e.key === 'Enter' && handleUpdateCredentials()}
                                        className={UI_CLASSES.input + " text-center font-mono tracking-[0.3em] uppercase text-lg"}
                                    />
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={handleUpdateCredentials}
                                        className={UI_CLASSES.buttonSuccess + " w-full py-4"}
                                    >
                                        Confirmar
                                    </button>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="w-full py-4 text-slate-500 hover:text-white transition-all font-black uppercase text-[10px] tracking-[0.2em]"
                                    >
                                        Cerrar
                                    </button>
                                </div>
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
