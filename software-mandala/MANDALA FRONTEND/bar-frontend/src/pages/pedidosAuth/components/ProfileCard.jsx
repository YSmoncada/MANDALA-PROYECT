import React from 'react';

const handleProfileStyles = (profile) => {
    if (profile.role === 'admin') {
        return {
            card: 'bg-black/40 hover:bg-rose-950/20 border-white/5 hover:border-rose-500/50 hover:shadow-[0_0_40px_rgba(244,63,94,0.15)]',
            glow: 'bg-rose-500',
            gradient: 'from-rose-600/20 to-rose-950/40 border-rose-500/30',
            textPrimary: 'text-white group-hover:text-rose-400',
            textSecondary: 'text-rose-500/50 group-hover:text-rose-400/70',
            circleShadow: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]'
        };
    }
    if (profile.role === 'bartender') {
        return {
            card: 'bg-black/40 hover:bg-emerald-950/20 border-white/5 hover:border-emerald-500/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]',
            glow: 'bg-emerald-500',
            gradient: 'from-emerald-600/20 to-emerald-950/40 border-emerald-500/30',
            textPrimary: 'text-white group-hover:text-emerald-400',
            textSecondary: 'text-emerald-500/50 group-hover:text-emerald-400/70',
            circleShadow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]'
        };
    }
    if (profile.role === 'prueba') {
        return {
            card: 'bg-black/40 hover:bg-blue-950/20 border-white/5 hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]',
            glow: 'bg-blue-500',
            gradient: 'from-blue-600/20 to-blue-950/40 border-blue-500/30',
            textPrimary: 'text-white group-hover:text-blue-400',
            textSecondary: 'text-blue-500/50 group-hover:text-blue-400/70',
            circleShadow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]'
        };
    }
    return {
        card: 'bg-black/40 hover:bg-purple-950/20 border-white/5 hover:border-[#A944FF]/50 hover:shadow-[0_0_40px_rgba(169,68,255,0.15)]',
        glow: 'bg-[#A944FF]',
        gradient: 'from-purple-600/20 to-purple-950/40 border-purple-500/30',
        textPrimary: 'text-white group-hover:text-[#FF4BC1]',
        textSecondary: 'text-purple-500/50 group-hover:text-purple-400/70',
        circleShadow: 'shadow-[0_0_20px_rgba(169,68,255,0.3)]'
    };
};

export default function ProfileCard({ profile, onClick }) {
    const styles = handleProfileStyles(profile);
    
    return (
        <button
            onClick={() => onClick(profile)}
            className={`group relative flex flex-col items-center gap-6 border rounded-[2rem] p-8 transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl w-52 ${styles.card}`}
        >
            {/* Ambient Background Glow */}
            <div className={`absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.1rem] blur-2xl -z-10 ${styles.glow}/20`}></div>

            <div className="relative">
                {/* Profile Circle with Inner Glow */}
                <div className={`relative w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black text-white group-hover:scale-110 transition-transform duration-500 border-2 bg-gradient-to-br ${styles.gradient} ${styles.circleShadow}`}>
                    <span className="drop-shadow-lg">
                        {profile.nombre ? profile.nombre.charAt(0).toUpperCase() : '?'}
                    </span>
                    
                    {/* Pulsing Ring for Active State */}
                    <div className="absolute -inset-1 border border-white/10 rounded-full animate-pulse"></div>
                </div>
            </div>

            <div className="text-center relative z-10 w-full">
                <span className={`text-xl font-black block mb-2 transition-colors truncate tracking-tight ${styles.textPrimary}`}>
                    {profile.nombre}
                </span>
                <div className={`inline-block px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] uppercase tracking-[0.2em] font-black transition-colors ${styles.textSecondary}`}>
                    {profile.role === 'admin' ? 'Administrador' : profile.role === 'bartender' ? 'Bartender' : profile.role === 'prueba' ? 'Prueba' : 'Personal'}
                </div>
            </div>
            
            {/* Corner Decorative Element */}
            <div className="absolute top-4 right-4 w-1 h-1 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors"></div>
        </button>
    );
}
