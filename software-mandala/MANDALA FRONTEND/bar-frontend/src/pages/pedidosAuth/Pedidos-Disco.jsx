import React, { useState, useEffect } from "react";
import { User, Lock, ArrowLeft, Plus, Sparkles, Trash2Icon } from "lucide-react";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import HeaderPedidosDisco from "../pedidospage/HeaderPedidos-Disco";
import CodeInputDisco from "./CodeInput-Disco";
import ProductGridDisco from "./ProductGrid-Disco";
import { usePedidosContext } from "../../context/PedidosContext";

export default function PedidosDisco() {
    const { auth } = usePedidosContext();

    const {
        mesera,
        codigoConfirmado,
        userRole,
        isInitialized,
        meseras,
        handleSelectMesera,
        handleCodigoSubmit,
        loginSystem,
        handleLogout,
        addMesera,
        deleteMesera,
    } = auth;

    const [showAddForm, setShowAddForm] = useState(false);
    const [showSystemLogin, setShowSystemLogin] = useState(false); // New state for Admin login
    const [newMeseraName, setNewMeseraName] = useState("");
    const [newMeseraCode, setNewMeseraCode] = useState("");

    // System Login States
    const [sysUsername, setSysUsername] = useState("");
    const [sysPassword, setSysPassword] = useState("");

    const navigate = useNavigate();

    // Redirect Logic based on Role
    useEffect(() => {
        if (isInitialized && codigoConfirmado) {
            // Everyone goes to Dashboard (Home)
            navigate('/');
        }
    }, [isInitialized, codigoConfirmado, userRole, navigate]);

    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-purple-400 font-bold tracking-widest text-xs">CARGANDO...</p>
                </div>
            </div>
        );
    }

    const handleAddMeseraSubmit = async (e) => {
        e.preventDefault();
        if (newMeseraName.trim() === "" || newMeseraCode.length !== 4) {
            alert("Por favor, complete el nombre y un código de 4 dígitos.");
            return;
        }
        const result = await addMesera(newMeseraName, newMeseraCode);
        if (!result.success) {
            alert(`Error: ${result.message}`);
        } else {
            setShowAddForm(false);
            setNewMeseraName("");
            setNewMeseraCode("");
        }
    };

    const handleSystemLoginSubmit = async (e) => {
        e.preventDefault();
        const result = await loginSystem(sysUsername, sysPassword);
        if (!result.success) {
            toast.error(result.message);
        }
    };

    const handleDeleteClick = async (e, meseraObj) => {
        e.stopPropagation();
        if (window.confirm(`¿Estás seguro de que quieres eliminar a ${meseraObj.nombre}?`)) {
            const result = await deleteMesera(meseraObj.id);
            if (!result.success) {
                alert(`Error: ${result.message}`);
            }
        }
    };

    // Fake Bartender User for UI
    const bartenderUser = { id: 'sys_bartender', nombre: 'Barra', role: 'bartender', isSystem: true };

    const handleProfileClick = (profile) => {
        if (profile.isSystem) {
            // Is Bartender or Admin -> Show Password Login
            setSysUsername(profile.username || 'barra'); // Default if known
            setShowSystemLogin(true);
            // Optionally set focus or pre-fill
        } else {
            // Is Mesera -> Show Pin Pad
            handleSelectMesera(profile);
        }
    };

    return (
        // Unified Background: Matches Home-Disco and Inventario-Disco
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white selection:bg-purple-500/30">
            {/* Background Glows matching Home-Disco */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Adjusted padding - only add top padding when header is visible */}
            <div className={`flex flex-1 items-center justify-center p-4 sm:p-8 relative z-10 pt-20 sm:pt-24`}>

                {/* System Login Form (Modal-like) */}
                {showSystemLogin && (
                    <div className="bg-[#441E73]/80 backdrop-blur-xl border border-[#6C3FA8] p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.3)] w-full max-w-md text-center animate-fadeIn relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A944FF] to-transparent"></div>
                        <div className="w-16 h-16 bg-gradient-to-br from-[#A944FF] to-[#FF4BC1] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#A944FF]/20">
                            <Lock size={24} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Acceso Sistema</h2>
                        <p className="text-[#C2B6D9] text-sm mb-8">Ingresa tus credenciales</p>

                        <form onSubmit={handleSystemLoginSubmit} className="flex flex-col gap-4">
                            <div className="group relative">
                                <User className="absolute left-4 top-3.5 text-[#8A7BAF] group-focus-within:text-[#A944FF] transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Usuario"
                                    value={sysUsername}
                                    onChange={(e) => setSysUsername(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#2B0D49] border border-[#6C3FA8]/30 text-white placeholder-[#8A7BAF] focus:outline-none focus:bg-[#2B0D49]/80 focus:border-[#A944FF] focus:ring-1 focus:ring-[#A944FF] transition-all"
                                />
                            </div>
                            <div className="group relative">
                                <Lock className="absolute left-4 top-3.5 text-[#8A7BAF] group-focus-within:text-[#A944FF] transition-colors" size={18} />
                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    value={sysPassword}
                                    onChange={(e) => setSysPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#2B0D49] border border-[#6C3FA8]/30 text-white placeholder-[#8A7BAF] focus:outline-none focus:bg-[#2B0D49]/80 focus:border-[#A944FF] focus:ring-1 focus:ring-[#A944FF] transition-all"
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setShowSystemLogin(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-[#C2B6D9] py-3 rounded-xl font-bold transition-all text-sm tracking-wide border border-white/5">VOLVER</button>
                                <button type="submit" className="flex-1 bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] hover:brightness-110 text-white py-3 rounded-xl font-bold shadow-lg shadow-[#A944FF]/30 transition-all transform hover:scale-[1.02] text-sm tracking-wide">INGRESAR</button>
                            </div>
                        </form>
                    </div>
                )}


                {/* Add New Mesera Form */}
                {showAddForm && !showSystemLogin && !mesera && (
                    <div className="bg-[#441E73]/80 backdrop-blur-xl border border-[#6C3FA8] p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.3)] w-full max-w-md text-center animate-fadeIn relative overflow-hidden">
                        {/* Glow Effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A944FF] to-transparent"></div>

                        <div className="w-16 h-16 bg-gradient-to-br from-[#A944FF] to-[#FF4BC1] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#A944FF]/20">
                            <Sparkles size={24} className="text-white" />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">Nueva Mesera</h2>
                        <p className="text-[#C2B6D9] text-sm mb-8">Crea un perfil para acceder al sistema</p>

                        <form onSubmit={handleAddMeseraSubmit} className="flex flex-col gap-4">
                            <div className="group relative">
                                <User className="absolute left-4 top-3.5 text-[#8A7BAF] group-focus-within:text-[#A944FF] transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Nombre completo"
                                    value={newMeseraName}
                                    onChange={(e) => setNewMeseraName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#2B0D49] border border-[#6C3FA8]/30 text-white placeholder-[#8A7BAF] focus:outline-none focus:bg-[#2B0D49]/80 focus:border-[#A944FF] focus:ring-1 focus:ring-[#A944FF] transition-all"
                                />
                            </div>
                            <div className="group relative">
                                <Lock className="absolute left-4 top-3.5 text-[#8A7BAF] group-focus-within:text-[#A944FF] transition-colors" size={18} />
                                <input
                                    type="password"
                                    inputMode="numeric"
                                    placeholder="Código de 4 dígitos"
                                    value={newMeseraCode}
                                    onChange={(e) => /^\d{0,4}$/.test(e.target.value) && setNewMeseraCode(e.target.value)}
                                    maxLength={4}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#2B0D49] border border-[#6C3FA8]/30 text-white placeholder-[#8A7BAF] focus:outline-none focus:bg-[#2B0D49]/80 focus:border-[#A944FF] focus:ring-1 focus:ring-[#A944FF] transition-all tracking-widest"
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-[#C2B6D9] py-3 rounded-xl font-bold transition-all text-sm tracking-wide border border-white/5">CANCELAR</button>
                                <button type="submit" className="flex-1 bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] hover:brightness-110 text-white py-3 rounded-xl font-bold shadow-lg shadow-[#A944FF]/30 transition-all transform hover:scale-[1.02] text-sm tracking-wide">GUARDAR</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Step 1: Select Mesera / System Login Option */}
                {!mesera && !codigoConfirmado && !showAddForm && !showSystemLogin && (
                    <div className="w-full max-w-6xl mx-auto -mt-16 relative">
                        {/* Admin Button - Floating Top Right or Distinct */}
                        <div className="absolute top-0 right-0 hidden sm:block">
                            <button
                                onClick={() => {
                                    setSysUsername('admin');
                                    setShowSystemLogin(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-900/20 text-purple-300 hover:bg-purple-900/40 hover:text-white transition-all text-xs font-bold tracking-widest uppercase hover:shadow-[0_0_15px_rgba(169,68,255,0.3)]"
                            >
                                <Lock size={12} />
                                Admin
                            </button>
                        </div>

                        <div className="text-center mb-12 mt-16 sm:mt-2">
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-[0_0_25px_rgba(169,68,255,0.4)]">
                                LOGIN
                            </h1>
                            <p className="text-xl text-[#C2B6D9] font-light tracking-wide">Selecciona tu perfil</p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-6">

                            {/* Render Meseras + Bartender Combined */}
                            {/* We put Bartender at the START or END? User said "next to". Let's put it as the first item or last item of the list. */}
                            {/* Let's combine them array */}
                            {[bartenderUser, ...meseras].map((profile) => (
                                <button
                                    key={profile.id}
                                    onClick={() => handleProfileClick(profile)}
                                    className={`group relative flex flex-col items-center gap-4 border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm w-48 ${profile.role === 'bartender'
                                        ? 'bg-emerald-900/20 hover:bg-emerald-900/40 border-emerald-500/50 hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                                        : 'bg-[#6C3FA8]/20 hover:bg-[#6C3FA8]/40 border-[#6C3FA8] hover:border-[#A944FF] hover:shadow-[0_0_30px_rgba(169,68,255,0.2)]'
                                        }`}
                                >
                                    <div className="relative">
                                        <div className={`absolute inset-0 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-full ${profile.role === 'bartender' ? 'bg-emerald-500' : 'bg-[#A944FF]'}`}></div>
                                        <div className={`relative w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-inner group-hover:scale-110 transition-transform duration-300 border ${profile.role === 'bartender'
                                            ? 'bg-gradient-to-br from-emerald-900 to-emerald-700 border-emerald-500'
                                            : 'bg-gradient-to-br from-[#441E73] to-[#6C3FA8] border-[#6C3FA8]'
                                            }`}>
                                            {profile.nombre ? profile.nombre.charAt(0).toUpperCase() : '?'}
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <span className={`text-lg font-bold block mb-1 transition-colors truncate max-w-[120px] ${profile.role === 'bartender' ? 'text-emerald-100 group-hover:text-emerald-300' : 'text-white group-hover:text-[#FF4BC1]'}`}>{profile.nombre}</span>
                                        <span className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${profile.role === 'bartender' ? 'text-emerald-500/70 group-hover:text-emerald-400' : 'text-[#8A7BAF] group-hover:text-[#C2B6D9]'}`}>
                                            {profile.role === 'bartender' ? 'Bartender' : 'Mesera'}
                                        </span>
                                    </div>

                                    {!profile.isSystem && (
                                        <div
                                            onClick={(e) => handleDeleteClick(e, profile)}
                                            className="absolute top-2 right-2 p-1.5 text-[#8A7BAF] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                        >
                                            <Trash2Icon />
                                        </div>
                                    )}
                                </button>
                            ))}

                            {/* Add New Mesera Button */}
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="flex flex-col items-center justify-center gap-3 min-h-[180px] border-2 border-dashed border-[#6C3FA8] hover:border-[#A944FF] hover:bg-[#441E73]/20 rounded-2xl text-[#8A7BAF] hover:text-white transition-all duration-300 group w-48"
                            >
                                <div className="w-12 h-12 rounded-full bg-[#441E73]/30 flex items-center justify-center group-hover:bg-[#A944FF]/20 transition-all duration-300">
                                    <Plus size={20} className="group-hover:text-[#A944FF] transition-colors" />
                                </div>
                                <span className="font-bold text-xs tracking-widest uppercase">Nueva Mesera</span>
                            </button>

                            {/* Mobile Admin Button (if needed inline) */}
                            <button
                                onClick={() => {
                                    setSysUsername('admin');
                                    setShowSystemLogin(true);
                                }}
                                className="sm:hidden flex flex-col items-center justify-center gap-3 min-h-[180px] border-2 border-dashed border-gray-600 hover:border-white hover:bg-gray-800/20 rounded-2xl text-gray-500 hover:text-white transition-all duration-300 group w-48"
                            >
                                <div className="w-12 h-12 rounded-full bg-gray-800/30 flex items-center justify-center group-hover:bg-white/10 transition-all duration-300">
                                    <Lock size={20} className="group-hover:text-white transition-colors" />
                                </div>
                                <span className="font-bold text-xs tracking-widest uppercase text-center">Admin</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Code Input (Only for Meseras) */}
                {mesera && !codigoConfirmado && (
                    <div className="w-full max-w-md animate-fadeIn flex justify-center">
                        <CodeInputDisco
                            mesera={mesera}
                            onBack={handleLogout}
                            onSubmit={(code) => {
                                const success = handleCodigoSubmit(code);
                                if (!success) {
                                    toast.error("Clave incorrecta", {
                                        style: {
                                            background: "rgba(220, 38, 38, 0.9)", // red-600
                                            color: "white",
                                            border: "1px solid #991B1B", // red-800
                                            fontWeight: "bold",
                                            backdropFilter: "blur(10px)",
                                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                                        },
                                        iconTheme: {
                                            primary: "white",
                                            secondary: "#DC2626"
                                        }
                                    });
                                }
                            }}
                        />
                    </div>
                )}
            </div >
        </div >
    );
}


