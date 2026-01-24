import React, { memo, useState, useRef, useEffect } from "react";
import { Lock, ArrowLeft, ShieldCheck, Eye, EyeOff, Terminal } from "lucide-react";

/**
 * Premium Stealth Password Input for profile authentication.
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
        <div className="bg-black/40 backdrop-blur-3xl border border-white/5 p-12 rounded-[3rem] shadow-[0_0_120px_rgba(0,0,0,0.9)] w-full max-w-md text-center animate-fadeIn relative overflow-hidden group">
            {/* Security Scan Line Effect */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF4BC1]/50 to-transparent animate-shimmer scale-y-150"></div>
            
            {/* Background Decorative Element */}
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-rose-600/5 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Top Header Section */}
            <div className="flex items-center justify-between mb-12">
                <button
                    onClick={onBack}
                    className="p-4 bg-zinc-900/50 hover:bg-white/5 text-zinc-500 hover:text-white rounded-2xl transition-all duration-300 group/back flex items-center justify-center border border-white/5"
                    title="Abort Access"
                >
                    <ArrowLeft size={20} className="group-hover/back:-translate-x-1 transition-transform" />
                </button>
                
                <div className="w-16 h-16 bg-gradient-to-tr from-zinc-900 to-black rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
                    <Terminal size={24} className="text-white animate-pulse" />
                </div>
                
                <div className="w-12"></div> {/* Spacer for balance */}
            </div>

            {/* Title Section */}
            <div className="mb-12">
                <h2 className="text-4xl font-black text-white mb-3 tracking-tighter uppercase">
                    Verify <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-200">Identity</span>
                </h2>
                <div className="flex items-center justify-center gap-2">
                    <ShieldCheck size={14} className="text-zinc-600" />
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">
                        Operator: <span className="text-white">{nombre}</span>
                    </p>
                </div>
            </div>

            {/* Input Field Layer */}
            <div className="relative mb-10 group/input">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700 pointer-events-none transition-colors group-focus-within/input:text-rose-500">
                    <Lock size={18} />
                </div>
                
                <input
                    ref={inputRef}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="Enter PIN / Key"
                    className="w-full bg-zinc-900/30 border-b-2 border-white/5 text-white placeholder-zinc-800 text-center text-2xl font-black py-7 pl-14 pr-14 rounded-3xl focus:border-rose-500 focus:bg-black/60 outline-none transition-all duration-500 tracking-[0.3em]"
                />
                
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-white transition-colors"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            {/* Action Layer */}
            <button
                onClick={handleSubmit}
                disabled={password.length === 0}
                className={`w-full py-6 rounded-2xl font-black tracking-[0.4em] transition-all duration-500 flex items-center justify-center gap-3 text-[10px] uppercase
                    ${password.length > 0
                        ? "bg-white text-black hover:bg-zinc-200 shadow-[0_20px_40px_rgba(255,255,255,0.1)] translate-y-0 active:scale-95 cursor-pointer"
                        : "bg-zinc-900/50 text-zinc-700 cursor-not-allowed border border-white/5"
                    }
                `}
            >
                {password.length > 0 ? (
                    <>
                        Authorize Access
                    </>
                ) : (
                    "Waiting for Input..."
                )}
            </button>

            {/* Status Footer */}
            <div className="mt-12 pt-6 border-t border-white/5 flex items-center justify-between text-[7px] font-black text-zinc-800 uppercase tracking-[0.4em]">
                <span>Status: Encrypted</span>
                <span>Node: MD-01</span>
            </div>
        </div>
    );
}

export default memo(CodeInputDisco);
