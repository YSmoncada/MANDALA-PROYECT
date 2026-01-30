import React, { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import CodeInputDisco from "./CodeInput-Disco";
import SystemLoginForm from "./components/SystemLoginForm";
import { usePedidosContext } from "../../context/PedidosContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import ThemeToggle from "../../components/ThemeToggle";

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
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 animate-fadeIn relative overflow-hidden transition-all duration-500">
                {/* Background Effects */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black pointer-events-none"></div>

                <div className="w-full max-w-5xl relative z-10 flex flex-col items-center">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="relative inline-block mb-4">
                            <h1 className="text-6xl md:text-7xl font-black text-white tracking-[0.2em] uppercase drop-shadow-2xl">
                                Nox<span className="text-zinc-600">OS</span>
                            </h1>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
                        </div>
                        <p className="text-zinc-500 font-black tracking-[0.4em] text-[10px] sm:text-xs uppercase">Sistema de Gestión Premium</p>
                    </div>

                    {!showSystemLogin ? (
                        <>
                            {/* Profiles Grid */}
                            <div className="w-full mb-16">
                                <div className="flex items-center gap-4 mb-10 justify-center">
                                    <div className="h-px w-8 bg-zinc-800"></div>
                                    <h3 className="text-zinc-500 uppercase tracking-[0.3em] text-[10px] sm:text-xs font-black">Selecciona tu Perfil</h3>
                                    <div className="h-px w-8 bg-zinc-800"></div>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 justify-center">
                                    {profiles.map((profile) => (
                                        <button
                                            key={profile.id}
                                            onClick={() => handleProfileClick(profile)}
                                            className="group flex flex-col items-center gap-5 p-8 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 hover:border-white/20 hover:bg-zinc-900 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.05)] active:scale-95"
                                        >
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all duration-500 shadow-inner overflow-hidden relative">
                                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity"></div>
                                                <span className="text-3xl font-black text-zinc-500 group-hover:text-white transition-all duration-500 scale-100 group-hover:scale-110">
                                                    {profile.nombre.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="text-xs font-black text-zinc-400 group-hover:text-white uppercase tracking-[0.2em] text-center transition-colors">
                                                {profile.nombre}
                                            </span>
                                        </button>
                                    ))}
                                    
                                    {profiles.length === 0 && (
                                        <div className="col-span-full text-center py-20 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
                                            <p className="text-zinc-600 font-bold uppercase tracking-widest text-[10px]">No hay perfiles activos en la base de datos</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Switch to System Login */}
                            <button 
                                onClick={() => setShowSystemLogin(true)}
                                className="px-8 py-3 rounded-full bg-zinc-900 text-zinc-500 hover:text-white transition-all text-[10px] uppercase tracking-[0.3em] font-black border border-white/5 hover:border-white/10 hover:shadow-lg active:scale-95"
                            >
                                Ingresar como Administrador / Barra
                            </button>
                        </>
                    ) : (
                        <div className="w-full max-w-md animate-fadeIn">
                            <div className="mb-8">
                                <button 
                                    onClick={() => setShowSystemLogin(false)}
                                    className="flex items-center gap-3 text-zinc-500 hover:text-white transition-all text-[10px] uppercase tracking-[0.3em] font-black group"
                                >
                                    <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> Volver a perfiles
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
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 to-black pointer-events-none"></div>
             
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
