import React from "react";
import { useUserModules } from "../../hooks/useUserModules";
import AccessVerifier from "./AccessVerifier";
import ModuleCard from "./ModuleCard";
import { LogOut } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../../components/ThemeToggle";

const BackgroundEffects = () => {
    const { isDark } = useTheme();
    if (!isDark) return null; // No special effects in light mode for now or different ones
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Elegant Night Mode Effects */}
            <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-zinc-800/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] bg-zinc-800/5 rounded-full blur-[150px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
        </div>
    );
};

// Redundant DarkmodeButton removed in favor of ThemeToggle

const DashboardHeader = () => (
    <div className="text-center mb-16 sm:mb-24">
        <h1 className="text-7xl sm:text-9xl font-black mb-6 relative tracking-tighter">
            <span className="relative text-transparent bg-clip-text bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-400 dark:from-white dark:via-zinc-100 dark:to-zinc-600 tracking-[0.2em] uppercase drop-shadow-2xl italic">
                Nox<span className="text-zinc-200 dark:text-zinc-800">OS</span>
            </span>
        </h1>
        <div className="h-1 w-32 bg-zinc-900 dark:bg-white mx-auto opacity-10 dark:opacity-20 rounded-full"></div>
    </div>
);

const LogoutButton = ({ onLogout }) => (
    <button
        onClick={onLogout}
        className="sm:absolute sm:top-6 sm:right-6 mb-8 sm:mb-0 flex items-center gap-3 px-6 py-3 rounded-full bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/10 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:border-rose-200 dark:hover:border-rose-500/30 text-zinc-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 font-black text-[10px] uppercase tracking-[0.2em] transition-all backdrop-blur-md shadow-xl dark:shadow-none group z-50 active:scale-95"
    >
        <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>Cerrar Sesión</span>
    </button>
);

function MainDashboard() {
    // Using the hook to fetch modules and auth logic
    const { visibleModules, handleLogout, auth } = useUserModules();

    return (
        <AccessVerifier auth={auth}>
            <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white overflow-hidden relative selection:bg-zinc-200 dark:selection:bg-zinc-800 transition-colors duration-300">
                <BackgroundEffects />
                <div className="fixed top-6 left-6 z-50">
                    <ThemeToggle />
                </div>
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
