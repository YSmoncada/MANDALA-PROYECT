import React, { memo, useState, useRef, useEffect } from "react";
import { Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";

/**
 * Clean & Professional Password Input for profile authentication.
 */
function CodeInputDisco({ nombre, onBack, onSubmit }) {
    const [remember, setRemember] = useState(false);

    // Initialize remember state from localStorage
    useEffect(() => {
        const storedRemember = localStorage.getItem('rememberSession') === 'true';
        setRemember(storedRemember);
    }, []);

    const handleSubmit = () => {
        if (password.length > 0) {
            onSubmit(password, remember);
        }
    };

    return (
        <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl animate-fadeIn">
            {/* Header Navigation */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center border border-zinc-700">
                    <Lock size={18} className="text-zinc-400" />
                </div>
                <div className="w-6"></div>
            </div>

            {/* Content */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Ingresar Clave</h2>
                <p className="text-zinc-500 text-sm">
                    Hola <span className="text-white font-semibold">{nombre}</span>, ingresa tu clave personal.
                </p>
            </div>

            {/* Input Layer */}
            <div className="relative mb-6">
                <input
                    ref={inputRef}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="Escribe aquí..."
                    className="w-full bg-zinc-800 border-2 border-zinc-700 text-white placeholder-zinc-600 text-center text-xl font-bold py-4 px-4 rounded-xl focus:border-white outline-none transition-all tracking-widest"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            {/* Remember Session Checkbox */}
            <div className="mb-6 flex justify-center">
                <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border border-zinc-600 flex items-center justify-center transition-all ${remember ? 'bg-white border-white' : 'bg-transparent group-hover:border-zinc-400'}`}>
                        {remember && <div className="w-2.5 h-2.5 bg-black rounded-[1px]" />}
                    </div>
                     <input 
                        type="checkbox" 
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="hidden"
                    />
                    <span className="text-zinc-400 text-xs font-medium group-hover:text-zinc-300 select-none">Recordar sesión en este dispositivo</span>
                </label>
            </div>

            {/* Action Layer */}
            <button
                onClick={handleSubmit}
                disabled={password.length === 0}
                className={`w-full py-4 rounded-xl font-bold transition-all transform active:scale-95
                    ${password.length > 0
                        ? "bg-white hover:bg-zinc-200 text-black shadow-lg shadow-white/10"
                        : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                    }
                `}
            >
                Confirmar Acceso
            </button>
        </div>
    );
}

export default memo(CodeInputDisco);
