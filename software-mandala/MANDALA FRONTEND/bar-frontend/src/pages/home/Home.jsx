import React from "react";
import { useNavigate } from "react-router-dom";
import { Package, ClipboardList, SquareKanban, History, GlassWater, DollarSign } from "lucide-react";

function HomeDisco() {
    const navigate = useNavigate();

    const menuItems = [
        { icon: Package, label: "Inventario", path: "/inventario", color: "from-cyan-400 to-blue-500" },
        { icon: ClipboardList, label: "Pedidos", path: "/login", color: "from-pink-400 to-rose-500" },
        { icon: SquareKanban, label: "Mesas", path: "/mesas", color: "from-purple-400 to-fuchsia-500" },
        { icon: History, label: "Historial", path: "/historial-pedidos", color: "from-yellow-400 to-orange-500" },
        { icon: GlassWater, label: "Bartender", path: "/bartender", color: "from-green-400 to-emerald-500" },
        { icon: DollarSign, label: "Contabilidad", path: "/contabilidad-disco", color: "from-indigo-400 to-violet-500" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white overflow-hidden relative">
            {/* Subtle static background - no animations for night work */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
            </div>

            <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
                {/* Title with subtle glow - comfortable for night work */}
                <div className="text-center mb-16">
                    <h1 className="text-8xl md:text-9xl font-black mb-4 relative inline-block">
                        {/* Subtle glow layer - reduced for night work */}
                        <span className="absolute inset-0 blur-xl bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-20"></span>
                        {/* Main text - white for maximum visibility */}
                        <span className="relative text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                            MANDALA
                        </span>
                    </h1>
                    <p className="text-2xl md:text-3xl text-white font-light tracking-wide">
                        Selecciona a dónde quieres ir
                    </p>
                </div>

                {/* Improved menu grid with glass effect */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl">
                    {menuItems.map((item, index) => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className="group relative w-full sm:w-48 h-48"
                            style={{
                                animation: `fadeIn 0.5s ease-out ${index * 0.08}s both`
                            }}
                        >
                            {/* Glow on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-40 blur-2xl transition-all duration-300 rounded-2xl`}></div>

                            {/* Glass card */}
                            <div className="relative h-full bg-white/5 backdrop-blur-md border border-white/10 group-hover:border-white/20 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-4 group-hover:scale-105 group-hover:bg-white/10">
                                {/* Icon with gradient background */}
                                <div className={`p-4 rounded-xl bg-gradient-to-br ${item.color} shadow-lg`}>
                                    <item.icon className="w-10 h-10 text-white" />
                                </div>

                                {/* Label - white and bold for better visibility */}
                                <span className="text-xl font-bold text-white">
                                    {item.label}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </main>

            {/* Simple CSS Animations */}
            <style jsx>{`
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

export default HomeDisco;
