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
    pageContainer: "min-h-screen bg-white dark:bg-black p-4 md:p-8 relative selection:bg-zinc-200 dark:selection:bg-zinc-700 text-zinc-900 dark:text-zinc-200 transition-colors duration-300",
    glassCard: "bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5 rounded-3xl shadow-sm dark:shadow-2xl p-4 md:p-8 backdrop-blur-md",
    
    // Inputs (NoxOS Style)
    input: "w-full p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 rounded-xl text-zinc-900 dark:text-white focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white outline-none transition-all placeholder:text-zinc-400 selection:bg-zinc-200 dark:selection:bg-zinc-800",
    select: "w-full p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 rounded-xl text-zinc-900 dark:text-white focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white outline-none transition-all appearance-none [&>option]:bg-zinc-50 dark:[&>option]:bg-black",
    
    // Buttons
    buttonPrimary: "px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black font-bold rounded-xl hover:bg-black dark:hover:bg-white transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg",
    buttonSecondary: "px-6 py-3 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all font-medium border border-zinc-200 dark:border-white/5",
    buttonDanger: "px-6 py-3 bg-red-100 dark:bg-rose-950/50 text-red-600 dark:text-rose-200 font-bold rounded-xl hover:bg-red-200 dark:hover:bg-rose-900 transition-all shadow-sm border border-red-200 dark:border-rose-900/30",
    buttonSuccess: "px-6 py-3 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-200 font-bold rounded-xl hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-all shadow-sm border border-emerald-200 dark:border-emerald-900/30",
    buttonBack: "flex items-center gap-2 rounded-xl bg-transparent border border-zinc-200 dark:border-white/5 px-4 py-2 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white transition-all backdrop-blur-md shadow-none hover:scale-105 active:scale-95 group",
    
    // Animations
    fadeIn: "animate-fadeIn",
    scaleIn: "animate-scaleIn",
};
