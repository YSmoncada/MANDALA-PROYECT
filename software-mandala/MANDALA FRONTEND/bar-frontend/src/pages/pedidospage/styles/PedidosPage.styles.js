/**
 * Design system tokens for the Pedidos Page.
 * Separated to keep the view file focused on structure.
 */
export const PAGE_STYLES = {
    layout: `min-h-screen flex flex-col bg-transparent text-white dark:text-zinc-100 selection:bg-[#A944FF]/30 dark:selection:bg-white/10 overflow-x-hidden transition-colors duration-500`,
    glowOverlay: `fixed inset-0 pointer-events-none overflow-hidden`,
    glow1: `absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#441E73]/20 dark:bg-zinc-900/10 rounded-full blur-[120px] animate-pulse`,
    glow2: `absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#A944FF]/10 dark:bg-white/5 rounded-full blur-[100px]`, 
    main: `flex-1 flex items-start justify-center p-4 pt-10 pb-24 sm:p-10 relative z-10`,
    gridContainer: `w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10`,
    detailSection: `lg:col-span-2 space-y-6 sm:space-y-8`,
    checkoutSection: `lg:col-span-1 mb-24 sm:mb-0`,
    card: `bg-[#1A103C]/80 dark:bg-zinc-900/30 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] dark:shadow-none`,
    summaryCard: `bg-[#1A103C]/90 dark:bg-zinc-900/50 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_50px_100px_-20px_rgba(169,68,255,0.15)] dark:shadow-none lg:sticky top-28 relative overflow-hidden`,
    sectionTitle: `text-xl sm:text-3xl font-black text-white dark:text-white mb-6 sm:mb-8 flex flex-wrap items-center gap-4 tracking-tighter uppercase italic`,
    badgeIcon: `p-3 bg-[#0E0D23] dark:bg-zinc-800 rounded-2xl text-[#A944FF] dark:text-white border border-white/5 shadow-inner`,
    badgeText: `text-[10px] font-black text-[#8A7BAF] dark:text-zinc-400 ml-auto bg-black/40 dark:bg-zinc-800/50 px-4 py-2 rounded-xl border border-white/5 dark:border-white/10 uppercase tracking-[0.2em]`,
    scrollContainer: `space-y-6 max-h-[50vh] sm:max-h-[65vh] overflow-y-auto pr-3 custom-scrollbar`,
    inputLabel: `block mb-3 text-[10px] font-black text-[#8A7BAF] dark:text-zinc-500 uppercase tracking-[0.3em] ml-1`,
    select: `w-full bg-[#0E0D23] dark:bg-black/50 border-2 border-[#6C3FA8]/30 dark:border-white/5 text-white dark:text-white text-[11px] font-black uppercase tracking-widest rounded-2xl focus:border-[#A944FF] dark:focus:border-white block p-4.5 transition-all appearance-none cursor-pointer hover:bg-[#1A103C]`,
    totalAmount: `text-3xl sm:text-4xl font-black text-white dark:text-white tracking-tighter italic drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]`,
    confirmBtn: `w-full py-5 rounded-2xl bg-gradient-to-r from-[#8A44FF] to-[#A944FF] dark:from-white dark:to-zinc-200 text-white dark:text-black font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_20px_40px_-10px_rgba(169,68,255,0.5)] dark:shadow-none hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-4`,
    cancelBtn: `w-full py-5 rounded-2xl bg-transparent text-[#8A7BAF] dark:text-zinc-500 font-bold uppercase tracking-[0.2em] text-[11px] hover:text-rose-500 transition-all border border-white/5 dark:border-zinc-800 hover:border-rose-500/30 backdrop-blur-md`
};
