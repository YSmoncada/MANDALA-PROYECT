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
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-950/40 via-black to-black pointer-events-none"></div>

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

                    {/* System Login Form ONLY */}
                    <div className="w-full max-w-md animate-fadeIn">
                        <SystemLoginForm 
                            username={sysUsername}
                            password={sysPassword}
                            onUsernameChange={setSysUsername}
                            onPasswordChange={setSysPassword}
                            onSubmit={handleSystemLoginSubmit}
                            rememberSession={rememberSession}
                            onRememberSessionChange={setRememberSession}
                        />

                        <div className="mt-12 text-center">
                            <p className="text-zinc-600 text-[9px] uppercase tracking-[0.4em] font-black opacity-40">
                                Acceso Restringido • Personal Autorizado
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // PIN Pad Login (Safe Mode)
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 animate-fadeIn relative">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-950/40 to-black pointer-events-none"></div>
             
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
