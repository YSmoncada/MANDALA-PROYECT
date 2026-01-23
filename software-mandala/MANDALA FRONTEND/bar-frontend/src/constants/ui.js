/**
 * Definitive Design System for Mandala Disco
 * Premium, Modern, Dark Aesthetic.
 */

export const THEME = {
    colors: {
        bg: "#0A0910",          // Ultra dark background
        card: "#120F25",        // Deep purple card
        primary: "#A944FF",     // Electric Purple (Brand)
        secondary: "#FF4BC1",   // Cyber Pink
        emerald: "#10B981",     // Deep Emerald (Success)
        rose: "#E11D48",        // Deep Rose (Danger)
        text: "#F1F5F9",        // Slate 100
        muted: "#94A3B8",       // Slate 400
    },
    shadows: {
        glow: "0 0 20px rgba(169, 68, 255, 0.4)",
        glowSuccess: "0 0 20px rgba(16, 185, 129, 0.3)",
        glowDanger: "0 0 20px rgba(225, 29, 72, 0.3)",
    }
};

export const UI_CLASSES = {
    // Layouts
    pageContainer: "min-h-screen bg-[#0A0910] text-slate-100 p-4 md:p-8 relative selection:bg-purple-500/30 overflow-x-hidden font-sans",
    glassCard: "bg-[#120F25]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden",
    
    // Inputs (Mandala Style)
    input: "w-full p-4 bg-[#0A0910]/60 border border-white/5 rounded-2xl text-white focus:border-[#A944FF]/50 focus:ring-1 focus:ring-[#A944FF]/30 outline-none transition-all placeholder:text-slate-600 font-medium",
    select: "w-full p-4 bg-[#0A0910]/60 border border-white/5 rounded-2xl text-white focus:border-[#A944FF]/50 focus:ring-1 focus:ring-[#A944FF]/30 outline-none transition-all appearance-none cursor-pointer",
    
    // Premium Buttons
    buttonPrimary: "px-6 py-3 bg-gradient-to-r from-[#A944FF] to-[#7928CA] text-white font-black rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-purple-900/20 uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2",
    buttonSuccess: "px-6 py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-900/10 uppercase text-xs tracking-[0.2em] active:scale-95 flex items-center justify-center gap-2",
    buttonDanger: "px-6 py-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-black rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-900/10 uppercase text-xs tracking-[0.2em] active:scale-95 flex items-center justify-center gap-2",
    buttonSecondary: "px-6 py-3 bg-white/5 border border-white/10 text-slate-400 font-black rounded-2xl hover:bg-white/10 hover:text-white transition-all uppercase text-xs tracking-[0.2em] active:scale-95 flex items-center justify-center gap-2",
    buttonBack: "flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all font-black uppercase text-[11px] tracking-[0.2em] backdrop-blur-md active:scale-95 group",
    
    // Typography
    titleMain: "text-4xl md:text-6xl font-black text-white tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(169,68,255,0.4)]",
    titleSection: "text-sm font-black tracking-[0.4em] uppercase text-[#A944FF] flex items-center gap-4",
    
    // Components
    badge: "px-3 py-1.5 rounded-xl bg-[#A944FF]/10 border border-[#A944FF]/20 text-[#A944FF] text-[10px] font-black uppercase tracking-widest",
    
    // Animations
    fadeIn: "animate-fadeIn",
    scaleIn: "animate-scaleIn",
};
