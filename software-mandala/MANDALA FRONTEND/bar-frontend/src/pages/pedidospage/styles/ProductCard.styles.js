/**
 * Styles for the ProductCard component.
 * Separated to keep the JSX clean and manageable.
 */
export const CARD_STYLES = {
    container: `group relative bg-zinc-900/30 hover:bg-zinc-900/50 rounded-3xl p-4 sm:p-5 
                transition-all duration-500 flex flex-col h-full 
                hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] transform-gpu border border-white/5 
                hover:border-white/10 backdrop-blur-sm`,
    imageWrapper: `relative aspect-square w-full mb-3 sm:mb-4 overflow-hidden rounded-2xl bg-white/5 
                   p-4 flex items-center justify-center shadow-inner`,
    image: `w-full h-full object-contain drop-shadow-2xl scale-100 group-hover:scale-110 
            transition-transform duration-500`,
    badgeWrapper: `mb-2 flex justify-center sm:justify-start`,
    badge: `text-[10px] font-bold text-zinc-400 uppercase tracking-widest 
            border border-white/5 bg-zinc-800/50 px-2.5 py-1 rounded-md`,
    title: `font-medium text-sm sm:text-lg text-zinc-200 group-hover:text-white leading-tight mb-2 sm:mb-4 line-clamp-2 
            transition-colors capitalize text-center sm:text-left h-10 sm:h-12 flex items-center 
            justify-center sm:justify-start tracking-wide`,
    footer: `mt-auto pt-4 border-t border-white/5 space-y-4`,
    infoRow: `flex items-center justify-between px-1`,
    label: `text-[10px] font-bold text-zinc-600 uppercase tracking-widest`,
    price: `text-lg sm:text-xl font-medium text-white tracking-tight`,
    counter: `flex items-center bg-black rounded-lg border border-zinc-800 p-0.5`,
    counterBtn: `w-8 h-8 flex items-center justify-center text-zinc-500 
                  hover:text-white hover:bg-zinc-800 rounded-md transition-colors`,
    counterValue: `w-8 text-center font-bold text-white text-xs sm:text-sm`,
    mainBtn: `w-full bg-zinc-800 hover:bg-white 
               text-white hover:text-black font-bold py-3 sm:py-3.5 rounded-xl transition-all duration-300 
               text-[10px] sm:text-xs uppercase tracking-widest border border-white/5 
               hover:border-transparent shadow-lg active:scale-95`
};
