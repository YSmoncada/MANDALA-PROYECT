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
        <div className="bg-[#441E73]/80 backdrop-blur-xl border border-[#6C3FA8] p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.3)] w-full max-w-md text-center animate-fadeIn relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A944FF] to-transparent"></div>

            <div className="w-16 h-16 bg-gradient-to-br from-[#A944FF] to-[#FF4BC1] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#A944FF]/20">
                <Sparkles size={24} className="text-white" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Nuevo Perfil</h2>
            <p className="text-[#C2B6D9] text-sm mb-8">Crea un perfil para acceder al sistema</p>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="group relative">
                    <User className="absolute left-4 top-3.5 text-[#8A7BAF] group-focus-within:text-[#A944FF] transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Nombre completo"
                        value={name}
                        onChange={(e) => onNameChange(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#2B0D49] border border-[#6C3FA8]/30 text-white placeholder-[#8A7BAF] focus:outline-none focus:bg-[#2B0D49]/80 focus:border-[#A944FF] focus:ring-1 focus:ring-[#A944FF] transition-all"
                    />
                </div>
                <div className="group relative">
                    <Lock className="absolute left-4 top-3.5 text-[#8A7BAF] group-focus-within:text-[#A944FF] transition-colors" size={18} />
                    <input
                        type="password"
                        inputMode="numeric"
                        placeholder="Código de 4 dígitos"
                        value={code}
                        onChange={(e) => /^\d{0,4}$/.test(e.target.value) && onCodeChange(e.target.value)}
                        maxLength={4}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#2B0D49] border border-[#6C3FA8]/30 text-white placeholder-[#8A7BAF] focus:outline-none focus:bg-[#2B0D49]/80 focus:border-[#A944FF] focus:ring-1 focus:ring-[#A944FF] transition-all tracking-widest"
                    />
                </div>
                <div className="flex gap-3 mt-6">
                    <button 
                        type="button" 
                        onClick={onBack} 
                        className="flex-1 bg-white/5 hover:bg-white/10 text-[#C2B6D9] py-3 rounded-xl font-bold transition-all text-sm tracking-wide border border-white/5"
                    >
                        CANCELAR
                    </button>
                    <button 
                        type="submit" 
                        className="flex-1 bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] hover:brightness-110 text-white py-3 rounded-xl font-bold shadow-lg shadow-[#A944FF]/30 transition-all transform hover:scale-[1.02] text-sm tracking-wide"
                    >
                        GUARDAR
                    </button>
                </div>
            </form>
        </div>
    );
}
