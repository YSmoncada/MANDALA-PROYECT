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

            <div className="relative z-50 flex flex-col md:block mb-6">
                {showBackButton && (
                    <div className="self-start mb-4 md:mb-0 md:absolute md:top-6 md:left-6">
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 rounded-lg bg-[#441E73]/50 border border-[#6C3FA8] px-4 py-2 text-white hover:bg-[#441E73] transition-all backdrop-blur-md shadow-lg hover:scale-105"
                        >
                            <ArrowLeft size={18} />
                            <span className="font-medium text-sm">Volver al Inicio</span>
                        </button>
                    </div>
                )}
                
                {title && (
                    <div className="text-center mb-10">
                        <h1 className="text-5xl md:text-6xl font-black mb-3 text-white drop-shadow-lg">
                            {title}
                        </h1>
                        <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mx-auto"></div>
                    </div>
                )}
            </div>

            <main className="relative z-10 max-w-6xl mx-auto">
                {children}
            </main>
        </div>
    );
};

export default PageLayout;
