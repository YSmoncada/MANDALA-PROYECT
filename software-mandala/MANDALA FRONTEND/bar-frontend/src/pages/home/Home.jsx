import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, ClipboardList, SquareKanban, History, GlassWater, DollarSign, LogOut } from "lucide-react";
import { usePedidosContext } from "../../context/PedidosContext";

function Home() {
    const navigate = useNavigate();
    const { auth } = usePedidosContext();
    const { isInitialized, codigoConfirmado, handleLogout, mesera, role } = auth; // Añadido 'role'

    // Redirección mejorada: solo redirige si no hay un rol de admin/bartender
    // Y TAMPOCO hay un código de mesera confirmado.
    useEffect(() => {
        if (isInitialized && !role && !codigoConfirmado) { // Usar 'role' directamente
            // Si no hay rol de Django Y no hay código de mesera, entonces sí redirigir.
            // Esto permite que admin y bartender (que tienen auth.role) puedan entrar.
            navigate('/login', { replace: true });
        }
    }, [isInitialized, role, codigoConfirmado, navigate]);

    // Define all available modules
    const allModules = [
        {
            id: 'inventario',
            icon: Package,
            label: "Inventario",
            path: "/inventario",
            color: "from-cyan-400 to-blue-500",
            allowedRoles: ['admin', 'bartender', 'mesera'] // Only admin
        },
        {
            id: 'pedidos',
            icon: ClipboardList,
            label: "Pedidos",
            path: "/pedidos-disco", // Ruta a la página de productos
            color: "from-pink-400 to-rose-500",
            allowedRoles: ['admin', 'bartender', 'mesera']
        },
        {
            id: 'mesas',
            icon: SquareKanban,
            label: "Mesas",
            path: "/mesas",
            color: "from-purple-400 to-fuchsia-500",
            allowedRoles: ['admin', 'bartender', 'mesera']
        },
        {
            id: 'historial',
            icon: History,
            label: "Historial",
            path: "/historial-pedidos",
            color: "from-yellow-400 to-orange-500",
            allowedRoles: ['admin', 'bartender', 'mesera']
        },
        {
            id: 'bartender',
            icon: GlassWater,
            label: "Bartender",
            path: "/bartender-disco",
            color: "from-green-400 to-emerald-500",
            allowedRoles: ['admin', 'bartender']
        },
        {
            id: 'contabilidad',
            icon: DollarSign,
            label: "Contabilidad",
            path: "/contabilidad-disco",
            color: "from-indigo-400 to-violet-500",
            allowedRoles: ['admin', 'bartender', 'mesera']
        },
    ];

    // Filter modules based on role
    // Fallback: if role is null (but codigoConfirmado is true, likely Mesera legacy), default to mesera role
    const currentRole = role || (codigoConfirmado ? 'mesera' : null); // Usar 'role' directamente

    const visibleModules = currentRole ? allModules.filter(m => m.allowedRoles.includes(currentRole)) : [];


    if (!isInitialized) return null; // Or loading spinner

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white overflow-hidden relative selection:bg-purple-500/30">
            {/* Subtle static background - no animations for night work */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
            </div>

            {/* Logout Button (Top Right) */}
            <button
                onClick={handleLogout}
                className="absolute top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/50 hover:text-white text-gray-400 transition-all backdrop-blur-sm"
            >
                <LogOut size={18} />
                <span className="text-sm font-bold">Salir</span>
            </button>

            <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16 sm:py-12">
                {/* Title with subtle glow */}
                <div className="text-center mb-12 sm:mb-16">
                    <h1 className="text-6xl sm:text-8xl md:text-9xl font-black mb-3 sm:mb-4 relative inline-block">
                        {/* Subtle glow layer */}
                        <span className="absolute inset-0 blur-xl bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-20"></span>
                        {/* Main text */}
                        <span className="relative text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                            MANDALA
                        </span>
                    </h1>
                    <p className="text-lg sm:text-2xl md:text-3xl text-white/80 font-light tracking-wide">
                        Hola, <span className="font-bold text-[#A944FF]">{mesera || 'Usuario'}</span>
                    </p>
                </div>

                {/* Improved menu grid with glass effect */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl justify-items-center">
                    {visibleModules.map((item, index) => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className="group relative w-full h-40 sm:w-64 sm:h-64"
                            style={{
                                animation: `fadeIn 0.5s ease-out ${index * 0.08}s both`
                            }}
                        >
                            {/* Glow on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-40 blur-2xl transition-all duration-300 rounded-2xl`}></div>

                            {/* Glass card */}
                            <div className="relative h-full bg-white/5 backdrop-blur-md border border-white/10 group-hover:border-white/20 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-3 sm:gap-6 group-hover:scale-105 group-hover:bg-white/10 shadow-xl">
                                {/* Icon with gradient background */}
                                <div className={`p-4 sm:p-6 rounded-2xl bg-gradient-to-br ${item.color} shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2`}>
                                    <item.icon className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
                                </div>

                                {/* Label - white and bold for better visibility */}
                                <span className="text-lg sm:text-2xl font-bold text-white tracking-wide">
                                    {item.label}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </main>

            {/* Simple CSS Animations */}
            <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
}

export default Home;
