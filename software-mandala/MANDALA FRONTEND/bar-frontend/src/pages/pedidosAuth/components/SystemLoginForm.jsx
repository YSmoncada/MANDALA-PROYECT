import React, { useState } from 'react';
import { Lock, User, Eye } from 'lucide-react';

export default function SystemLoginForm({ 
    username, 
    password, 
    onUsernameChange, 
    onPasswordChange, 
    onSubmit,
    rememberSession,
    onRememberSessionChange
}) {
    return (
        <div className="w-full max-w-md bg-zinc-900/40 border border-white/5 p-10 rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.9)] animate-fadeIn backdrop-blur-md">
            <form onSubmit={onSubmit} className="flex flex-col gap-8">
                <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">Usuario</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-zinc-100 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Nombre de usuario"
                                value={username}
                                onChange={(e) => onUsernameChange(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-zinc-950 border border-white/5 rounded-xl text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-500 transition-all font-light"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">Clave de Seguridad</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-zinc-100 transition-colors" size={18} />
                            <input
                                type="password"
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => onPasswordChange(e.target.value)}
                                className="w-full pl-12 pr-12 py-4 bg-zinc-950 border border-white/5 rounded-xl text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-500 transition-all font-light"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-zinc-400 cursor-pointer transition-colors p-1">
                                <Eye size={18} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center -mt-2 px-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={rememberSession}
                            onChange={(e) => onRememberSessionChange(e.target.checked)}
                            className="w-3.5 h-3.5 rounded border-white/10 bg-zinc-950 checked:bg-zinc-500 cursor-pointer" 
                        />
                        <span className="text-[10px] text-zinc-500">Recordar sesión</span>
                    </label>
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-zinc-100 hover:bg-white text-black py-4 rounded-xl font-bold transition-all shadow-xl active:scale-[0.98] text-[11px] uppercase tracking-widest"
                >
                    Acceder al Sistema
                </button>
            </form>
        </div>
    );
}
