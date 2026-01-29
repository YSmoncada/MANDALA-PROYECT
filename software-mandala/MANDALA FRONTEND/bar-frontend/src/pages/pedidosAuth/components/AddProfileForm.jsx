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
        <div className="bg-zinc-950 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center animate-fadeIn relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/5">
                <Sparkles size={24} className="text-white" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">Nuevo Perfil</h2>
            <p className="text-zinc-500 text-sm mb-8">Crea un perfil para acceder al sistema</p>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="group relative">
                    <User className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Nombre completo"
                        value={name}
                        onChange={(e) => onNameChange(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-black border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:bg-zinc-900 focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all font-medium"
                    />
                </div>
                <div className="group relative">
                    <Lock className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
                    <input
                        type="password"
                        placeholder="Contraseña de acceso"
                        value={code}
                        onChange={(e) => onCodeChange(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-black border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:bg-zinc-900 focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all tracking-widest font-bold"
                    />
                </div>
                <div className="flex gap-3 mt-6">
                    <button 
                        type="button" 
                        onClick={onBack} 
                        className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white py-3 rounded-xl font-bold transition-all text-xs uppercase tracking-widest border border-white/5"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="flex-1 bg-white hover:bg-zinc-200 text-black py-3 rounded-xl font-bold shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 text-xs uppercase tracking-widest border border-white"
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
}
