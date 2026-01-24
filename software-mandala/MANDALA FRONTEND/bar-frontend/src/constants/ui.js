/**
 * Design system tokens for NoxOS
 * Centralizing these styles ensures consistency and easy maintenance.
 */

export const THEME = {
    colors: {
        primary: "#6C3FA8",
        primaryHover: "#5A328E",
        bgDark: "#1A103C",
        bgInput: "#2B0D49",
        accent: "#A944FF",
        rose: "#E11D48", // rose-600
        emerald: "#10B981", // emerald-600
    },
    glass: {
        card: "bg-[#1A103C] border border-[#6C3FA8] backdrop-blur-md shadow-2xl",
        input: "bg-[#2B0D49] border border-[#6C3FA8]/50 focus:ring-2 focus:ring-[#A944FF] outline-none",
    }
};

export const UI_CLASSES = {
    // Layouts
    pageContainer: "min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 md:p-8 relative selection:bg-purple-500/30",
    glassCard: "bg-gray-900/80 border border-purple-500/30 rounded-2xl shadow-2xl p-4 md:p-8",
    
    // Inputs (NoxOS Style)
    input: "w-full p-3 bg-[#2B0D49] border border-[#6C3FA8]/50 rounded-lg text-white focus:ring-2 focus:ring-[#A944FF] outline-none transition-all placeholder:text-gray-500 selection:bg-purple-500/30 autofill:shadow-[0_0_0_30px_#2B0D49_inset] autofill:text-fill-white",
    select: "w-full p-3 bg-[#2B0D49] border border-[#6C3FA8]/50 rounded-lg text-white focus:ring-2 focus:ring-[#A944FF] outline-none transition-all appearance-none [&>option]:bg-[#1A103C]",
    
    // Buttons
    buttonPrimary: "px-6 py-2 bg-[#6C3FA8] text-white font-bold rounded-lg hover:bg-[#5A328E] transition-all flex items-center justify-center gap-2",
    buttonSecondary: "px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all font-bold",
    buttonDanger: "px-6 py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-500 active:scale-95 transition-all shadow-lg shadow-rose-900/20",
    buttonSuccess: "px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 active:scale-95 transition-all shadow-lg shadow-emerald-900/20",
    buttonBack: "flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-gray-300 hover:bg-purple-600 hover:text-white transition-all backdrop-blur-md shadow-lg hover:scale-105 active:scale-95 group",
    
    // Animations
    fadeIn: "animate-fadeIn",
    scaleIn: "animate-scaleIn",
};
