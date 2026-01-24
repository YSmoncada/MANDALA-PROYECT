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
        userRole,
        isInitialized,
        handleCodigoSubmit,
        loginSystem,
        handleLogout,
    } = auth;

    const [sysUsername, setSysUsername] = useState("");
    const [sysPassword, setSysPassword] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (isInitialized && codigoConfirmado) {
            navigate('/', { replace: true });
        }
    }, [isInitialized, codigoConfirmado, userRole, navigate]);

    if (!isInitialized) return <LoadingSpinner />;

    const handleSystemLoginSubmit = async (e) => {
        e.preventDefault();
        const result = await loginSystem(sysUsername, sysPassword);
        if (!result.success) {
            toast.error(result.message);
        }
    };

    const handleBackFromPin = () => {
        handleLogout();
        setSysPassword("");
    };

    // Main Security Login Layout (Standard)
    if (!userName && !codigoConfirmado) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 animate-fadeIn relative overflow-hidden">
                
                {/* Very subtle background light for depth - no vibrant neons */}
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-zinc-800/5 blur-[150px] rounded-full pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center w-full max-w-lg">
                    {/* Minimalist Professional Logo */}
                    <div className="mb-14">
                        <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center shadow-2xl">
                             <div className="w-10 h-10 border-2 border-zinc-100 rounded-full flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-zinc-100 rounded-full"></div>
                             </div>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Acceso Corporativo</h1>
                        <p className="text-zinc-500 text-xs font-medium tracking-[0.2em] uppercase max-w-xs mx-auto">
                            Ingresa tus credenciales para administrar <br/> el sistema Mandala.
                        </p>
                    </div>

                    {/* Login Form Box */}
                    <div className="w-full">
                        <SystemLoginForm 
                            username={sysUsername}
                            password={sysPassword}
                            onUsernameChange={setSysUsername}
                            onPasswordChange={setSysPassword}
                            onSubmit={handleSystemLoginSubmit}
                        />
                    </div>

                    {/* Security Subtext */}
                    <div className="mt-12 flex items-center gap-2 opacity-30">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Servidor Seguro Activo</span>
                    </div>
                </div>

                {/* Footer simple versioning */}
                 <div className="mt-20 pb-6 text-zinc-900 text-[8px] uppercase tracking-[0.5em] font-black z-10">
                    Mandala Core Protocol v5.0
                </div>
            </div>
        );
    }

    // PIN Pad Login (Safe Mode)
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 animate-fadeIn">
            <div className="w-full max-w-md">
                <CodeInputDisco
                    nombre={userName}
                    onBack={handleBackFromPin}
                    onSubmit={async (code) => {
                        const success = await handleCodigoSubmit(code);
                        if (!success) {
                            toast.error("Error: Acceso denegado");
                        }
                    }}
                />
            </div>
        </div>
    );
}
