/**
 * Styles for the ProductCard component.
 * Separated to keep the JSX clean and manageable.
 */
export const CARD_STYLES = {
    container: `group relative bg-[#1A103C]/80 dark:bg-zinc-900/10 backdrop-blur-2xl 
                rounded-[2.5rem] p-6 transition-all duration-500 flex flex-col h-full 
                shadow-2xl hover:shadow-[0_80px_100px_-20px_rgba(0,0,0,0.8)] border border-white/10 dark:border-white/5 
                hover:border-[#A944FF]/40 dark:hover:border-white/20 transform-gpu hover:-translate-y-2`,
    imageWrapper: `relative aspect-square w-full mb-6 overflow-hidden rounded-[2rem] bg-[#0E0D23] dark:bg-white/5 
                   p-4 flex items-center justify-center shadow-inner group-hover:scale-[1.02] transition-transform duration-700`,
    image: `w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] scale-100 group-hover:scale-110 
            transition-all duration-700`,
    badgeWrapper: `mb-4 flex justify-between items-center`,
    badge: `text-[9px] font-black text-[#A944FF] dark:text-white uppercase tracking-[0.2em] 
            border border-[#A944FF]/20 dark:border-white/10 bg-[#A944FF]/5 dark:bg-zinc-800/80 px-4 py-2 rounded-full`,
    title: `font-black text-lg sm:text-xl text-white dark:text-white group-hover:text-[#A944FF] dark:group-hover:text-white leading-tight mb-6 line-clamp-2 
            transition-colors uppercase tracking-tight italic drop-shadow-lg`,
    footer: `mt-auto pt-6 border-t border-white/5 space-y-6`,
    infoRow: `flex items-center justify-between px-1`,
    label: `text-[9px] font-black text-[#8A7BAF] dark:text-zinc-600 uppercase tracking-[0.25em]`,
    price: `text-2xl sm:text-3xl font-black text-emerald-400 dark:text-white tracking-tighter italic`,
    counter: `flex items-center bg-black/40 dark:bg-black/20 rounded-2xl border border-white/10 dark:border-white/5 p-1.5`,
    counterBtn: `w-10 h-10 flex items-center justify-center text-[#8A7BAF] dark:text-zinc-400 
                  hover:text-white hover:bg-white/5 dark:hover:bg-zinc-800 rounded-xl transition-all active:scale-95`,
    counterValue: `w-10 text-center font-black text-white dark:text-white text-base sm:text-lg`,
    mainBtn: `w-full bg-[#441E73] dark:bg-white hover:bg-[#A944FF] dark:hover:bg-zinc-200 
               text-white dark:text-black font-black py-5 rounded-[1.5rem] transition-all duration-500 
               text-[11px] uppercase tracking-[0.3em] border border-white/10 dark:border-transparent 
               shadow-2xl active:scale-95 transform hover:brightness-110`
};
