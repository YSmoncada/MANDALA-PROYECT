import React from 'react';
import { User, Lock, ChevronRight, Activity } from 'lucide-react';

export default function SystemLoginForm({ 
    username, 
    password, 
    onUsernameChange, 
    onPasswordChange, 
    onSubmit, 
    onBack 
}) {
    return (
        <div className="bg-black/60 backdrop-blur-2xl border border-white/5 p-10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] w-full max-w-md text-center animate-fadeIn relative overflow-hidden group">
            {/* Ambient Top Glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] pointer-events-none"></div>
            
            {/* Animated Loading Bar */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-white/5">
                <div className="h-full bg-gradient-to-r from-transparent via-[#A944FF] to-transparent w-1/2 animate-shimmer"></div>
            </div>

            <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-tr from-black via-zinc-900 to-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/10 group-hover:rotate-6 transition-transform duration-500">
                    <Activity size={32} className="text-[#A944FF] animate-pulse" />
                </div>
                
                <h2 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase">
                    Core <span className="text-[#A944FF]">Access</span>
                </h2>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mb-10">Terminal Auth v4.0</p>

                <form onSubmit={onSubmit} className="flex flex-col gap-5">
                    <div className="relative group/input">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within/input:text-[#A944FF] transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="OPERATOR ID"
                            value={username}
                            onChange={(e) => onUsernameChange(e.target.value)}
                            className="w-full pl-14 pr-6 py-5 rounded-2xl bg-zinc-900/50 border border-white/5 text-white placeholder-zinc-700 focus:outline-none focus:bg-black focus:border-[#A944FF]/50 focus:ring-1 focus:ring-[#A944FF]/20 transition-all font-black text-xs tracking-widest uppercase"
                        />
                    </div>
                    
                    <div className="relative group/input">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within/input:text-[#FF4BC1] transition-colors" size={18} />
                        <input
                            type="password"
                            placeholder="SECURITY PIN"
                            value={password}
                            onChange={(e) => onPasswordChange(e.target.value)}
                            className="w-full pl-14 pr-6 py-5 rounded-2xl bg-zinc-900/50 border border-white/5 text-white placeholder-zinc-700 focus:outline-none focus:bg-black focus:border-[#FF4BC1]/50 focus:ring-1 focus:ring-[#FF4BC1]/20 transition-all font-black text-xs tracking-widest"
                        />
                    </div>

                    <div className="flex flex-col gap-3 mt-8">
                        <button 
                            type="submit" 
                            className="w-full bg-white text-black py-5 rounded-2xl font-black shadow-xl hover:bg-zinc-200 transition-all transform hover:scale-[1.02] active:scale-95 text-xs tracking-[0.3em] flex items-center justify-center gap-2 group/btn"
                        >
                            INITIALIZE SYSTEM
                            <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={onBack} 
                            className="w-full bg-transparent hover:bg-white/5 text-zinc-500 hover:text-white py-4 rounded-xl font-black transition-all text-[9px] tracking-[0.4em] uppercase"
                        >
                            Cancel Request
                        </button>
                    </div>
                </form>
            </div>
            
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
    );
}
