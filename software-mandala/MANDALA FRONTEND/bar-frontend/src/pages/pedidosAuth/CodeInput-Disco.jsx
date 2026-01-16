import { useState, useEffect, useRef } from "react";
import { Lock, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function CodeInputDisco({ nombre, onBack, onSubmit }) {
    const [codigo, setCodigo] = useState(["", "", "", ""]);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newCodigo = [...codigo];
        newCodigo[index] = value.slice(-1); // Only take the last digit
        setCodigo(newCodigo);

        // Move to next input
        if (value && index < 3) {
            inputRefs.current[index + 1].focus();
        }

        // Auto submit if complete
        if (index === 3 && value) {
            const fullCode = newCodigo.join("");
            if (fullCode.length === 4) {
                // Small delay for visual feedback
                setTimeout(() => onSubmit(newCodigo.join("")), 300);
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !codigo[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 4);
        if (/^\d+$/.test(pastedData)) {
            const digits = pastedData.split("");
            const newCodigo = [...codigo];
            digits.forEach((digit, i) => {
                if (i < 4) newCodigo[i] = digit;
            });
            setCodigo(newCodigo);
            if (digits.length === 4) {
                setTimeout(() => onSubmit(pastedData), 300);
            } else if (digits.length < 4) {
                inputRefs.current[digits.length].focus();
            }
        }
    };

    const isComplete = codigo.every(digit => digit !== "");

    return (
        <div className="bg-[#441E73]/80 backdrop-blur-xl border border-[#6C3FA8] p-10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.3)] w-full max-w-md text-center animate-fadeIn relative overflow-hidden">
            {/* Glow Effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A944FF] to-transparent"></div>

            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 text-[#8A7BAF] hover:text-white hover:bg-white/5 rounded-full transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="w-12 h-12 bg-[#A944FF]/10 rounded-2xl flex items-center justify-center border border-[#A944FF]/30">
                    <Lock size={20} className="text-[#A944FF]" />
                </div>
                <div className="w-8"></div> {/* Spacer for alignment */}
            </div>

            {/* Content */}
            <div className="mb-10">
                <h2 className="text-3xl font-bold text-white mb-2">CÓDIGO DE ACCESO</h2>
                <p className="text-[#C2B6D9]">
                    Hola <span className="font-bold text-white">{nombre}</span>, ingresa tu clave
                </p>
            </div>

            {/* Inputs */}
            <div className="flex justify-center gap-4 mb-10">
                {codigo.map((digit, index) => (
                    <input
                        key={index}
                        ref={el => inputRefs.current[index] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        // Input Color: bg-[#2B0D49]
                        className={`w-16 h-20 text-center text-3xl font-bold rounded-2xl border transition-all duration-300 outline-none
                            ${digit
                                ? "bg-[#A944FF] text-white border-[#FF4BC1] shadow-[0_0_20px_rgba(169,68,255,0.4)] transform scale-105"
                                : "bg-[#2B0D49] border-[#6C3FA8]/50 text-white focus:border-[#A944FF] focus:bg-[#2B0D49]/80"
                            }
                        `}
                    />
                ))}
            </div>

            {/* Status/Button */}
            <button
                onClick={() => onSubmit(codigo.join(""))}
                disabled={!isComplete}
                className={`w-full py-4 rounded-xl font-bold tracking-widest transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase
                    ${isComplete
                        ? "bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] hover:brightness-110 text-white shadow-lg shadow-[#A944FF]/30 transform hover:scale-[1.02]"
                        : "bg-[#2B0D49] text-[#8A7BAF] cursor-not-allowed border border-[#6C3FA8]/30"
                    }
                `}
            >
                {isComplete ? (
                    <>
                        <CheckCircle2 size={18} />
                        Confirmar Acceso
                    </>
                ) : (
                    "Ingresa 4 dígitos"
                )}
            </button>
        </div>
    );
}
