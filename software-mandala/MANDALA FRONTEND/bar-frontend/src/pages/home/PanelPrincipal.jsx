import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { usePedidosContext } from "../../context/PedidosContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import { ALL_MODULES } from "./listaDeBotones";
import VerificadorDeAcceso from "./VerificadorDeAcceso";

function PanelPrincipal() {
    const navigate = useNavigate();
    const { auth } = usePedidosContext();
    const { isInitialized, codigoConfirmado, userRole, role, handleLogout } = auth;

    const currentRole = role || userRole || (codigoConfirmado ? 'mesera' : null);
    const visibleModules = currentRole ? ALL_MODULES.filter(m => m.allowedRoles.includes(currentRole)) : [];

    return (
        <VerificadorDeAcceso auth={auth}>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white overflow-hidden relative selection:bg-purple-500/30">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[120px]"></div>
                </div>

                <button
                    onClick={handleLogout}
                    className="absolute top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/50 hover:text-white text-gray-400 transition-all backdrop-blur-sm"
                >
                    <LogOut size={18} />
                    <span className="text-sm font-bold">Salir</span>
                </button>

                <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16 sm:py-12">
                    <div className="text-center mb-12 sm:mb-16">
                        <h1 className="text-6xl sm:text-8xl md:text-9xl font-black mb-3 sm:mb-4 relative tracking-tighter">
                            <span className="relative text-white drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                                MANDALA
                            </span>
                        </h1>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-6 w-full max-w-7xl px-4">
                        {visibleModules.map((item, index) => (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className="group relative w-full h-40 sm:w-64 sm:h-64 animate-fade-in opacity-0"
                                style={{
                                    animationDelay: `${index * 0.1}s`
                                }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-40 blur-2xl transition-all duration-300 rounded-2xl`}></div>

                                <div className="relative h-full bg-white/5 backdrop-blur-md border border-white/10 group-hover:border-white/20 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-3 sm:gap-6 group-hover:scale-105 group-hover:bg-white/10 shadow-xl">
                                    <div className={`p-4 sm:p-6 rounded-2xl bg-gradient-to-br ${item.color} shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2`}>
                                        <item.icon className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
                                    </div>

                                    <span className="text-lg sm:text-2xl font-bold text-white tracking-wide">
                                        {item.label}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </main>
            </div>
        </VerificadorDeAcceso>
    );
}

export default PanelPrincipal;
