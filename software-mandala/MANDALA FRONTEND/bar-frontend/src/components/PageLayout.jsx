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
            {/* Premium Background Ambiance */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#A944FF]/10 rounded-full blur-[120px]"></div>
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#FF4BC1]/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative mb-12 flex flex-col items-center md:items-start">
                {showBackButton && (
                    <button
                        onClick={() => navigate("/")}
                        className={`${UI_CLASSES.buttonBack} mb-10 self-start`}
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Volver al Inicio</span>
                    </button>
                )}
                
                {title && (
                    <div className="w-full text-center md:text-left">
                        <h1 className={UI_CLASSES.titleMain}>
                            {title}
                        </h1>
                        <div className="mt-4 flex items-center gap-3">
                            <div className="h-1 w-20 bg-gradient-to-r from-[#A944FF] to-transparent rounded-full"></div>
                            <div className="h-1 w-2 bg-[#A944FF] rounded-full animate-pulse"></div>
                        </div>
                    </div>
                )}
            </div>

            <main className="relative z-10">
                {children}
            </main>
        </div>
    );
};

export default PageLayout;
