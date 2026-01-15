import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Save, Users, ShieldCheck, X, GlassWater, Settings, Trash2, RefreshCw } from 'lucide-react';
import apiClient from '../../utils/apiClient';
import toast from 'react-hot-toast';
import { usePedidosContext } from '../../context/PedidosContext';
import PageLayout from '../../components/PageLayout';
import ConfirmModal from '../../components/ConfirmModal';
import { UI_CLASSES } from '../../constants/ui';

// Componente de tarjeta reutilizable para Usuario/Mesera
const UserCard = ({ item, type, onEdit, onDelete, canDelete }) => {
    const isUser = type === 'usuario';
    const isAdmin = isUser && (item.role === 'admin' || item.is_superuser);
    const isProtected = ['admin', 'barra', 'prueba'].includes(item.username);

    return (
        <div className={`${UI_CLASSES.glassCard} group p-6 flex flex-col h-full relative overflow-hidden transition-all duration-300 hover:border-purple-500/50`}>
            {/* Indicador de Tipo */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
                isAdmin ? 'from-rose-500 to-pink-600' : (isUser ? 'from-purple-500 to-indigo-600' : 'from-pink-500 to-rose-600')
            } opacity-50`}></div>

            <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${
                    isAdmin ? 'from-rose-500 to-pink-600 shadow-rose-900/40' : 
                    (isUser ? 'from-purple-500 to-indigo-600 shadow-purple-900/40' : 'from-pink-500 to-rose-600 shadow-pink-900/40')
                } shadow-lg transform group-hover:scale-110 transition-transform duration-500`}>
                    {isUser ? <User className="text-white" size={24} /> : <GlassWater className="text-white" size={24} />}
                </div>
                
                <div className="flex flex-col items-end gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                        isAdmin ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 
                        (isUser ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-pink-500/10 border-pink-500/30 text-pink-400')
                    }`}>
                        {isUser ? (item.role || (item.is_superuser ? 'Admin' : 'Usuario')) : 'Mesera'}
                    </span>

                    {canDelete && !isProtected && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                            className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow-lg active:scale-90"
                            title="Eliminar"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-grow mb-6">
                <h3 className="text-xl font-bold text-white mb-1 truncate tracking-tight uppercase">
                    {item.username || item.nombre}
                </h3>
                <p className="text-[10px] text-gray-500 font-black tracking-widest uppercase">
                    ID: {String(item.id).padStart(4, '0')}
                </p>
            </div>

            <button
                onClick={onEdit}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border font-bold text-xs uppercase tracking-widest transition-all active:scale-[0.98] ${
                    isUser
                    ? 'bg-[#2B0D49] border-[#6C3FA8]/50 text-white hover:bg-[#441E73] hover:border-[#A944FF] shadow-lg shadow-purple-900/20'
                    : 'bg-[#3D0D26] border-[#731E44]/50 text-white hover:bg-[#5E1E3C] hover:border-[#FF4BC1] shadow-lg shadow-pink-900/20'
                }`}
            >
                <Lock size={14} />
                Cambiar {isUser ? 'Clave' : 'PIN'}
            </button>
        </div>
    );
};

const AdminUsuariosDisco = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [meseras, setMeseras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [newValue, setNewValue] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const navigate = useNavigate();
    const { auth } = usePedidosContext();
    const { role, userRole } = auth;

    // Redirigir si no es admin
    useEffect(() => {
        const currentRole = role || userRole;
        // Permitimos acceso si hay un rol de admin o prueba guardado
        if (currentRole !== 'admin' && currentRole !== 'prueba') {
            const storedRole = sessionStorage.getItem('userRole');
            if (storedRole !== 'admin' && storedRole !== 'prueba') {
                navigate('/');
            }
        }
    }, [role, userRole, navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, meserasRes] = await Promise.all([
                apiClient.get('/usuarios/'),
                apiClient.get('/meseras/')
            ]);
            setUsuarios(usersRes.data);
            setMeseras(meserasRes.data);
        } catch (error) {
            console.error("Error al cargar datos:", error);
            // El interceptor de apiClient ya muestra el toast
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenResetModal = (item, type) => {
        setSelectedItem({ ...item, _type: type });
        setNewValue('');
        setShowModal(true);
    };

    const handleUpdateCredentials = async () => {
        const cleanValue = newValue.trim();
        const isUser = selectedItem._type === 'usuario';

        if (!cleanValue || cleanValue.length < 4) {
            toast.error("Debe tener al menos 4 caracteres.");
            return;
        }

        try {
            if (isUser) {
                await apiClient.post(`/usuarios/${selectedItem.id}/cambiar-password/`, {
                    password: cleanValue
                });
            } else {
                await apiClient.post(`/meseras/${selectedItem.id}/cambiar-codigo/`, {
                    codigo: cleanValue
                });
            }
            toast.success(`${isUser ? 'Contraseña' : 'Código'} de ${selectedItem.username || selectedItem.nombre} actualizado.`);
            setShowModal(false);
            fetchData();
        } catch (error) {
            console.error("Error al actualizar:", error);
            // El interceptor ya maneja el error visualmente
        }
    };

    const handleDeleteConfirm = (item, type) => {
        setItemToDelete({ ...item, _type: type });
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        
        try {
            if (itemToDelete._type === 'usuario') {
                await apiClient.delete(`/usuarios/${itemToDelete.id}/`);
            } else {
                await apiClient.delete(`/meseras/${itemToDelete.id}/`);
            }
            toast.success("Eliminado correctamente.");
            setDeleteModalOpen(false);
            setItemToDelete(null);
            fetchData();
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    const isCurrentUserAdmin = role === 'admin' || userRole === 'admin' || sessionStorage.getItem('userRole') === 'admin';

    return (
        <PageLayout title="Gestión de Personal">
            <div className="max-w-7xl mx-auto space-y-12 pb-20">
                
                {/* Botón Acción Rápida */}
                <div className="flex justify-end gap-4 px-4 sm:px-0">
                    <button
                        onClick={fetchData}
                        className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all shadow-lg active:scale-95"
                        title="Refrescar datos"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={() => navigate('/configuracion-ticket')}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6C3FA8]/20 border border-[#6C3FA8]/50 text-purple-400 hover:bg-[#6C3FA8] hover:text-white transition-all font-black text-xs uppercase tracking-widest shadow-xl active:scale-95"
                    >
                        <Settings size={18} />
                        Configurar Ticket
                    </button>
                </div>

                {loading && usuarios.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(168,85,247,0.3)]"></div>
                        <p className="text-purple-400 font-black tracking-[0.3em] text-xs animate-pulse">CARGANDO PERSONAL...</p>
                    </div>
                ) : (
                    <>
                        {/* Seccion Usuarios Sistema */}
                        <section className="px-4 sm:px-0">
                            <div className="flex items-center gap-4 mb-8">
                                <h2 className="text-sm font-black tracking-[0.4em] uppercase text-purple-400">
                                    Usuarios del Sistema
                                </h2>
                                <div className="h-px flex-grow bg-gradient-to-r from-purple-500/50 to-transparent"></div>
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
                                    <div className="col-span-full py-12 text-center bg-white/5 rounded-3xl border border-white/5">
                                        <p className="text-gray-500 font-bold">No se encontraron usuarios del sistema.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Seccion Meseros/as */}
                        <section className="px-4 sm:px-0">
                            <div className="flex items-center gap-4 mb-8">
                                <h2 className="text-sm font-black tracking-[0.4em] uppercase text-pink-400">
                                    Personal de Mesa
                                </h2>
                                <div className="h-px flex-grow bg-gradient-to-r from-pink-500/50 to-transparent"></div>
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
                                    <div className="col-span-full py-12 text-center bg-white/5 rounded-3xl border border-white/5">
                                        <p className="text-gray-500 font-bold">No se encontró personal de mesa.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </>
                )}
            </div>

            {/* Modal de Cambio de Contraseña */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={() => setShowModal(false)}>
                    <div className={`${UI_CLASSES.glassCard} bg-[#1a0b2e] w-full max-w-md relative shadow-[0_20px_60px_rgba(0,0,0,0.7)] border-white/20`} onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-10">
                            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                                <ShieldCheck className="text-purple-400" size={32} />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tight">
                                Nueva {selectedItem?._type === 'usuario' ? 'Contraseña' : 'Clave/PIN'}
                            </h2>
                            <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest font-bold">
                                Editando a: <span className="text-purple-400">{selectedItem?.username || selectedItem?.nombre}</span>
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="group relative">
                                <Lock className="absolute left-4 top-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                                <input
                                    type={selectedItem?._type === 'usuario' ? "text" : "password"}
                                    inputMode={selectedItem?._type === 'usuario' ? "text" : "numeric"}
                                    placeholder={selectedItem?._type === 'usuario' ? "Mínimo 4 caracteres" : "PIN Numérico"}
                                    value={newValue}
                                    autoFocus
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (selectedItem?._type === 'mesera') {
                                            if (/^\d*$/.test(val) && val.length <= 6) {
                                                setNewValue(val);
                                            }
                                        } else {
                                            setNewValue(val);
                                        }
                                    }}
                                    onKeyPress={(e) => e.key === 'Enter' && handleUpdateCredentials()}
                                    className={`${UI_CLASSES.input} pl-12 font-mono text-center text-xl tracking-[0.5em]`}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className={`${UI_CLASSES.buttonSecondary} flex-1`}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleUpdateCredentials}
                                    className={`${UI_CLASSES.buttonPrimary} flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 p-4`}
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="¿Eliminar Permanente?"
                message={`¿Estás seguro de que deseas eliminar a ${itemToDelete?.username || itemToDelete?.nombre}? Esta acción no se puede deshacer.`}
                confirmText="Sí, Eliminar"
                cancelText="No, Cancelar"
                type="danger"
            />
        </PageLayout>
    );
};

export default AdminUsuariosDisco;
