/**
 * Design system tokens for NoxOS
 * Centralizing these styles ensures consistency and easy maintenance.
 */

export const THEME = {
    colors: {
        primary: "#fafafa", // zinc-50
        primaryHover: "#e4e4e7", // zinc-200
        bgDark: "#000000",
        bgInput: "#09090b", // zinc-950
        accent: "#ffffff",
        rose: "#e11d48", // rose-600
        emerald: "#10b981", // emerald-600
    },
    glass: {
        card: "bg-zinc-900/30 border border-white/5 backdrop-blur-md shadow-2xl",
        input: "bg-zinc-950 border border-white/10 focus:ring-2 focus:ring-zinc-400 outline-none",
    }
};

export const UI_CLASSES = {
    // Layouts
    pageContainer: "min-h-screen bg-black p-4 md:p-8 relative selection:bg-zinc-700 text-zinc-200",
    glassCard: "bg-zinc-900/30 border border-white/5 rounded-3xl shadow-2xl p-4 md:p-8 backdrop-blur-md",
    
    // Inputs (NoxOS Style)
    input: "w-full p-4 bg-zinc-950 border border-white/5 rounded-xl text-white focus:ring-1 focus:ring-white outline-none transition-all placeholder:text-zinc-600 selection:bg-zinc-800 autofill:bg-black autofill:text-fill-white",
    select: "w-full p-4 bg-zinc-950 border border-white/5 rounded-xl text-white focus:ring-1 focus:ring-white outline-none transition-all appearance-none [&>option]:bg-black",
    
    // Buttons
    buttonPrimary: "px-6 py-3 bg-zinc-100 text-black font-bold rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-white/5",
    buttonSecondary: "px-6 py-3 bg-zinc-900 text-zinc-300 rounded-xl hover:bg-zinc-800 hover:text-white transition-all font-medium border border-white/5",
    buttonDanger: "px-6 py-3 bg-rose-950/50 text-rose-200 font-bold rounded-xl hover:bg-rose-900 hover:text-white active:scale-95 transition-all shadow-lg shadow-rose-900/10 border border-rose-900/30",
    buttonSuccess: "px-6 py-3 bg-emerald-950/50 text-emerald-200 font-bold rounded-xl hover:bg-emerald-900 hover:text-white active:scale-95 transition-all shadow-lg shadow-emerald-900/10 border border-emerald-900/30",
    buttonBack: "flex items-center gap-2 rounded-xl bg-transparent border border-white/5 px-4 py-2 text-zinc-500 hover:bg-zinc-900 hover:text-white transition-all backdrop-blur-md shadow-none hover:scale-105 active:scale-95 group",
    
    // Animations
    fadeIn: "animate-fadeIn",
    scaleIn: "animate-scaleIn",
};
