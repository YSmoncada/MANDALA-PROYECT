import React from "react";
import { useUserModules } from "../../hooks/useUserModules";
import AccessVerifier from "./AccessVerifier";
import ModuleCard from "./ModuleCard";
import { LogOut } from "lucide-react";
import { button } from "framer-motion/client";

/**
 * Visual background effects for the dashboard.
 */
const BackgroundEffects = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[120px]"></div>
    </div>
);

const DarkModeButton = () => {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        const root = document.documentElement;
        if (darkMode) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    return (
        <button
            onClick={() => setDarkMode(!darkMode)}
            className="
                fixed top-6 left-6 z-50
                flex items-center gap-2 px-4 py-2 rounded-xl
                transition-all duration-300 backdrop-blur-xl shadow-lg

                /* LIGHT MODE */
                bg-white/70 border border-gray-200 text-gray-700
                hover:bg-white hover:shadow-xl

                /* DARK MODE */
                dark:bg-black/40 dark:border-white/10 dark:text-gray-300
                dark:hover:bg-black/60 dark:hover:text-white
            "
        >
            <span
                className="
                    flex items-center justify-center w-8 h-8 rounded-lg
                    bg-gray-200 text-gray-700
                    dark:bg-white/10 dark:text-yellow-300
                    transition-all
                "
            >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </span>

            <span className="text-sm font-bold uppercase tracking-wider">
                {darkMode ? "Modo Claro" : "Modo Oscuro"}
            </span>
        </button>
    );
};

const LogoutButton = ({ onLogout }) => (
    <button
        onClick={onLogout}
        className="sm:absolute sm:top-6 sm:right-6 mb-8 sm:mb-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/50 hover:text-white text-gray-400 transition-all backdrop-blur-sm shadow-lg group z-50"
    >
        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold uppercase tracking-wider">Cerrar Sesión</span>
    </button>
);

const DashboardHeader = () => (
    <div className="text-center mb-12 sm:mb-16">
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-black mb-3 sm:mb-4 relative tracking-tighter">
            <span className="relative text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] tracking-[0.2em] uppercase">
                Nox<span className="text-zinc-500">OS</span>
            </span>
        </h1>
        <div className="h-1.5 w-32 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full blur-sm opacity-50"></div>
    </div>
);

function MainDashboard() {
    // Using the hook to fetch modules and auth logic
    const { visibleModules, handleLogout, auth } = useUserModules();

    return (
        <AccessVerifier auth={auth}>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white overflow-hidden relative selection:bg-purple-500/30">
                <BackgroundEffects />
                <DarkmodeButton/>
                <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16 sm:py-12">
                    <DashboardHeader />
                    <LogoutButton onLogout={handleLogout} />
                    

                    <div className="flex flex-wrap justify-center items-center gap-6 w-full max-w-7xl px-4">
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
