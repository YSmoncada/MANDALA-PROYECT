import React from 'react';
import { User, Lock, Sparkles } from 'lucide-react';

export default function AddProfileForm({ 
    name, 
    code, 
    onNameChange, 
    onCodeChange, 
    onSubmit, 
    onBack 
}) {
    return (
        <div className="bg-[#1A103C]/95 dark:bg-zinc-900 backdrop-blur-2xl border border-white/20 dark:border-white/5 p-10 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] dark:shadow-none w-full max-w-md text-center animate-scaleIn relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#A944FF] to-transparent"></div>

            <div className="w-20 h-20 bg-[#0E0D23] dark:bg-zinc-800 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/10 group-hover:scale-110 transition-transform">
                <Sparkles size={32} className="text-[#A944FF] dark:text-white" />
            </div>

            <h2 className="text-3xl font-black text-white dark:text-white mb-3 uppercase tracking-tighter italic">Nuevo Perfil</h2>
            <p className="text-[#8A7BAF] dark:text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-10">Crea un perfil para acceder al sistema</p>

            <form onSubmit={onSubmit} className="flex flex-col gap-5">
                <div className="group relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8A7BAF] dark:text-zinc-600 group-focus-within:text-[#A944FF] dark:group-focus-within:text-white transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Nombre completo"
                        autoComplete="new-password"
                        value={name}
                        onChange={(e) => onNameChange(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-[#0E0D23] dark:bg-black/50 border-2 border-[#6C3FA8]/30 dark:border-white/5 text-white placeholder-[#8A7BAF]/30 dark:placeholder-zinc-800 focus:outline-none focus:border-[#A944FF] dark:focus:border-white transition-all font-black uppercase tracking-widest text-xs"
                    />
                </div>
                <div className="group relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8A7BAF] dark:text-zinc-600 group-focus-within:text-[#A944FF] dark:group-focus-within:text-white transition-colors" size={20} />
                    <input
                        type="password"
                        placeholder="Contraseña de acceso"
                        autoComplete="new-password"
                        value={code}
                        onChange={(e) => onCodeChange(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-[#0E0D23] dark:bg-black/50 border-2 border-[#6C3FA8]/30 dark:border-white/5 text-white placeholder-[#8A7BAF]/30 dark:placeholder-zinc-800 focus:outline-none focus:border-[#A944FF] dark:focus:border-white transition-all font-black uppercase tracking-[0.4em] text-xs"
                    />
                </div>
                <div className="flex gap-4 mt-8">
                    <button 
                        type="button" 
                        onClick={onBack} 
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white py-4 rounded-2xl font-black transition-all text-[10px] uppercase tracking-[0.2em] border border-white/5"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="flex-1 bg-[#441E73] dark:bg-white hover:bg-[#A944FF] dark:hover:bg-zinc-200 text-white dark:text-black py-4 rounded-2xl font-black shadow-2xl transition-all transform active:scale-95 text-[10px] uppercase tracking-[0.2em] border border-white/20 dark:border-transparent"
                    >
                        Guardar Perfil
                    </button>
                </div>
            </form>
        </div>
    );
}
