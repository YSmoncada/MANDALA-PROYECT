import React from 'react';

const LoadingSpinner = ({ message = "" }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-[9999]">
        {message && (
            <div className="text-white text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zinc-500 mx-auto mb-4"></div>
                <p className="text-xs uppercase tracking-widest text-zinc-500">{message}</p>
            </div>
        )}
    </div>
);

export default LoadingSpinner;
