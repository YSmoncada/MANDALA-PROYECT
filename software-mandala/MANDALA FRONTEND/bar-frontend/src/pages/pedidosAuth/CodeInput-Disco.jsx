import React, { memo } from "react";
import { Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { usePinInput } from "../../hooks/usePinInput";

const PIN_LENGTH = 4;

/**
 * Premium PIN Input component for profile authentication.
 * Refactored to use usePinInput hook for better organization and scalability.
 */
function CodeInputDisco({ nombre, onBack, onSubmit }) {
    const {
        values,
        inputRefs,
        handleChange,
        handleKeyDown,
        handlePaste,
        isComplete,
        fullPin
    } = usePinInput(PIN_LENGTH, onSubmit);

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
                    Hola <span className="text-[#FF4BC1] font-bold">{nombre}</span>, por favor ingresa tu clave personal para continuar.
                </p>
            </div>

            {/* OTP Grid */}
            <div className="flex justify-center gap-3 sm:gap-4 mb-10">
                {values.map((digit, index) => (
                    <input
                        key={index}
                        ref={el => inputRefs.current[index] = el}
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        autoComplete="one-time-code"
                        className={`w-14 h-20 sm:w-16 sm:h-24 text-center text-4xl font-black rounded-2xl border-2 transition-all duration-500 outline-none
                            ${digit
                                ? "bg-gradient-to-b from-[#A944FF] to-[#6C3FA8] text-white border-[#FF4BC1] shadow-[0_0_25px_rgba(169,68,255,0.4)] scale-105"
                                : "bg-[#2B0D49]/60 border-[#6C3FA8]/40 text-white placeholder-[#8A7BAF] focus:border-[#A944FF] focus:bg-[#2B0D49]/80 focus:shadow-[0_0_15px_rgba(169,68,255,0.2)]"
                            }
                        `}
                    />
                ))}
            </div>

            {/* Footer Action */}
            <button
                onClick={() => onSubmit(fullPin)}
                disabled={!isComplete}
                className={`w-full py-5 rounded-2xl font-black tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 text-xs uppercase
                    ${isComplete
                        ? "bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] hover:brightness-110 text-white shadow-xl shadow-[#A944FF]/30 translate-y-0 active:scale-95"
                        : "bg-[#2B0D49] text-[#8A7BAF] cursor-not-allowed border border-[#6C3FA8]/20 opacity-50"
                    }
                `}
            >
                {isComplete ? (
                    <>
                        <CheckCircle2 size={18} />
                        Verificar Código
                    </>
                ) : (
                    `Ingresa ${PIN_LENGTH} dígitos`
                )}
            </button>

            {/* Help Text */}
            <p className="mt-8 text-[10px] text-[#8A7BAF] uppercase tracking-[0.3em] font-bold opacity-60">
                Mandala Security System v2.0
            </p>
        </div>
    );
}

export default memo(CodeInputDisco);
