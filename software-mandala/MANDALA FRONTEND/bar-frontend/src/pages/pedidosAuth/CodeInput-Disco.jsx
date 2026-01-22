import React, { memo, useState, useRef, useEffect } from "react";
import { Lock, ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react";

/**
 * Premium Password Input component for profile authentication.
 * Now supports standard complex alphanumeric passwords.
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
        <div className="bg-[#441E73]/80 backdrop-blur-xl border border-[#6C3FA8] p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.4)] w-full max-w-md text-center animate-fadeIn relative overflow-hidden">
            {/* Design Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A944FF] to-transparent"></div>
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#A944FF]/10 rounded-full blur-3xl"></div>

            {/* Top Navigation */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={onBack}
                    className="p-3 -ml-3 text-[#8A7BAF] hover:text-white hover:bg-white/5 rounded-2xl transition-all duration-300 group"
                    title="Volver"
                >
                    <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <div className="w-14 h-14 bg-gradient-to-br from-[#A944FF]/20 to-[#FF4BC1]/20 rounded-2xl flex items-center justify-center border border-[#A944FF]/30 shadow-lg shadow-[#A944FF]/10">
                    <Lock size={24} className="text-[#A944FF]" />
                </div>
                <div className="w-10"></div> 
            </div>

            {/* Header Text */}
            <div className="mb-10">
                <h2 className="text-3xl font-black text-white mb-3 tracking-tight uppercase">
                    Acceso Seguro
                </h2>
                <p className="text-[#C2B6D9] text-sm font-medium tracking-wide">
                    Hola <span className="text-[#FF4BC1] font-bold">{nombre}</span>, ingresa tu contraseña.
                </p>
            </div>

            {/* Password Input */}
            <div className="relative mb-10 group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A944FF] pointer-events-none transition-colors group-focus-within:text-[#FF4BC1]">
                    <Lock size={20} />
                </div>
                <input
                    ref={inputRef}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="Contraseña..."
                    className="w-full bg-[#2B0D49]/60 border-2 border-[#6C3FA8]/40 text-white placeholder-[#8A7BAF] text-center text-xl font-bold py-6 pl-12 pr-12 rounded-2xl focus:border-[#A944FF] focus:bg-[#2B0D49]/80 focus:shadow-[0_0_20px_rgba(169,68,255,0.2)] outline-none transition-all duration-300 tracking-widest"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-[#8A7BAF] hover:text-white transition-colors"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            {/* Footer Action */}
            <button
                onClick={handleSubmit}
                disabled={password.length === 0}
                className={`w-full py-5 rounded-2xl font-black tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 text-xs uppercase
                    ${password.length > 0
                        ? "bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] hover:brightness-110 text-white shadow-xl shadow-[#A944FF]/30 translate-y-0 active:scale-95 cursor-pointer"
                        : "bg-[#2B0D49] text-[#8A7BAF] cursor-not-allowed border border-[#6C3FA8]/20 opacity-50"
                    }
                `}
            >
                {password.length > 0 ? (
                    <>
                        <CheckCircle2 size={18} />
                        Ingresar
                    </>
                ) : (
                    "Ingresa tu contraseña"
                )}
            </button>

            {/* Help Text */}
            <p className="mt-8 text-[10px] text-[#8A7BAF] uppercase tracking-[0.3em] font-bold opacity-60">
                Sistema Protegido v2.1
            </p>
        </div>
    );
}

export default memo(CodeInputDisco);
