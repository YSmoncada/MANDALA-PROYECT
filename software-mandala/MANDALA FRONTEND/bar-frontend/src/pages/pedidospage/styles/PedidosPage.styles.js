/**
 * Design system tokens for the Pedidos Page.
 * Separated to keep the view file focused on structure.
 */
export const PAGE_STYLES = {
    layout: `min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white selection:bg-purple-500/30 overflow-x-hidden`,
    glowOverlay: `fixed inset-0 pointer-events-none`,
    glow1: `absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl`,
    glow2: `absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl`,
    main: `flex-1 flex items-center justify-center p-3 pt-6 pb-20 sm:p-8 relative z-10`,
    gridContainer: `w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8`,
    detailSection: `lg:col-span-2 space-y-4 sm:space-y-6`,
    checkoutSection: `lg:col-span-1 mb-20 sm:mb-0`,
    card: `bg-[#441E73]/60 backdrop-blur-xl border border-[#6C3FA8] rounded-2xl p-3 sm:p-8 shadow-xl`,
    summaryCard: `bg-[#441E73]/80 backdrop-blur-xl border border-[#6C3FA8] rounded-2xl p-4 sm:p-8 shadow-2xl lg:sticky top-28 relative overflow-hidden`,
    sectionTitle: `text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-8 flex flex-wrap items-center gap-2 sm:gap-4 tracking-tight`,
    badgeIcon: `p-2 bg-[#A944FF]/10 rounded-lg`,
    badgeText: `text-xs font-bold text-[#A944FF] ml-auto bg-[#A944FF]/10 px-3 py-1.5 rounded-full border border-[#A944FF]/20 uppercase tracking-wider`,
    scrollContainer: `space-y-4 max-h-[40vh] sm:max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar`,
    inputLabel: `block mb-2 text-xs font-bold text-[#C2B6D9] uppercase tracking-widest`,
    select: `w-full bg-[#2B0D49] border border-[#6C3FA8] text-white text-sm rounded-xl focus:ring-[#A944FF] focus:border-[#A944FF] block p-3 transition-all appearance-none cursor-pointer`,
    totalAmount: `text-2xl sm:text-3xl font-black text-[#A944FF] drop-shadow-[0_0_10px_rgba(169,68,255,0.3)]`,
    confirmBtn: `w-full py-4 rounded-xl bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] hover:brightness-110 text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-[#A944FF]/30 hover:shadow-[#A944FF]/50 transition-all disabled:opacity-50 flex items-center justify-center gap-3`,
    cancelBtn: `w-full py-3 rounded-xl bg-white/5 text-[#C2B6D9] font-bold uppercase tracking-widest text-xs hover:bg-white/10 hover:text-white transition-all border border-white/5`
};
