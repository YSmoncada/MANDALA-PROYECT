/**
 * Styles for the ProductCard component.
 * Separated to keep the JSX clean and manageable.
 */
export const CARD_STYLES = {
    container: `group relative bg-[#1A103C]/80 dark:bg-zinc-950/50 backdrop-blur-2xl 
                rounded-2xl p-4 transition-all duration-500 flex flex-col h-full 
                shadow-2xl hover:shadow-[0_80px_100px_-20px_rgba(0,0,0,0.8)] border border-white/5 dark:border-white/[0.02] 
                hover:border-[#A944FF]/40 dark:hover:border-white/10 transform-gpu hover:-translate-y-2`,
    imageWrapper: `relative aspect-square w-full mb-3 overflow-hidden rounded-xl bg-white/[0.03] dark:bg-white/[0.02] 
                   p-2 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-700`,
    image: `w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] scale-100 group-hover:scale-110 
            transition-all duration-700`,
    badgeWrapper: `mb-4 flex justify-between items-center`,
    badge: `text-[8px] font-black text-[#6C3FA8] dark:text-zinc-400 uppercase tracking-[0.2em] 
            bg-[#A944FF]/5 dark:bg-zinc-800/80 px-3 py-1.5 rounded-full`,
    title: `font-black text-base sm:text-lg text-white dark:text-white group-hover:text-[#A944FF] dark:group-hover:text-white leading-tight mb-4 line-clamp-2 
            transition-colors uppercase tracking-tight italic drop-shadow-lg`,
    footer: `mt-auto pt-4 space-y-4`,
    infoRow: `flex items-center justify-between gap-2 px-1`,
    label: `text-[8px] font-black text-[#8A7BAF] dark:text-zinc-600 uppercase tracking-[0.2em]`,
    price: `text-lg sm:text-xl font-black text-emerald-400 dark:text-white tracking-tighter italic`,
    counter: `flex items-center bg-black/40 dark:bg-black/20 rounded-xl p-1`,
    counterBtn: `w-7 h-7 flex items-center justify-center text-[#8A7BAF] dark:text-zinc-400 
                  hover:text-white hover:bg-white/5 dark:hover:bg-zinc-800 rounded-lg transition-all active:scale-95`,
    counterValue: `w-6 text-center font-black text-white dark:text-white text-xs sm:text-sm`,
    mainBtn: `w-full bg-[#441E73] dark:bg-white hover:bg-[#A944FF] dark:hover:bg-zinc-200 
               text-white dark:text-black font-black py-3 rounded-xl transition-all duration-500 
               text-[10px] uppercase tracking-[0.2em] border border-white/5 dark:border-transparent 
               shadow-2xl active:scale-95 transform hover:brightness-110`
};
