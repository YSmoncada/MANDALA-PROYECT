import React from 'react';
import { Lock, Mail, Eye } from 'lucide-react';

export default function SystemLoginForm({ 
    username, 
    password, 
    onUsernameChange, 
    onPasswordChange, 
    onSubmit, 
}) {
    return (
        <div className="w-full max-w-md bg-zinc-950/50 border border-zinc-900 p-8 rounded-xl shadow-2xl animate-fadeIn backdrop-blur-sm">
            <form onSubmit={onSubmit} className="flex flex-col gap-6">
                <div className="space-y-4">
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="usuario@correo.com"
                            value={username}
                            onChange={(e) => onUsernameChange(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-black/40 border border-zinc-800 rounded-lg text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-zinc-700 transition-all font-light"
                        />
                    </div>
                    
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input
                            type="password"
                            placeholder="••••••••••"
                            value={password}
                            onChange={(e) => onPasswordChange(e.target.value)}
                            className="w-full pl-12 pr-12 py-3.5 bg-black/40 border border-zinc-800 rounded-lg text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-zinc-700 transition-all font-light"
                        />
                        <Eye className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 cursor-pointer" size={18} />
                    </div>
                </div>

                <div className="flex justify-end -mt-2">
                    <button type="button" className="text-[11px] text-emerald-500/60 hover:text-emerald-500 transition-colors">
                        ¿Olvidaste tu contraseña?
                    </button>
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-emerald-950/80 hover:from-emerald-900 hover:to-emerald-900 text-zinc-300 py-3.5 rounded-lg font-medium transition-all shadow-lg border border-emerald-500/10 active:scale-[0.98]"
                >
                    Iniciar Sesión
                </button>

                <div className="text-center">
                    <p className="text-xs text-zinc-600">
                        ¿No tienes cuenta? <span className="text-emerald-500/80 hover:text-emerald-500 cursor-pointer font-medium transition-colors">Registrate</span>
                    </p>
                </div>
            </form>
        </div>
    );
}
