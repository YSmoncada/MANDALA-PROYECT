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
        <div className={UI_CLASSES.pageContainer}>
            {/* Subtle background effects */}
            <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative mb-8 flex flex-col items-center">
                <div className="w-full flex justify-between items-start mb-6 no-print">
                    {showBackButton ? (
                        <button
                            onClick={() => navigate("/")}
                            className={UI_CLASSES.buttonBack}
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-bold uppercase tracking-wider text-xs">Inicio</span>
                        </button>
                    ) : <div></div>}
                    
                    <ThemeToggle />
                </div>
                
                {title && (
                    <div className="text-center w-full">
                        <h1 className="text-5xl md:text-7xl font-black mb-3 text-zinc-900 dark:text-white drop-shadow-lg tracking-tighter uppercase italic">
                            {title}
                        </h1>
                        <div className="h-1.5 w-24 bg-gradient-to-r from-zinc-300 dark:from-cyan-400 to-zinc-400 dark:to-blue-500 rounded-full mx-auto blur-[0.5px]"></div>
                    </div>
                )}
            </div>

            <main className="relative max-w-6xl mx-auto">
                {children}
            </main>
        </div>
    );
};

export default PageLayout;
