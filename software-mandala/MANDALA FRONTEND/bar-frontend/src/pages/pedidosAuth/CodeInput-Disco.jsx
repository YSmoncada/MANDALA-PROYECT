import React, { memo, useState, useRef, useEffect } from "react";
import { Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

/**
 * Clean & Professional Password Input for profile authentication.
 * Theme-aware: Purple Disco (Lux) / Professional Dark (Nox).
 */
function CodeInputDisco({ nombre, onBack, onSubmit }) {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const { isDark } = useTheme();
    const inputRef = useRef(null);

    // Initialize remember state from localStorage
    useEffect(() => {
        const storedRemember = localStorage.getItem('rememberSession') === 'true';
        setRemember(storedRemember);
        // Focus input on mount
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleSubmit = () => {
        if (password.length > 0) {
            onSubmit(password, remember);
        }
    };

    return (
        <div className="w-full max-w-sm bg-[#1A103C]/95 dark:bg-zinc-900 backdrop-blur-3xl border border-white/20 dark:border-white/5 p-10 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] dark:shadow-none animate-scaleIn transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#A944FF] to-transparent"></div>
            
            {/* Header Navigation */}
            <div className="flex items-center justify-between mb-12">
                <button
                    onClick={onBack}
                    className="p-4 bg-white/5 hover:bg-white/10 text-[#8A7BAF] hover:text-white transition-all rounded-2xl active:scale-90 shadow-2xl group border border-white/5"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <div className="w-16 h-16 bg-[#0E0D23] dark:bg-zinc-800 rounded-[1.5rem] flex items-center justify-center border border-white/10 shadow-2xl relative">
                    <div className="absolute inset-0 bg-[#A944FF]/10 blur-xl rounded-full"></div>
                    <Lock size={28} className="text-[#A944FF] dark:text-white relative z-10" />
                </div>
                <div className="w-12"></div>
            </div>

            {/* Content */}
            <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-white dark:text-white mb-3 uppercase tracking-tighter italic">Ingresar Clave</h2>
                <p className="text-[#8A7BAF] dark:text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed">
                    Hola <span className="text-white dark:text-zinc-200 bg-[#A944FF]/20 px-2 py-0.5 rounded">{nombre}</span>, <br /> ingresa tu clave personal para continuar.
                </p>
            </div>

            {/* Input Layer */}
            <div className="relative mb-10">
                <input
                    ref={inputRef}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="••••••"
                    className="w-full bg-[#0E0D23] dark:bg-black/50 border-2 border-[#6C3FA8]/30 dark:border-white/5 text-white dark:text-white placeholder-[#8A7BAF]/20 text-center text-3xl font-black py-6 px-4 rounded-3xl focus:border-[#A944FF] dark:focus:border-white outline-none transition-all tracking-[0.6em] shadow-inner"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-8 top-1/2 -translate-y-1/2 text-[#8A7BAF] dark:text-zinc-700 hover:text-white transition-colors p-2"
                >
                    {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
            </div>

            {/* Remember Session Checkbox */}
            <div className="mb-10 flex justify-center">
                <label className="flex items-center gap-4 cursor-pointer group">
                    <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all duration-500 ${remember ? 'bg-[#A944FF] dark:bg-white border-transparent shadow-[0_10px_20px_-5px_rgba(169,68,255,0.4)]' : 'bg-[#0E0D23] border-white/10 dark:border-white/5 group-hover:border-[#A944FF]/50'}`}>
                        {remember && <div className="w-2.5 h-2.5 bg-white dark:bg-black rounded-sm animate-scaleIn" />}
                    </div>
                     <input 
                        type="checkbox" 
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="hidden"
                    />
                    <span className="text-[#8A7BAF] dark:text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] group-hover:text-white select-none transition-colors">Recordar sesión</span>
                </label>
            </div>

            {/* Action Layer */}
            <button
                onClick={handleSubmit}
                disabled={password.length === 0}
                className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] transition-all transform active:scale-95 shadow-2xl relative overflow-hidden group/btn
                    ${password.length > 0
                        ? "bg-gradient-to-r from-[#8A44FF] to-[#A944FF] dark:from-white dark:to-zinc-200 text-white dark:text-black hover:brightness-110 shadow-[0_20px_40px_-10px_rgba(169,68,255,0.4)]"
                        : "bg-[#0E0D23] dark:bg-zinc-800/50 text-[#8A7BAF]/20 dark:text-zinc-700 cursor-not-allowed border border-white/5 dark:border-transparent opacity-50"
                    }
                `}
            >
                <span className="relative z-10">Confirmar Acceso</span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
            </button>
        </div>
    );
}

export default memo(CodeInputDisco);
