import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export default function SystemLoginForm({ 
    username, 
    password, 
    onUsernameChange, 
    onPasswordChange, 
    onSubmit,
    rememberSession,
    onRememberSessionChange
}) {
    const { isDark } = useTheme();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="w-full max-w-md bg-[#1A103C]/80 dark:bg-zinc-900/40 border border-white/10 dark:border-white/5 p-10 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] animate-fadeIn backdrop-blur-md transition-all duration-500">
            <form onSubmit={onSubmit} className="flex flex-col gap-8">
                <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-[#8A7BAF] dark:text-zinc-500 font-bold ml-1 transition-colors">Usuario</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A7BAF]/50 dark:text-zinc-600 group-focus-within:text-[#A944FF] dark:group-focus-within:text-zinc-100 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Nombre de usuario"
                                value={username}
                                onChange={(e) => onUsernameChange(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-[#0E0D23] dark:bg-zinc-950 border border-[#6C3FA8]/30 dark:border-white/5 rounded-2xl text-white dark:text-zinc-200 placeholder-[#8A7BAF]/30 dark:placeholder-zinc-800 focus:outline-none focus:border-[#A944FF] dark:focus:border-zinc-500 transition-all font-medium uppercase tracking-wider text-xs"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-[#8A7BAF] dark:text-zinc-500 font-bold ml-1 transition-colors">Clave de Seguridad</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A7BAF]/50 dark:text-zinc-600 group-focus-within:text-[#A944FF] dark:group-focus-within:text-zinc-100 transition-colors" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => onPasswordChange(e.target.value)}
                                className="w-full pl-12 pr-12 py-4 bg-[#0E0D23] dark:bg-zinc-950 border border-[#6C3FA8]/30 dark:border-white/5 rounded-2xl text-white dark:text-zinc-200 placeholder-[#8A7BAF]/30 dark:placeholder-zinc-800 focus:outline-none focus:border-[#A944FF] dark:focus:border-zinc-500 transition-all font-medium tracking-[0.3em]"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A7BAF]/50 dark:text-zinc-700 hover:text-white dark:hover:text-zinc-400 cursor-pointer transition-colors p-1"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center -mt-2 px-1">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${rememberSession ? 'bg-[#A944FF] dark:bg-zinc-100 border-transparent shadow-lg' : 'bg-transparent border-white/10 group-hover:border-white/30'}`}>
                            {rememberSession && <div className="w-2.5 h-2.5 bg-white dark:bg-black rounded-sm" />}
                        </div>
                        <input 
                            type="checkbox" 
                            checked={rememberSession}
                            onChange={(e) => onRememberSessionChange(e.target.checked)}
                            className="hidden" 
                        />
                        <span className="text-[10px] text-[#8A7BAF] dark:text-zinc-500 font-bold uppercase tracking-widest group-hover:text-white transition-colors">Recordar sesión</span>
                    </label>
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-[#441E73] dark:bg-zinc-100 hover:bg-[#A944FF] dark:hover:bg-white text-white dark:text-black py-5 rounded-[1.25rem] font-black transition-all shadow-2xl active:scale-[0.98] text-[10px] uppercase tracking-[0.3em]"
                >
                    Acceder al Sistema
                </button>
            </form>
        </div>
    );
}
