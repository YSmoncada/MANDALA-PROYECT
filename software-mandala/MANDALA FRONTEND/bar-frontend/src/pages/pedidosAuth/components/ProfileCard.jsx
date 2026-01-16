import React from 'react';

const handleProfileStyles = (profile) => {
    if (profile.role === 'admin') {
        return {
            card: 'bg-rose-900/20 hover:bg-rose-900/40 border-rose-500/50 hover:border-rose-400 hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]',
            glow: 'bg-rose-500',
            gradient: 'from-rose-900 to-rose-700 border-rose-500',
            textPrimary: 'text-rose-100 group-hover:text-rose-300',
            textSecondary: 'text-rose-500/70 group-hover:text-rose-400'
        };
    }
    if (profile.role === 'bartender') {
        return {
            card: 'bg-emerald-900/20 hover:bg-emerald-900/40 border-emerald-500/50 hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]',
            glow: 'bg-emerald-500',
            gradient: 'from-emerald-900 to-emerald-700 border-emerald-500',
            textPrimary: 'text-emerald-100 group-hover:text-emerald-300',
            textSecondary: 'text-emerald-500/70 group-hover:text-emerald-400'
        };
    }
    if (profile.role === 'prueba') {
        return {
            card: 'bg-blue-900/20 hover:bg-blue-900/40 border-blue-500/50 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]',
            glow: 'bg-blue-500',
            gradient: 'from-blue-900 to-blue-700 border-blue-500',
            textPrimary: 'text-blue-100 group-hover:text-blue-300',
            textSecondary: 'text-blue-500/70 group-hover:text-blue-400'
        };
    }
    return {
        card: 'bg-[#6C3FA8]/20 hover:bg-[#6C3FA8]/40 border-[#6C3FA8] hover:border-[#A944FF] hover:shadow-[0_0_30px_rgba(169,68,255,0.2)]',
        glow: 'bg-[#A944FF]',
        gradient: 'from-[#441E73] to-[#6C3FA8] border-[#6C3FA8]',
        textPrimary: 'text-white group-hover:text-[#FF4BC1]',
        textSecondary: 'text-[#8A7BAF] group-hover:text-[#C2B6D9]'
    };
};

export default function ProfileCard({ profile, onClick }) {
    const styles = handleProfileStyles(profile);
    
    return (
        <button
            onClick={() => onClick(profile)}
            className={`group relative flex flex-col items-center gap-4 border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm w-48 ${styles.card}`}
        >
            <div className="relative">
                <div className={`absolute inset-0 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-full ${styles.glow}`}></div>
                <div className={`relative w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-inner group-hover:scale-110 transition-transform duration-300 border bg-gradient-to-br ${styles.gradient}`}>
                    {profile.nombre ? profile.nombre.charAt(0).toUpperCase() : '?'}
                </div>
            </div>

            <div className="text-center">
                <span className={`text-lg font-bold block mb-1 transition-colors truncate max-w-[120px] ${styles.textPrimary}`}>
                    {profile.nombre}
                </span>
                <span className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${styles.textSecondary}`}>
                    {profile.role === 'admin' ? 'Administrador' : profile.role === 'bartender' ? 'Bartender' : profile.role === 'prueba' ? 'Prueba' : 'Personal'}
                </span>
            </div>
        </button>
    );
}
