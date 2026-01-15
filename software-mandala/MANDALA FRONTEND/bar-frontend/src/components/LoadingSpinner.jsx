import React from 'react';

const LoadingSpinner = ({ message = "Cargando..." }) => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black">
        <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">{message}</p>
        </div>
    </div>
);

export default LoadingSpinner;
