import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { UI_CLASSES } from '../constants/ui';

/**
 * Common layout for pages with a background, back button and title header.
 */
const PageLayout = ({ children, title, showBackButton = true }) => {
    const navigate = useNavigate();

    return (
        <div className={UI_CLASSES.pageContainer}>
            {/* Subtle background effects */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative mb-8 text-center md:text-left">
                {showBackButton && (
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-gray-300 hover:bg-purple-600 hover:text-white transition-all backdrop-blur-md shadow-lg hover:scale-105 active:scale-95 group mb-6"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold uppercase tracking-wider text-xs">Volver al Inicio</span>
                    </button>
                )}
                
                {title && (
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-black mb-3 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                            {title}
                        </h1>
                        <div className="h-1.5 w-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto blur-[1px]"></div>
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
