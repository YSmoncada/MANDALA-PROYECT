/**
 * Design system tokens for the Pedidos Page.
 * Separated to keep the view file focused on structure.
 */
export const PAGE_STYLES = {
    layout: `min-h-screen flex flex-col bg-black text-zinc-100 selection:bg-zinc-700 overflow-x-hidden`,
    glowOverlay: `fixed inset-0 pointer-events-none`,
    glow1: `absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-zinc-900/20 to-transparent pointer-events-none`,
    glow2: `hidden`, // Removed colorful second glow for cleaner look
    main: `flex-1 flex items-center justify-center p-3 pt-6 pb-20 sm:p-8 relative z-10`,
    gridContainer: `w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8`,
    detailSection: `lg:col-span-2 space-y-4 sm:space-y-6`,
    checkoutSection: `lg:col-span-1 mb-20 sm:mb-0`,
    card: `bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-3xl p-4 sm:p-8 shadow-xl`,
    summaryCard: `bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-8 shadow-2xl lg:sticky top-28 relative overflow-hidden`,
    sectionTitle: `text-lg sm:text-2xl font-medium text-white mb-4 sm:mb-6 flex flex-wrap items-center gap-3 tracking-wide uppercase`,
    badgeIcon: `p-2 bg-zinc-800 rounded-lg text-zinc-300`,
    badgeText: `text-xs font-bold text-zinc-300 ml-auto bg-zinc-800/50 px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-wider`,
    scrollContainer: `space-y-4 max-h-[40vh] sm:max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar`,
    inputLabel: `block mb-2 text-xs font-bold text-zinc-500 uppercase tracking-widest`,
    select: `w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-sm rounded-xl focus:ring-zinc-600 focus:border-zinc-600 block p-4 transition-all appearance-none cursor-pointer hover:border-zinc-700`,
    totalAmount: `text-3xl sm:text-4xl font-black text-white drop-shadow-lg tracking-tight`,
    confirmBtn: `w-full py-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold uppercase tracking-widest text-xs shadow-lg shadow-white/5 hover:shadow-white/10 transition-all disabled:opacity-50 flex items-center justify-center gap-3 transform active:scale-95`,
    cancelBtn: `w-full py-4 rounded-xl bg-transparent text-zinc-500 font-bold uppercase tracking-widest text-xs hover:text-red-400 transition-all border border-zinc-900 hover:border-red-900/30`
};
