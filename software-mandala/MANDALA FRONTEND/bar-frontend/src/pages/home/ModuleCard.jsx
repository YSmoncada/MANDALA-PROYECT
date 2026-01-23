import React from 'react';
import { useNavigate } from 'react-router-dom';

const ModuleCard = ({ item, index }) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(item.path)}
            className="group relative w-full h-36 sm:w-72 sm:h-72 animate-fadeIn opacity-0"
            style={{
                animationDelay: `${index * 0.1}s`
            }}
        >
            {/* Soft Glow Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 blur-[40px] transition-all duration-500 rounded-[2.5rem]`}></div>

            {/* Main Premium Card */}
            <div className="relative h-full bg-[#120F25]/60 backdrop-blur-xl border border-white/5 group-hover:border-[#A944FF]/50 rounded-[2.5rem] transition-all duration-500 flex flex-col items-center justify-center gap-6 group-hover:bg-[#1A1635] shadow-2xl">
                
                {/* Icon Container */}
                <div className={`p-6 rounded-3xl bg-white/5 border border-white/10 shadow-xl group-hover:shadow-[0_0_30px_rgba(169,68,255,0.2)] transition-all duration-500 transform group-hover:-translate-y-4 group-hover:bg-[#A944FF] text-slate-400 group-hover:text-white`}>
                    <item.icon className="w-10 h-10 sm:w-14 sm:h-14" />
                </div>

                <div className="flex flex-col items-center gap-1">
                    <span className="text-xl sm:text-2xl font-black text-white tracking-widest uppercase transition-colors group-hover:text-[#A944FF]">
                        {item.label}
                    </span>
                    <div className="w-8 h-1 bg-white/10 rounded-full group-hover:w-16 group-hover:bg-[#A944FF] transition-all duration-500"></div>
                </div>
            </div>
        </button>
    );
};

export default ModuleCard;
