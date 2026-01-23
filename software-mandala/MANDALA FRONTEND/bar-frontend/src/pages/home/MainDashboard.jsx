import React from "react";
import { useUserModules } from "../../hooks/useUserModules";
import AccessVerifier from "./AccessVerifier";
import ModuleCard from "./ModuleCard";
import { LogOut } from "lucide-react";

import { UI_CLASSES } from "../../constants/ui";

/**
 * Visual background effects for the dashboard.
 */
const BackgroundEffects = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#A944FF]/10 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FF4BC1]/5 rounded-full blur-[140px]"></div>
    </div>
);

const LogoutButton = ({ onLogout }) => (
    <button
        onClick={onLogout}
        className="sm:absolute sm:top-8 sm:right-10 mb-8 sm:mb-0 flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-rose-500 hover:text-white transition-all backdrop-blur-md shadow-xl group z-50 font-black uppercase text-[10px] tracking-[0.2em]"
    >
        <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>Cerrar Sesión</span>
    </button>
);

const DashboardHeader = () => (
    <div className="text-center mb-16 sm:mb-24">
        <h1 className={UI_CLASSES.titleMain}>
            MANDALA
        </h1>
        <div className="mt-6 flex items-center justify-center gap-4">
            <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-[#A944FF] to-transparent"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-[#A944FF] animate-pulse"></div>
            <div className="h-[2px] w-16 bg-gradient-to-l from-transparent via-[#A944FF] to-transparent"></div>
        </div>
    </div>
);

function MainDashboard() {
    const { visibleModules, handleLogout, auth } = useUserModules();

    return (
        <AccessVerifier auth={auth}>
            <div className="min-h-screen bg-[#0A0910] text-slate-100 overflow-x-hidden relative selection:bg-purple-500/40">
                <BackgroundEffects />
                <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
                    <DashboardHeader />
                    <LogoutButton onLogout={handleLogout} />

                    <div className="flex flex-wrap justify-center items-stretch gap-8 w-full max-w-7xl px-4 animate-fadeIn">
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
