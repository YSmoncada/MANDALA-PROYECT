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
            {/* Background Glow */}
            <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-40 blur-2xl transition-all duration-300 rounded-2xl`}></div>

            {/* Main Content */}
            <div className="relative h-full bg-white/5 backdrop-blur-md border border-white/10 group-hover:border-white/20 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-3 sm:gap-6 group-hover:scale-105 group-hover:bg-white/10 shadow-xl">
                <div className={`p-4 sm:p-6 rounded-2xl bg-gradient-to-br ${item.color} shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2`}>
                    <item.icon className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
                </div>

                <span className="text-lg sm:text-2xl font-bold text-white tracking-wide">
                    {item.label}
                </span>
            </div>
        </button>
    );
};

export default ModuleCard;
