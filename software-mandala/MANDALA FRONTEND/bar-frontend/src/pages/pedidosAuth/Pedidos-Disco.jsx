import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
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

    const [showAddForm, setShowAddForm] = useState(false);
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
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-purple-400 font-bold tracking-widest text-xs">CARGANDO...</p>
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
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white selection:bg-purple-500/30">
            {/* Background Glows */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className={`flex flex-1 items-center justify-center p-4 sm:p-8 relative z-10 pt-20 sm:pt-24`}>

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
                    <div className="w-full max-w-6xl mx-auto -mt-16 relative">
                        <div className="text-center mb-12 mt-16 sm:mt-2">
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-[0_0_25px_rgba(169,68,255,0.4)]">
                                Control de acceso
                            </h1>
                            <p className="text-xl text-[#C2B6D9] font-light tracking-wide">Selecciona tu perfil</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6">
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
                                    toast.error("Clave incorrecta", {
                                        style: {
                                            background: "rgba(220, 38, 38, 0.9)",
                                            color: "white",
                                            border: "1px solid #991B1B",
                                            fontWeight: "bold",
                                            backdropFilter: "blur(10px)",
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
