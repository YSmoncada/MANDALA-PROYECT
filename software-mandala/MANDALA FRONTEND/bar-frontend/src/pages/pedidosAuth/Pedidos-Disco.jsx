import React, { useState, useEffect } from "react";
import { Plus, ShieldCheck, Zap } from "lucide-react";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import CodeInputDisco from "./CodeInput-Disco";
import ProfileCard from "./components/ProfileCard";
import SystemLoginForm from "./components/SystemLoginForm";
import { usePedidosContext } from "../../context/PedidosContext";

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

    const [showSystemLogin, setShowSystemLogin] = useState(false);
    const [sysUsername, setSysUsername] = useState("");
    const [sysPassword, setSysPassword] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (isInitialized && codigoConfirmado) {
            navigate('/', { replace: true });
        }
    }, [isInitialized, codigoConfirmado, userRole, navigate]);

    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                    <div className="w-16 h-16 border-2 border-white/5 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-white font-black tracking-[0.5em] text-[10px] uppercase animate-pulse">Initializing Security...</p>
                </div>
            </div>
        );
    }

    const handleSystemLoginSubmit = async (e) => {
        e.preventDefault();
        const result = await loginSystem(sysUsername, sysPassword);
        if (!result.success) {
            toast.error(result.message);
        }
    };

    const bartenderUser = { id: 'sys_bartender', nombre: 'Barra', role: 'bartender', isSystem: true };
    const adminUser = { id: 'sys_admin', nombre: 'Admin', role: 'admin', isSystem: true };
    const pruebaUser = { id: 'sys_prueba', nombre: 'Prueba', username: 'prueba', role: 'prueba', isSystem: true };

    const handleProfileClick = (profile) => {
        if (profile.isSystem) {
            setSysUsername(profile.username || (profile.role === 'admin' ? 'admin' : 'barra'));
            setShowSystemLogin(true);
        } else {
            handleSelectProfile(profile);
        }
    };

    const handleBackFromSystemLogin = () => {
        setShowSystemLogin(false);
        setSysUsername("");
        setSysPassword("");
    };

    const handleBackFromPin = () => {
        handleLogout();
        setSysPassword("");
    };

    return (
        <div className="min-h-screen flex flex-col bg-black text-white selection:bg-white/20 overflow-x-hidden">
            {/* Ultra Premium Background */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Subtle Radial Glows */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-600/5 rounded-full blur-[120px] animate-pulse animation-delay-2000"></div>
                
                {/* Abstract Lines/Grid */}
                <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <div className="flex flex-1 items-center justify-center p-6 sm:p-12 relative z-10">
                
                {/* Floating Navigation Label */}
                <div className="absolute top-10 left-10 flex items-center gap-3 opacity-40 group hover:opacity-100 transition-opacity">
                    <ShieldCheck size={18} className="text-white" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Mandala HQ • Secure Node</span>
                </div>

                {/* System Login Form */}
                {showSystemLogin && (
                    <SystemLoginForm 
                        username={sysUsername}
                        password={sysPassword}
                        onUsernameChange={setSysUsername}
                        onPasswordChange={setSysPassword}
                        onSubmit={handleSystemLoginSubmit}
                        onBack={handleBackFromSystemLogin}
                    />
                )}

                {/* Profile Selection Step */}
                {!userName && !codigoConfirmado && !showSystemLogin && (
                    <div className="w-full max-w-7xl mx-auto animate-fadeIn group">
                        <div className="text-center mb-20">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
                                <Zap size={14} className="text-[#A944FF]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Access Protocol Active</span>
                            </div>
                            
                            <h1 className="text-6xl md:text-9xl font-black text-white mb-6 tracking-tighter uppercase leading-none">
                                IDENTIFY<br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-800">YOURSELF.</span>
                            </h1>
                            <p className="text-zinc-600 font-medium tracking-[0.5em] uppercase text-xs">Select your operational profile</p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-8 md:gap-12 px-4">
                            {[adminUser, bartenderUser, pruebaUser, ...profiles].map((profile) => (
                                <ProfileCard 
                                    key={profile.id}
                                    profile={profile}
                                    onClick={handleProfileClick}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Code Input (PIN Pad) */}
                {userName && !codigoConfirmado && (
                    <div className="w-full max-w-md animate-fadeIn flex justify-center">
                        <CodeInputDisco
                            nombre={userName}
                            onBack={handleBackFromPin}
                            onSubmit={async (code) => {
                                const success = await handleCodigoSubmit(code);
                                if (!success) {
                                    toast.error("Security Breach: Invalid PIN", {
                                        style: {
                                            background: "#000",
                                            color: "#fff",
                                            border: "1px solid #ff4b4b",
                                            fontWeight: "900",
                                            textTransform: "uppercase",
                                            fontSize: "10px",
                                            letterSpacing: "0.2em",
                                            padding: "20px"
                                        }
                                    });
                                }
                            }}
                        />
                    </div>
                )}
            </div >
            
            {/* Version Label */}
            <div className="fixed bottom-10 right-10 text-[8px] font-black text-zinc-800 uppercase tracking-[0.5em] pointer-events-none">
                Build: Mand-2026.v4
            </div>
        </div >
    );
}
