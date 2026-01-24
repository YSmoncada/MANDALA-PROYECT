import React, { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import CodeInputDisco from "./CodeInput-Disco";
import ProfileCard from "./components/ProfileCard";
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
        profiles,
        handleSelectProfile,
        handleCodigoSubmit,
        loginSystem,
        handleLogout,
    } = auth;

    const [showSystemLogin, setShowSystemLogin] = useState(true);
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

    const bartenderUser = { id: 'sys_bartender', nombre: 'Bartender', role: 'bartender', isSystem: true };
    const adminUser = { id: 'sys_admin', nombre: 'Administrador', role: 'admin', isSystem: true };

    const handleProfileClick = (profile) => {
        if (profile.isSystem) {
            setSysUsername(profile.username || (profile.role === 'admin' ? 'admin' : 'barra'));
            toast.success(`Perfil seleccionado: ${profile.nombre}`);
        } else {
            handleSelectProfile(profile);
        }
    };

    const handleBackFromPin = () => {
        handleLogout();
        setSysPassword("");
    };

    // Main Master Login Layout
    if (!userName && !codigoConfirmado) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start p-6 pt-16 animate-fadeIn relative overflow-hidden">
                
                {/* Background Shadow Overlay for extra depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black pointer-events-none z-0"></div>
                
                {/* Very subtle background light at bottom */}
                <div className="absolute bottom-[-10%] w-full h-[50%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center w-full max-w-lg">
                    {/* Logo Area */}
                    <div className="mb-12">
                        <div className="w-24 h-24 rounded-full bg-black border border-emerald-500/30 flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.1)] group transition-all duration-500">
                             <div className="w-14 h-14 rounded-full border-2 border-emerald-500/60 bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]"></div>
                             </div>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-medium text-zinc-100 mb-3 tracking-tighter">Bienvenido de nuevo</h1>
                        <p className="text-zinc-500 text-sm font-light tracking-wide max-w-xs mx-auto">
                            Inicia sesión para administrar tu <span className="text-zinc-300">bar o discoteca.</span>
                        </p>
                    </div>

                    {/* Login Form Box */}
                    <div className="w-full mb-12 transform scale-100 hover:scale-[1.01] transition-transform duration-500">
                        <SystemLoginForm 
                            username={sysUsername}
                            password={sysPassword}
                            onUsernameChange={setSysUsername}
                            onPasswordChange={setSysPassword}
                            onSubmit={handleSystemLoginSubmit}
                        />
                    </div>

                    {/* Quick Profile Selection */}
                    <div className="w-full mb-10">
                        <div className="flex items-center gap-6 mb-10">
                            <div className="h-[1px] flex-1 bg-zinc-900"></div>
                            <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 font-black">O entra como:</span>
                            <div className="h-[1px] flex-1 bg-zinc-900"></div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
                            {[adminUser, bartenderUser, ...profiles].map((profile) => (
                                <ProfileCard 
                                    key={profile.id}
                                    profile={profile}
                                    onClick={handleProfileClick}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer simple versioning as in many high-level logins */}
                 <div className="mt-auto pb-6 text-zinc-800 text-[9px] uppercase tracking-[0.4em] font-black z-10">
                    Mandala Ops Core v4.2
                </div>
            </div>
        );
    }

    // PIN Pad Login (for meseras)
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
