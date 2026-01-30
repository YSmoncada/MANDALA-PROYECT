import React from 'react';
import { useNavigate } from 'react-router-dom';

const ModuleCard = ({ item, index }) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(item.path)}
            className="group relative w-full h-40 sm:w-64 sm:h-64 animate-fade-in opacity-0"
            style={{
                animationDelay: `${index * 0.1}s`
            }}
        >
            {/* Background Glow - Theme responsive */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-30 dark:group-hover:opacity-10 blur-3xl transition-all duration-500 rounded-3xl`}></div>

            {/* Main Content */}
            <div className="relative h-full bg-gray-900/40 dark:bg-zinc-900/30 border border-white/10 dark:border-white/5 group-hover:border-white/20 dark:group-hover:border-white/15 rounded-[2rem] transition-all duration-500 flex flex-col items-center justify-center gap-4 sm:gap-6 group-hover:scale-105 group-hover:bg-gray-900/60 dark:group-hover:bg-zinc-900/50 backdrop-blur-sm shadow-2xl">
                
                {/* Icon Container - Pop of color */}
                <div className={`p-5 sm:p-6 rounded-2xl bg-gradient-to-br ${item.color} shadow-lg group-hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.1)] transition-all duration-500 transform group-hover:-translate-y-2 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"></div>
                    <item.icon className="w-10 h-10 sm:w-14 sm:h-14 text-white drop-shadow-md" strokeWidth={1.5} />
                </div>

                <span className="text-lg sm:text-2xl font-bold dark:font-black text-white dark:text-zinc-300 group-hover:text-white tracking-wide dark:tracking-[0.1em] uppercase transition-all duration-300">
                    {item.label}
                </span>
            </div>
        </button>
    );
};

export default ModuleCard;
