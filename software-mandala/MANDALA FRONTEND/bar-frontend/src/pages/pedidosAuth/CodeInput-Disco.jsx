import React, { memo, useState, useRef, useEffect } from "react";
import { Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";

/**
 * Clean & Professional Password Input for profile authentication.
 */
function CodeInputDisco({ nombre, onBack, onSubmit }) {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
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
        <div className="w-full max-w-sm bg-zinc-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl animate-fadeIn transition-all duration-300">
            {/* Header Navigation */}
            <div className="flex items-center justify-between mb-10">
                <button
                    onClick={onBack}
                    className="p-3 -ml-3 text-zinc-500 hover:text-white transition-all hover:bg-white/5 rounded-xl active:scale-95"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="w-12 h-12 bg-white/5 rounded-[1.25rem] flex items-center justify-center border border-white/10 shadow-inner">
                    <Lock size={20} className="text-white" />
                </div>
                <div className="w-8"></div>
            </div>

            {/* Content */}
            <div className="text-center mb-10">
                <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Ingresar Clave</h2>
                <p className="text-zinc-400 text-xs font-medium">
                    Hola <span className="text-white font-black uppercase tracking-wider">{nombre}</span>, <br /> ingresa tu clave personal para continuar.
                </p>
            </div>

            {/* Input Layer */}
            <div className="relative mb-8">
                <input
                    ref={inputRef}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="••••••"
                    className="w-full bg-black/40 border-2 border-white/5 text-white placeholder-zinc-700 text-center text-2xl font-black py-5 px-6 rounded-2xl focus:border-white outline-none transition-all tracking-[0.5em]"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-2"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            {/* Remember Session Checkbox */}
            <div className="mb-8 flex justify-center">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${remember ? 'bg-white border-transparent shadow-lg' : 'bg-transparent border-white/10 group-hover:border-white/30'}`}>
                        {remember && <div className="w-2.5 h-2.5 bg-black rounded-sm" />}
                    </div>
                     <input 
                        type="checkbox" 
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="hidden"
                    />
                    <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest group-hover:text-white select-none transition-colors">Recordar sesión</span>
                </label>
            </div>

            {/* Action Layer */}
            <button
                onClick={handleSubmit}
                disabled={password.length === 0}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all transform active:scale-95 shadow-xl
                    ${password.length > 0
                        ? "bg-white text-black hover:bg-zinc-100"
                        : "bg-zinc-800/50 text-zinc-600 cursor-not-allowed border border-transparent shadow-none"
                    }
                `}
            >
                Confirmar Acceso
            </button>
        </div>
    );
}

export default memo(CodeInputDisco);
