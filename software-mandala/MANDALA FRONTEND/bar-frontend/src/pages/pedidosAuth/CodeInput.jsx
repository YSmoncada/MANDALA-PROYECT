    import { useState } from "react";

    export default function CodeInput({ mesera, onBack, onSubmit }) {
    const [codigo, setCodigo] = useState("");

    const handleChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,4}$/.test(value)) {
        setCodigo(value);
        }
    };

    const handleSubmit = () => {
        if (codigo.length === 4) {
        onSubmit(codigo);
        } else {
        alert("El código debe tener 4 dígitos");
        }
    };

    return (
        <div className="bg-[#441E73]/90 border border-[#6C3FA8] p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        {/* Botón volver */}
        <button
            onClick={onBack}
            className="flex items-center text-sm text-[#C2B6D9] mb-4 hover:text-white"
        >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver
        </button>

        {/* Icono */}
        <div className="bg-gradient-to-r from-[#FF4BC1] to-[#A944FF] p-4 rounded-full mx-auto mb-4 w-14 h-14 flex items-center justify-center shadow-md">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 11c0-1.657-1.343-3-3-3S6 9.343 6 11c0 2.239 6 7 6 7s6-4.761 6-7c0-1.657-1.343-3-3-3s-3 1.343-3 3z"
            />
            </svg>
        </div>

        {/* Texto */}
        <h2 className="text-white text-2xl font-bold mb-1">Hola, {mesera}</h2>
        <p className="text-[#C2B6D9] text-sm mb-6">Ingresa tu código de seguridad</p>

        {/* Input del código */}
        <input
            type="password"
            value={codigo}
            onChange={handleChange}
            maxLength={4}
            placeholder="Código de 4 dígitos"
            className="w-full text-center text-lg tracking-normal py-3 rounded-lg bg-[#2B0D49] text-white placeholder-[#8A7BAF] focus:outline-none focus:ring-2 focus:ring-[#A944FF]"
        />

        {/* Botón ingresar */}
        <button
            onClick={handleSubmit}
            disabled={codigo.length < 4}
            className={`mt-6 w-full py-2 px-4 rounded-lg font-semibold transition ${
            codigo.length < 4
                ? "bg-[#6C3FA8]/50 text-[#C2B6D9] cursor-not-allowed"
                : "bg-[#6C3FA8] hover:bg-[#7B49BF] text-white"
            }`}
        >
            Ingresar
        </button>
        </div>
    );
    }
