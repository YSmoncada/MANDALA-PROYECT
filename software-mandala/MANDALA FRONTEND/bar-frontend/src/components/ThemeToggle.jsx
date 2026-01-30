import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = "" }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full 
                bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 
                hover:border-zinc-300 dark:hover:border-white/20 
                text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white 
                transition-all backdrop-blur-md shadow-sm dark:shadow-2xl active:scale-95 ${className}`}
        >
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                {theme === 'nox' ? "Nox" : "Lux"}
            </span>
        </button>
    );
};

export default ThemeToggle;
