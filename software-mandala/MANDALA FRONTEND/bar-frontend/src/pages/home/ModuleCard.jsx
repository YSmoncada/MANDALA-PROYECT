import React from 'react';
import { useNavigate } from 'react-router-dom';

const ModuleCard = ({ item, index }) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(item.path)}
            className="group relative w-full h-40 sm:w-72 sm:h-72 animate-fadeIn opacity-0"
            style={{
                animationDelay: `${index * 0.1}s`
            }}
        >
            {/* Background Glow - Subtle on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 blur-[50px] sm:blur-[80px] transition-all duration-700 rounded-[3rem]`}></div>

            {/* Main Content */}
            <div className="relative h-full bg-white dark:bg-zinc-900/40 border border-zinc-100 dark:border-white/5 group-hover:border-zinc-300 dark:group-hover:border-white/20 rounded-[2.5rem] transition-all duration-700 flex flex-col items-center justify-center gap-4 sm:gap-8 group-hover:scale-[1.03] group-hover:bg-zinc-50 dark:group-hover:bg-zinc-900/50 backdrop-blur-md shadow-lg group-hover:shadow-2xl dark:shadow-none transform-gpu">
                
                {/* Icon Container - Pop of color */}
                <div className={`p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-gradient-to-br ${item.color} shadow-xl group-hover:shadow-2xl transition-all duration-700 transform group-hover:-translate-y-2 relative overflow-hidden group-hover:rotate-[2deg]`}>
                    <div className="absolute inset-0 bg-white/30 dark:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
                    <item.icon className="w-10 h-10 sm:w-16 sm:h-16 text-white drop-shadow-lg" strokeWidth={1} />
                </div>

                <div className="flex flex-col items-center gap-1">
                    <span className="text-xs sm:text-base font-black text-zinc-900 dark:text-white tracking-[0.2em] uppercase transition-colors duration-500">
                        {item.label || "Sin Título"}
                    </span>
                    <div className="h-0.5 w-0 group-hover:w-10 bg-zinc-900 dark:bg-white transition-all duration-500 opacity-20 dark:opacity-40"></div>
                </div>
            </div>
        </button>
    );
};

export default ModuleCard;
