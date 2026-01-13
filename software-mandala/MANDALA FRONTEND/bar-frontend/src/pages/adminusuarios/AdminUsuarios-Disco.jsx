import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Save, ArrowLeft, Users, Shield, ShieldCheck, X, GlassWater, Settings, Trash2 } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../apiConfig';
import toast from 'react-hot-toast';
import { usePedidosContext } from '../../context/PedidosContext';

// Componente de tarjeta reutilizable para Usuario/Mesera
const UserCard = ({ item, type, onEdit, onDelete, canDelete }) => {
    const isUser = type === 'usuario';
    const isMesera = type === 'mesera';
    const isAdmin = isUser && item.role === 'admin';

    // Protect system users from deletion via UI if needed, or just let Admin do valid actions
    const isProtected = ['admin', 'barra', 'prueba'].includes(item.username);

    return (
        <div
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-500 group relative overflow-hidden"
        >
            {/* Decorative line */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${isUser ? 'from-purple-500 to-indigo-600' : 'from-pink-500 to-rose-600'
                } opacity-50`}></div>

            <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${isAdmin ? 'from-rose-500 to-pink-600' : (isUser ? 'from-purple-500 to-indigo-600' : 'from-pink-500 to-rose-600')
                    } shadow-lg shadow-black/20 transform group-hover:scale-110 transition-transform duration-500`}>
                    {isUser ? <User className="text-white" size={24} /> : <GlassWater className="text-white" size={24} />}
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${isAdmin ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : (isUser ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-pink-500/10 border-pink-500/30 text-pink-400')
                        }`}>
                        {isUser ? item.role : 'Mesera'}
                    </span>

                    {/* Delete Button - Only if canDelete is true and not a protected user if you prefer */}
                    {canDelete && !isProtected && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                            className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                            title="Eliminar usuario"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-1 truncate tracking-tight">{item.username || item.nombre}</h3>
                <p className="text-[10px] text-gray-500 font-black tracking-widest uppercase">ID: {String(item.id).padStart(4, '0')}</p>
            </div>

            <button
                onClick={onEdit}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border font-bold text-xs uppercase tracking-widest transition-all ${isUser
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
    const [selectedItem, setSelectedItem] = useState(null); // Puede ser usuario o mesera
    const [newValue, setNewValue] = useState(''); // Nueva password o nuevo codigo
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();
    const { auth } = usePedidosContext();
    const { role, userRole } = auth;

    // Verificar si es admin
    useEffect(() => {
        const currentRole = role || userRole;
        if (currentRole !== 'admin' && currentRole !== 'prueba') {
            navigate('/');
        }
    }, [role, userRole, navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, meserasRes] = await Promise.all([
                axios.get(`${API_URL}/usuarios/`),
                axios.get(`${API_URL}/meseras/`)
            ]);
            setUsuarios(usersRes.data);
            setMeseras(meserasRes.data);
        } catch (error) {
            console.error("Error al cargar datos:", error);
            toast.error("No se pudieron cargar los datos.");
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
                await axios.post(`${API_URL}/usuarios/${selectedItem.id}/cambiar-password/`, {
                    password: cleanValue
                });
            } else {
                await axios.post(`${API_URL}/meseras/${selectedItem.id}/cambiar-codigo/`, {
                    codigo: cleanValue
                });
            }
            toast.success(`${isUser ? 'Contraseña' : 'Código'} de ${selectedItem.username || selectedItem.nombre} actualizado.`);
            setShowModal(false);
            fetchData();
        } catch (error) {
            console.error("Error al actualizar:", error);
            const detail = error.response?.data?.detail || "Error al actualizar.";
            toast.error(detail);
        }
    };

    const handleDelete = async (item, type) => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar permanentemente a ${item.username || item.nombre}?`)) return;

        try {
            if (type === 'usuario') {
                await axios.delete(`${API_URL}/usuarios/${item.id}/`);
            } else {
                await axios.delete(`${API_URL}/meseras/${item.id}/`);
            }
            toast.success("Eliminado correctamente.");
            fetchData();
        } catch (error) {
            console.error("Error al eliminar:", error);
            toast.error("No se pudo eliminar.");
        }
    };

    const isCurrentUserAdmin = role === 'admin' || userRole === 'admin';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white selection:bg-purple-500/30">
            {/* Background Glows */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Header */}
            <header className="relative z-20 p-6 bg-white/5 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                                <Users className="text-purple-400" size={24} />
                                GESTIÓN DE PERSONAL
                            </h1>
                            <p className="text-[10px] text-gray-400 font-black tracking-[0.2em] uppercase">Control de Accesos</p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/configuracion-ticket')}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500 hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
                    >
                        <Settings size={16} />
                        Configurar Ticket
                    </button>
                </div>
            </header>

            <main className="relative z-10 p-4 sm:p-8 max-w-7xl mx-auto space-y-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-purple-400 font-bold tracking-widest text-[10px]">OBTENIENDO INFORMACIÓN...</p>
                    </div>
                ) : (
                    <>
                        {/* Seccion Usuarios Sistema */}
                        <section>
                            <h2 className="text-xs font-black tracking-[0.3em] uppercase text-purple-400 mb-6 flex items-center gap-3">
                                <span className="w-8 h-px bg-purple-500/30"></span>
                                Usuarios del Sistema
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {usuarios.map(user => (
                                    <UserCard
                                        key={`u-${user.id}`}
                                        item={user}
                                        type="usuario"
                                        onEdit={() => handleOpenResetModal(user, 'usuario')}
                                        onDelete={() => handleDelete(user, 'usuario')}
                                        canDelete={isCurrentUserAdmin}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Seccion Meseros/as */}
                        <section>
                            <h2 className="text-xs font-black tracking-[0.3em] uppercase text-pink-400 mb-6 flex items-center gap-3">
                                <span className="w-8 h-px bg-pink-500/30"></span>
                                Personal de Mesa (Meseros / Meseras)
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {meseras.map(mesera => (
                                    <UserCard
                                        key={`m-${mesera.id}`}
                                        item={mesera}
                                        type="mesera"
                                        onEdit={() => handleOpenResetModal(mesera, 'mesera')}
                                        onDelete={() => handleDelete(mesera, 'mesera')}
                                        canDelete={isCurrentUserAdmin}
                                    />
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </main>

            {/* Modal de Cambio de Contraseña */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-[#1a0b2e] border border-purple-500/30 rounded-3xl p-8 w-full max-w-md relative shadow-[0_0_50px_rgba(168,85,247,0.2)]">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
                                <ShieldCheck className="text-purple-400" size={32} />
                            </div>
                            <h2 className="text-2xl font-bold">Nueva {selectedItem?._type === 'usuario' ? 'Contraseña' : 'Clave/PIN'}</h2>
                            <p className="text-gray-400 text-sm">Cambiando para <span className="text-white font-bold">{selectedItem?.username || selectedItem?.nombre}</span></p>
                        </div>

                        <div className="space-y-6">
                            <div className="group relative">
                                <Lock className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                                <input
                                    type={selectedItem?._type === 'usuario' ? "text" : "password"}
                                    inputMode={selectedItem?._type === 'usuario' ? "text" : "numeric"}
                                    placeholder={selectedItem?._type === 'usuario' ? "Ingrese nueva clave" : "Ingrese nuevo PIN numérico"}
                                    value={newValue}
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
                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-all font-mono"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3.5 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleUpdateCredentials}
                                    className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transform hover:scale-[1.02] transition-all"
                                >
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsuariosDisco;
