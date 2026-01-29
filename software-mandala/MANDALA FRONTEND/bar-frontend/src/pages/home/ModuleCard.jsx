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
            {/* Background Glow - Subtle on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 blur-3xl transition-all duration-500 rounded-3xl`}></div>

            {/* Main Content */}
            <div className="relative h-full bg-zinc-900/30 border border-white/5 group-hover:border-white/10 rounded-3xl transition-all duration-500 flex flex-col items-center justify-center gap-4 sm:gap-6 group-hover:scale-[1.02] group-hover:bg-zinc-900/50 backdrop-blur-sm shadow-2xl">
                
                {/* Icon Container - Pop of color */}
                <div className={`p-5 sm:p-6 rounded-2xl bg-gradient-to-br ${item.color} shadow-[0_0_30px_-5px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_40px_-5px_rgba(0,0,0,0.7)] transition-all duration-500 transform group-hover:-translate-y-1 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"></div>
                    <item.icon className="w-8 h-8 sm:w-12 sm:h-12 text-white drop-shadow-md" strokeWidth={1.5} />
                </div>

                <span className="text-sm sm:text-lg font-medium text-zinc-300 group-hover:text-white tracking-[0.1em] uppercase transition-colors duration-300">
                    {item.label}
                </span>
            </div>
        </button>
    );
};

export default ModuleCard;
