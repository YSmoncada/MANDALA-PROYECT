/**
 * Styles for the ProductCard component.
 * Separated to keep the JSX clean and manageable.
 */
export const CARD_STYLES = {
    container: `group relative bg-white dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-[2rem] p-5 
                transition-all duration-500 flex flex-col h-full 
                shadow-sm hover:shadow-xl dark:shadow-none transform-gpu border border-zinc-200 dark:border-white/5 
                dark:hover:border-white/10 backdrop-blur-sm`,
    imageWrapper: `relative aspect-square w-full mb-4 overflow-hidden rounded-[1.5rem] bg-zinc-50 dark:bg-white/5 
                   p-4 flex items-center justify-center shadow-inner group-hover:bg-white dark:group-hover:bg-black/50 transition-colors duration-500`,
    image: `w-full h-full object-contain drop-shadow-md dark:drop-shadow-2xl scale-95 group-hover:scale-105 
            transition-all duration-500`,
    badgeWrapper: `mb-2 flex justify-center sm:justify-start`,
    badge: `text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest 
            border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800/80 px-3 py-1.5 rounded-full`,
    title: `font-black text-sm sm:text-lg text-zinc-900 dark:text-white group-hover:text-zinc-900 dark:group-hover:text-white leading-tight mb-4 line-clamp-2 
            transition-colors uppercase text-center sm:text-left h-12 flex items-center 
            justify-center sm:justify-start tracking-tight`,
    footer: `mt-auto pt-5 border-t border-zinc-100 dark:border-white/5 space-y-4`,
    infoRow: `flex items-center justify-between px-1`,
    label: `text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest`,
    price: `text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tighter`,
    counter: `flex items-center bg-zinc-100 dark:bg-black/40 rounded-xl border border-zinc-200 dark:border-white/5 p-1`,
    counterBtn: `w-8 h-8 flex items-center justify-center text-zinc-500 dark:text-zinc-400 
                  hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 rounded-lg transition-all active:scale-90`,
    counterValue: `w-8 text-center font-black text-zinc-900 dark:text-white text-xs sm:text-sm`,
    mainBtn: `w-full bg-zinc-900 dark:bg-white hover:bg-black dark:hover:bg-zinc-100 
               text-white dark:text-black font-black py-4 rounded-2xl transition-all duration-300 
               text-[10px] uppercase tracking-[0.2em] border border-transparent 
               shadow-xl active:scale-95`
};
