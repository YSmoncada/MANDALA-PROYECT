import React, { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import CodeInputDisco from "./CodeInput-Disco";
import SystemLoginForm from "./components/SystemLoginForm";
import { usePedidosContext } from "../../context/PedidosContext";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function PedidosDisco() {
    const { auth } = usePedidosContext();

    const {
        userName,
        codigoConfirmado,
        profiles,
        handleSelectProfile,
        handleCodigoSubmit,
        loginSystem,
        handleLogout,
        isInitialized
    } = auth;

    const [sysUsername, setSysUsername] = useState("");
    const [sysPassword, setSysPassword] = useState("");
    const [rememberSession, setRememberSession] = useState(false);
    const [showSystemLogin, setShowSystemLogin] = useState(false);

    const navigate = useNavigate();

    // Redirect if already authenticated
    useEffect(() => {
        if (isInitialized && codigoConfirmado) {
             navigate("/", { replace: true });
        }
    }, [isInitialized, codigoConfirmado, navigate]);

    // Load remember session preference on mount
    useEffect(() => {
        const remembered = localStorage.getItem('rememberSession') === 'true';
        setRememberSession(remembered);
    }, []);

    const handleSystemLoginSubmit = async (e) => {
        e.preventDefault();
        
        // Store remember preference
        localStorage.setItem('rememberSession', rememberSession.toString());
        
        const result = await loginSystem(sysUsername, sysPassword);
        if (!result.success) {
            toast.error(result.message);
        } else {
            toast.success('Acceso concedido');
            navigate('/', { replace: true });
        }
    };

    const handleProfileClick = (profile) => {
        handleSelectProfile(profile);
    };

    const handleBackFromPin = () => {
        handleLogout();
        setSysPassword("");
        // Clear remember session when logging out explicitly?
        // Maybe better to keep it? The user explicitly clicked back/logout.
        // Let's clear it to be safe.
        localStorage.removeItem('rememberSession');
    };

    if (!isInitialized) {
        return <LoadingSpinner />;
    }

    // MAIN VIEW: Profile Selection or System Login
    if (!userName && !codigoConfirmado) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 animate-fadeIn relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black pointer-events-none"></div>

                <div className="w-full max-w-5xl relative z-10 flex flex-col items-center">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-black text-white tracking-[0.2em] uppercase mb-4 drop-shadow-2xl">
                            Nox<span className="text-zinc-500">OS</span>
                        </h1>
                        <p className="text-zinc-500 font-medium tracking-widest text-xs uppercase">Sistema de Gestión Premium</p>
                    </div>

                    {!showSystemLogin ? (
                        <>
                            {/* Profiles Grid */}
                            <div className="w-full mb-12">
                                <h3 className="text-center text-zinc-400 uppercase tracking-widest text-sm font-bold mb-8">Selecciona tu Perfil</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center">
                                    {profiles.map((profile) => (
                                        <button
                                            key={profile.id}
                                            onClick={() => handleProfileClick(profile)}
                                            className="group flex flex-col items-center gap-4 p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/20 hover:bg-zinc-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-white/5 active:scale-95"
                                        >
                                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors shadow-inner">
                                                <span className="text-2xl font-bold text-zinc-400 group-hover:text-white transition-colors">
                                                    {profile.nombre.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="text-sm font-bold text-zinc-300 group-hover:text-white uppercase tracking-wider text-center">
                                                {profile.nombre}
                                            </span>
                                        </button>
                                    ))}
                                    
                                    {/* Add logic to show 'Empty' if no profiles */}
                                    {profiles.length === 0 && (
                                        <div className="col-span-full text-center py-10 opacity-50">
                                            <p className="text-zinc-500">No hay perfiles disponibles.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Switch to System Login */}
                            <button 
                                onClick={() => setShowSystemLogin(true)}
                                className="text-zinc-600 hover:text-white transition-colors text-xs uppercase tracking-widest font-bold border-b border-transparent hover:border-zinc-500 pb-1"
                            >
                                Ingresar como Administrador / Barra
                            </button>
                        </>
                    ) : (
                        <div className="w-full max-w-md animate-fadeIn">
                            <div className="mb-6">
                                <button 
                                    onClick={() => setShowSystemLogin(false)}
                                    className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs uppercase tracking-widest font-bold"
                                >
                                    <span className="text-lg">←</span> Volver a perfiles
                                </button>
                            </div>
                            <SystemLoginForm 
                                username={sysUsername}
                                password={sysPassword}
                                onUsernameChange={setSysUsername}
                                onPasswordChange={setSysPassword}
                                onSubmit={handleSystemLoginSubmit}
                                rememberSession={rememberSession}
                                onRememberSessionChange={setRememberSession}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // PIN Pad Login (Safe Mode)
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 animate-fadeIn relative">
             <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-zinc-900/20 to-transparent pointer-events-none"></div>
            <div className="w-full max-w-md relative z-10">
                <CodeInputDisco
                    nombre={userName}
                    onBack={handleBackFromPin}
                    onSubmit={async (code, remember) => {
                        // Update storage preference based on checkbox from CodeInput
                        localStorage.setItem('rememberSession', remember.toString());
                        
                        const success = await handleCodigoSubmit(code);
                        if (!success) {
                            toast.error("Error: Acceso denegado");
                        } else {
                            toast.success(`Bienvenido, ${userName}`);
                            navigate('/', { replace: true });
                        }
                    }}
                />
            </div>
        </div>
    );
}
