import React from "react";
import { useUserModules } from "../../hooks/useUserModules";
import AccessVerifier from "./AccessVerifier";
import ModuleCard from "./ModuleCard";
import { LogOut } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { button } from "framer-motion/client";

const BackgroundEffects = () => {
    const { isDark } = useTheme();
    if (!isDark) return null; 
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Elegant Purple/Indigo Disco Effects */}
            <div className="absolute top-[-20%] left-[20%] w-[70%] h-[70%] bg-violet-900/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[120px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.03)_0%,transparent_70%)]" />
        </div>
    );
};

const DarkmodeButton = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-6 left-6 z-50
                flex items-center gap-2 px-4 py-2 rounded-full
                bg-white/10 dark:bg-black/40 border border-black/5 dark:border-white/5
                hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:border-black/20 dark:hover:border-white/20
                text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white
                transition-all backdrop-blur-md shadow-2xl"
        >
            <span className="text-xs font-medium uppercase tracking-widest">
                {theme === 'nox' ? "Nox" : "Lux"}
            </span>
        </button>
    );
};

const DashboardHeader = () => (
    <div className="text-center mb-16 sm:mb-20">
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-black mb-6 relative tracking-tighter">
            <span className="relative text-transparent bg-clip-text bg-gradient-to-b from-zinc-900 to-zinc-400 dark:from-white dark:to-zinc-600 tracking-[0.2em] uppercase drop-shadow-2xl">
                Nox<span className="text-zinc-300 dark:text-zinc-700">OS</span>
            </span>
        </h1>
        <div className="h-px w-40 bg-gradient-to-r from-transparent via-zinc-400 dark:via-zinc-500 to-transparent mx-auto opacity-30"></div>
    </div>
);

const LogoutButton = ({ onLogout }) => (
    <button
        onClick={onLogout}
        className="sm:absolute sm:top-6 sm:right-6 mb-8 sm:mb-0 flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/5 hover:bg-red-950/30 hover:border-red-500/30 hover:text-red-200 text-zinc-400 transition-all backdrop-blur-md shadow-2xl group z-50"
    >
        <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-medium uppercase tracking-widest">Cerrar Sesión</span>
    </button>
);

function MainDashboard() {
    // Using the hook to fetch modules and auth logic
    const { visibleModules, handleLogout, auth } = useUserModules();

    return (
        <AccessVerifier auth={auth}>
            <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white overflow-hidden relative selection:bg-zinc-200 dark:selection:bg-zinc-800 transition-colors duration-300">
                <BackgroundEffects />
                <DarkmodeButton/>
                <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16 sm:py-12">
                    <DashboardHeader />
                    <LogoutButton onLogout={handleLogout} />
                    
                    <div className="flex flex-wrap justify-center items-center gap-8 w-full max-w-7xl px-4">
                        {visibleModules.map((item, index) => (
                            <ModuleCard 
                                key={item.path} 
                                item={item} 
                                index={index} 
                            />
                        ))}
                    </div>
                </main>
            </div>
        </AccessVerifier>
    );
}

export default MainDashboard;
