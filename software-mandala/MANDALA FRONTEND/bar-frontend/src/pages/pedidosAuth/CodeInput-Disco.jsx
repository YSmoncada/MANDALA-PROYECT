import React, { memo, useState, useRef, useEffect } from "react";
import { Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";

/**
 * Clean & Professional Password Input for profile authentication.
 */
function CodeInputDisco({ nombre, onBack, onSubmit }) {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleSubmit = () => {
        if (password.length > 0) {
            onSubmit(password);
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
            <div className="relative mb-8">
                <input
                    ref={inputRef}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="Escribe aquí..."
                    className="w-full bg-zinc-800 border-2 border-zinc-700 text-white placeholder-zinc-600 text-center text-xl font-bold py-4 px-4 rounded-xl focus:border-purple-600 outline-none transition-all tracking-widest"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            {/* Action Layer */}
            <button
                onClick={handleSubmit}
                disabled={password.length === 0}
                className={`w-full py-4 rounded-xl font-bold transition-all transform active:scale-95
                    ${password.length > 0
                        ? "bg-purple-600 hover:bg-purple-500 text-white shadow-lg"
                        : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                    }
                `}
            >
                Confirmar Acceso
            </button>

            {/* Footer Status */}
            <p className="mt-8 text-center text-[10px] text-zinc-700 uppercase tracking-widest font-black">
                Terminal ID: MD-LOGIN-SECURE
            </p>
        </div>
    );
}

export default memo(CodeInputDisco);
