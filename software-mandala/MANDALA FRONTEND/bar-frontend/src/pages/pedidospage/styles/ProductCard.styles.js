/**
 * Styles for the ProductCard component.
 * Separated to keep the JSX clean and manageable.
 */
export const CARD_STYLES = {
    container: `group relative bg-[#1A103C]/80 hover:bg-[#2B0D49] rounded-2xl p-4 sm:p-5 
                transition-all duration-300 flex flex-col h-full 
                hover:shadow-[0_0_25px_rgba(169,68,255,0.2)] transform-gpu border border-white/5 
                hover:border-[#A944FF]/30`,
    imageWrapper: `relative aspect-square w-full mb-3 sm:mb-4 overflow-hidden rounded-xl bg-white 
                   p-2 flex items-center justify-center shadow-inner`,
    image: `w-full h-full object-contain drop-shadow-xl scale-100 group-hover:scale-110 
            transition-transform duration-500`,
    badgeWrapper: `mb-1.5 flex justify-center sm:justify-start`,
    badge: `text-[9px] sm:text-[10px] font-bold text-[#A944FF] uppercase tracking-widest 
            border border-[#A944FF]/30 bg-[#A944FF]/10 px-2 py-1 rounded-lg`,
    title: `font-bold text-sm sm:text-lg text-white leading-tight mb-2 sm:mb-4 line-clamp-2 
            transition-colors capitalize text-center sm:text-left h-10 sm:h-12 flex items-center 
            justify-center sm:justify-start`,
    footer: `mt-auto pt-3 border-t border-[#6C3FA8]/30 space-y-3`,
    infoRow: `flex items-center justify-between px-1`,
    label: `text-[9px] font-bold text-[#8A7BAF] uppercase tracking-tighter`,
    price: `text-lg sm:text-xl font-black text-green-400 tracking-tight`,
    counter: `flex items-center bg-[#0E0D23] rounded-lg border border-[#6C3FA8]/50 p-0.5`,
    counterBtn: `w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[#8A7BAF] 
                  hover:text-white hover:bg-[#441E73] rounded-md transition-colors`,
    counterValue: `w-6 sm:w-8 text-center font-bold text-white text-xs sm:text-sm`,
    mainBtn: `w-full bg-[#441E73] hover:bg-gradient-to-r hover:from-[#A944FF] hover:to-[#FF4BC1] 
               text-white font-bold py-3 sm:py-3.5 rounded-xl transition-all duration-300 
               text-[10px] sm:text-xs uppercase tracking-widest border border-[#6C3FA8] 
               hover:border-transparent shadow-lg`
};
