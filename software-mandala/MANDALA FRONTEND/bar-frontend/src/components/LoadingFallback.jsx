import React from 'react';

const LoadingFallback = ({ message = "Cargando..." }) => (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0E0D23] relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>

        <div className="relative z-10 flex flex-col items-center">
            {/* Premium Spinner */}
            <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-[#A944FF] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-blue-400/20 rounded-full"></div>
                <div className="absolute inset-2 border-4 border-b-[#4BC1FF] border-t-transparent border-r-transparent border-l-transparent animate-spin" style={{ animationDuration: '3s' }}></div>
            </div>

            <div className="space-y-4 text-center">
                <p className="text-white text-xl font-bold tracking-[0.2em] uppercase animate-pulse">
                    {message}
                </p>
                <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-[#A944FF] to-transparent rounded-full blur-[1px]"></div>
            </div>
        </div>
    </div>
);

export default LoadingFallback;
