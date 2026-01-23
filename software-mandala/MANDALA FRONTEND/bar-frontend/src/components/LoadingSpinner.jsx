import React from 'react';

const LoadingSpinner = ({ message = "Cargando..." }) => (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0910] relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#A944FF]/10 rounded-full blur-[100px]"></div>
        
        <div className="relative text-center">
            <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-[#A944FF]/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-[#A944FF] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-2 border-[#FF4BC1]/10 rounded-full"></div>
                <div className="absolute inset-2 border-2 border-b-[#FF4BC1] border-t-transparent border-r-transparent border-l-transparent rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
            </div>
            <p className="text-[#A944FF] font-black uppercase text-[10px] tracking-[0.4em] animate-pulse">
                {message}
            </p>
        </div>
    </div>
);

export default LoadingSpinner;
