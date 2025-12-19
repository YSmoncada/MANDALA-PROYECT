import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Save, ArrowLeft, Users, Shield, ShieldCheck, X } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../apiConfig';
import toast from 'react-hot-toast';
import { usePedidosContext } from '../../context/PedidosContext';

const AdminUsuariosDisco = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();
    const { auth } = usePedidosContext();
    const { role, userRole, handleLogout } = auth;

    // Verificar si es admin
    useEffect(() => {
        const currentRole = role || userRole;
        if (currentRole !== 'admin') {
            navigate('/');
        }
    }, [role, userRole, navigate]);

    const fetchUsuarios = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/usuarios/`);
            setUsuarios(response.data);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
            toast.error("No se pudieron cargar los usuarios.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const handleOpenResetModal = (user) => {
        setSelectedUser(user);
        setNewPassword('');
        setShowModal(true);
    };

    const handleResetPassword = async () => {
        if (!newPassword || newPassword.length < 4) {
            toast.error("La contraseña debe tener al menos 4 caracteres.");
            return;
        }

        try {
            await axios.post(`${API_URL}/usuarios/${selectedUser.id}/cambiar-password/`, {
                password: newPassword
            });
            toast.success(`Contraseña de ${selectedUser.username} actualizada.`);
            setShowModal(false);
        } catch (error) {
            console.error("Error al cambiar contraseña:", error);
            toast.error("Error al actualizar la contraseña.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white selection:bg-purple-500/30">
            {/* Background Glows */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Header */}
            <header className="relative z-20 flex items-center justify-between p-6 bg-white/5 backdrop-blur-md border-b border-white/10">
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
                            GESTIÓN DE USUARIOS
                        </h1>
                        <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">Panel de Control</p>
                    </div>
                </div>
            </header>

            <main className="relative z-10 p-4 sm:p-8 max-w-5xl mx-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-purple-400 font-bold tracking-widest text-xs">CARGANDO USUARIOS...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {usuarios.map(user => (
                            <div
                                key={user.id}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${user.role === 'admin' ? 'from-rose-500 to-pink-600' : 'from-purple-500 to-indigo-600'} shadow-lg shadow-purple-500/10`}>
                                        <User className="text-white" size={24} />
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${user.role === 'admin' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-xl font-bold text-white mb-1 truncate">{user.username}</h3>
                                    <p className="text-xs text-gray-400">ID del Sistema: #{user.id}</p>
                                </div>

                                <button
                                    onClick={() => handleOpenResetModal(user)}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2B0D49] border border-[#6C3FA8]/50 text-white font-bold text-sm hover:bg-[#441E73] hover:border-[#A944FF] transition-all"
                                >
                                    <Lock size={16} />
                                    Cambiar Contraseña
                                </button>
                            </div>
                        ))}
                    </div>
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
                            <h2 className="text-2xl font-bold">Nueva Contraseña</h2>
                            <p className="text-gray-400 text-sm">Cambiando clave para <span className="text-white font-bold">{selectedUser?.username}</span></p>
                        </div>

                        <div className="space-y-6">
                            <div className="group relative">
                                <Lock className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Ingrese nueva clave"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
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
                                    onClick={handleResetPassword}
                                    className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transform hover:scale-[1.02] transition-all"
                                >
                                    Guardar Clave
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
