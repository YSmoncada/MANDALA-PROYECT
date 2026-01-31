import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { UI_CLASSES } from '../constants/ui';
import ThemeToggle from './ThemeToggle';

/**
 * Common layout for pages with a background, back button and title header.
 */
const PageLayout = ({ children, title, showBackButton = true }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen p-4 md:p-8 pt-24 bg-transparent transition-colors duration-500">
            {/* Subtle background effects - Theme Responsive */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[10%] left-[10%] w-[50%] h-[50%] bg-[#441E73]/10 dark:bg-zinc-900/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-[#A944FF]/5 dark:bg-white/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative mb-12 flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-10 no-print max-w-7xl mx-auto">
                    {showBackButton ? (
                        <button
                            onClick={() => navigate("/")}
                            className={UI_CLASSES.buttonBack}
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-bold uppercase tracking-[0.2em] text-[10px]">Inicio</span>
                        </button>
                    ) : <div></div>}
                    
                    <ThemeToggle />
                </div>
                
                {title && (
                    <div className="text-center w-full max-w-4xl px-4">
                        <h1 className="text-3xl md:text-5xl font-black mb-4 text-white dark:text-white drop-shadow-2xl tracking-tighter uppercase italic">
                            {title}
                        </h1>
                        <div className="h-1.5 w-32 bg-gradient-to-r from-transparent via-[#A944FF] dark:via-white/10 to-transparent rounded-full mx-auto blur-[1px]"></div>
                    </div>
                )}
            </div>

            <main className="relative max-w-7xl mx-auto z-10 w-full">
                {children}
            </main>
        </div>
    );
};

export default PageLayout;
