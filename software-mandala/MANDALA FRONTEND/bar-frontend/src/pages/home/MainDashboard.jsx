import React from "react";
import { useUserModules } from "../../hooks/useUserModules";
import AccessVerifier from "./AccessVerifier";
import ModuleCard from "./ModuleCard";
import { LogOut } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { UI_CLASSES } from "../../constants/ui";

const BackgroundEffects = () => {
    const { isDark } = useTheme();
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {isDark ? (
                <>
                    <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-zinc-800/5 rounded-full blur-[150px]" />
                    <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] bg-zinc-800/5 rounded-full blur-[150px]" />
                </>
            ) : (
                <>
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[120px]" />
                </>
            )}
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
            <span className="relative text-white tracking-[0.2em] uppercase drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                Nox<span className="text-zinc-500">OS</span>
            </span>
        </h1>
        {/* Colorful Lux line or Subtle Nox line */}
        <div className="h-1.5 w-32 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-zinc-500 dark:to-zinc-800 mx-auto rounded-full blur-[2px] opacity-50 transition-all duration-500"></div>
    </div>
);

const LogoutButton = ({ onLogout }) => (
    <button
        onClick={onLogout}
        className={UI_CLASSES.buttonDanger + " sm:absolute sm:top-6 sm:right-6 mb-8 sm:mb-0 z-50"}
    >
        <LogOut size={16} />
        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Cerrar Sesión</span>
    </button>
);

function MainDashboard() {
    // Using the hook to fetch modules and auth logic
    const { visibleModules, handleLogout, auth } = useUserModules();

    return (
        <AccessVerifier auth={auth}>
            <div className="min-h-screen bg-transparent text-white overflow-hidden relative selection:bg-purple-500/30 transition-colors duration-500">
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
