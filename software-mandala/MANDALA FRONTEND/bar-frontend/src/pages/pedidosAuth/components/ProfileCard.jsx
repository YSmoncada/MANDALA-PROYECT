import React from 'react';

export default function ProfileCard({ profile, onClick }) {
    // Elegant and minimalist circular avatar
    return (
        <button
            onClick={() => onClick(profile)}
            className="group flex flex-col items-center transition-all active:scale-90"
        >
            <div className="relative p-1 rounded-full border border-transparent group-hover:border-emerald-500/50 transition-all duration-300">
                <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl font-light text-zinc-400 group-hover:text-emerald-400 group-hover:bg-zinc-800 shadow-2xl transition-all overflow-hidden">
                    {/* Generative fallback or profile image if it existed */}
                    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-zinc-800 to-black">
                         {profile.nombre ? profile.nombre.charAt(0).toUpperCase() : '?'}
                    </div>
                </div>
                
                {/* Active Indicator Glow */}
                <div className="absolute inset-0 rounded-full bg-emerald-500/0 group-hover:bg-emerald-500/5 blur-md -z-10 transition-all"></div>
            </div>
        </button>
    );
}
