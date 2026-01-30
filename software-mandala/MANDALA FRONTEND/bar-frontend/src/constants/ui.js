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
    pageContainer: "min-h-screen bg-transparent p-4 md:p-8 relative selection:bg-purple-500/30 text-white dark:text-zinc-200 transition-colors duration-500",
    glassCard: "bg-[#1A103C]/80 dark:bg-zinc-900/30 border border-white/10 dark:border-white/5 rounded-3xl shadow-2xl dark:shadow-none p-4 md:p-8 backdrop-blur-md transition-all duration-500",
    
    // Inputs (NoxOS Style)
    input: "w-full p-4 bg-[#0E0D23] dark:bg-zinc-950 border border-[#6C3FA8]/30 dark:border-white/5 rounded-xl text-white dark:text-white focus:ring-1 focus:ring-[#A944FF] dark:focus:ring-white outline-none transition-all placeholder:text-[#8A7BAF] dark:placeholder:text-zinc-600",
    select: "w-full p-4 bg-[#0E0D23] dark:bg-zinc-950 border border-[#6C3FA8]/30 dark:border-white/5 rounded-xl text-white dark:text-white focus:ring-1 focus:ring-[#A944FF] dark:focus:ring-white outline-none transition-all appearance-none [&>option]:bg-[#0E0D23] dark:[&>option]:bg-black",
    
    // Buttons
    buttonPrimary: "px-6 py-4 bg-[#441E73] dark:bg-zinc-100 text-white dark:text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-[#A944FF] dark:hover:bg-white transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl",
    buttonSecondary: "px-6 py-4 bg-white/5 dark:bg-zinc-900 text-gray-300 dark:text-zinc-400 rounded-xl hover:bg-white/10 dark:hover:bg-zinc-800 hover:text-white dark:hover:text-white transition-all font-bold uppercase tracking-widest text-[10px] border border-white/10 dark:border-white/5",
    buttonDanger: "px-6 py-4 bg-red-500/10 dark:bg-rose-950/50 text-red-500 dark:text-rose-200 font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-red-500 dark:hover:bg-rose-900 transition-all shadow-lg border border-red-500/20 dark:border-rose-900/30",
    buttonSuccess: "px-6 py-4 bg-green-500/10 dark:bg-emerald-950/50 text-green-500 dark:text-emerald-200 font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-green-500 dark:hover:bg-emerald-900 transition-all shadow-lg border border-green-500/20 dark:border-emerald-900/30",
    buttonBack: "flex items-center gap-2 rounded-xl bg-white/5 dark:bg-zinc-900/50 border border-white/10 dark:border-white/5 px-4 py-2 text-gray-400 dark:text-zinc-500 hover:bg-white/10 dark:hover:bg-zinc-800 hover:text-white dark:hover:text-white transition-all backdrop-blur-md shadow-none hover:scale-105 active:scale-95 group",
    
    // Animations
    fadeIn: "animate-fadeIn",
    scaleIn: "animate-scaleIn",
};
