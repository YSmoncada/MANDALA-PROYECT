import React, { useState, useEffect } from "react";
import { useUserModules } from "../../hooks/useUserModules";
import AccessVerifier from "./AccessVerifier";
import ModuleCard from "./ModuleCard";
import { LogOut } from "lucide-react";

/* =========================
   BACKGROUND EFFECTS
========================= */
const BackgroundEffects = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
            className="
                absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full
                bg-purple-400/30 blur-[140px]
                dark:bg-purple-600/10
            "
        />
        <div
            className="
                absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full
                bg-pink-400/30 blur-[140px]
                dark:bg-pink-600/10
            "
        />
    </div>
);

/* =========================
   DARK MODE BUTTON
========================= */
const DarkmodeButton = () => {
    const [dark, setDark] = useState(
        document.documentElement.classList.contains("dark")
    );

    useEffect(() => {
        const root = document.documentElement;
        dark ? root.classList.add("dark") : root.classList.remove("dark");
    }, [dark]);

    return (
        <button
            onClick={() => setDark(!dark)}
            className="
                fixed top-6 left-6 z-50
                px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider
                transition-all backdrop-blur-sm shadow-lg

                bg-black/5 text-gray-700 border border-black/10
                hover:bg-black/10

                dark:bg-white/5 dark:text-gray-300 dark:border-white/10
                dark:hover:bg-white/10
            "
        >
            {dark ? "Modo Claro" : "Modo Oscuro"}
        </button>
    );
};

/* =========================
   LOGOUT BUTTON
========================= */
const LogoutButton = ({ onLogout }) => (
    <button
        onClick={onLogout}
        className="
            sm:absolute sm:top-6 sm:right-6 mb-8 sm:mb-0
            flex items-center gap-2 px-4 py-2 rounded-xl
            transition-all backdrop-blur-sm shadow-lg group z-50

            bg-black/5 text-gray-700 border border-black/10
            hover:bg-red-500/10 hover:text-red-600

            dark:bg-white/5 dark:text-gray-400 dark:border-white/10
            dark:hover:bg-red-500/20 dark:hover:text-white
        "
    >
        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold uppercase tracking-wider">
            Cerrar Sesión
        </span>
    </button>
);

/* =========================
   HEADER
========================= */
const DashboardHeader = () => (
    <div className="text-center mb-16">
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-[0.2em] uppercase">
            <span className="text-gray-900 dark:text-white">
                Nox<span className="text-zinc-500">OS</span>
            </span>
        </h1>

        <div className="h-1.5 w-32 mx-auto mt-4 rounded-full blur-sm opacity-70
            bg-gradient-to-r from-purple-500 to-pink-500" />
    </div>
);

/* =========================
   MAIN DASHBOARD
========================= */
function MainDashboard() {
    const { visibleModules, handleLogout, auth } = useUserModules();

    return (
        <AccessVerifier auth={auth}>
            <div
                className="
                    min-h-screen relative overflow-hidden
                    bg-gradient-to-br from-gray-100 via-purple-100 to-white
                    text-gray-900

                    dark:bg-black dark:text-white
                "
            >
                <BackgroundEffects />
                <DarkmodeButton />

                <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">
                    <DashboardHeader />
                    <LogoutButton onLogout={handleLogout} />

                    <div className="flex flex-wrap justify-center gap-6 w-full max-w-7xl mt-10">
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
