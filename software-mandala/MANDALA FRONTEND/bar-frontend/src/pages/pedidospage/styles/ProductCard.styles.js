/**
 * Styles for the ProductCard component.
 * Separated to keep the JSX clean and manageable.
 */
export const CARD_STYLES = {
    container: `group relative bg-[#1A103C]/80 hover:bg-[#2B0D49] dark:bg-zinc-900/40 dark:hover:bg-zinc-900 
                rounded-[1.5rem] p-4 sm:p-5 transition-all duration-500 flex flex-col h-full 
                shadow-xl dark:shadow-none transform-gpu border border-white/5 dark:border-white/5 
                hover:border-[#A944FF]/30 dark:hover:border-white/10 backdrop-blur-md`,
    imageWrapper: `relative aspect-square w-full mb-3 sm:mb-4 overflow-hidden rounded-xl bg-white dark:bg-white/5 
                   p-2 flex items-center justify-center shadow-inner group-hover:bg-white dark:group-hover:bg-black/50 transition-colors duration-500`,
    image: `w-full h-full object-contain drop-shadow-xl scale-100 group-hover:scale-110 
            transition-all duration-500`,
    badgeWrapper: `mb-1.5 flex justify-center sm:justify-start`,
    badge: `text-[10px] font-black text-[#A944FF] dark:text-zinc-400 uppercase tracking-widest 
            border border-[#A944FF]/30 dark:border-white/10 bg-[#A944FF]/10 dark:bg-zinc-800/80 px-3 py-1.5 rounded-lg dark:rounded-full`,
    title: `font-bold dark:font-black text-sm sm:text-lg text-white dark:text-zinc-200 group-hover:text-white leading-tight mb-2 sm:mb-4 line-clamp-2 
            transition-colors uppercase text-center sm:text-left h-10 sm:h-12 flex items-center 
            justify-center sm:justify-start tracking-tight`,
    footer: `mt-auto pt-4 border-t border-[#6C3FA8]/30 dark:border-white/5 space-y-4`,
    infoRow: `flex items-center justify-between px-1`,
    label: `text-[9px] font-bold dark:font-black text-[#8A7BAF] dark:text-zinc-600 uppercase tracking-widest`,
    price: `text-xl sm:text-2xl font-black text-green-400 dark:text-white tracking-tighter`,
    counter: `flex items-center bg-[#0E0D23] dark:bg-black/40 rounded-xl border border-[#6C3FA8]/50 dark:border-white/5 p-1`,
    counterBtn: `w-8 h-8 flex items-center justify-center text-[#8A7BAF] dark:text-zinc-400 
                  hover:text-white hover:bg-[#441E73] dark:hover:bg-zinc-800 rounded-lg transition-all active:scale-90`,
    counterValue: `w-8 text-center font-bold dark:font-black text-white dark:text-zinc-200 text-xs sm:text-sm`,
    mainBtn: `w-full bg-[#441E73] dark:bg-white hover:bg-gradient-to-r hover:from-[#A944FF] hover:to-[#FF4BC1] dark:hover:bg-zinc-100 
               text-white dark:text-black font-bold dark:font-black py-4 rounded-2xl transition-all duration-300 
               text-[10px] uppercase tracking-[0.2em] border border-[#6C3FA8] dark:border-transparent 
               shadow-xl active:scale-95`
};
