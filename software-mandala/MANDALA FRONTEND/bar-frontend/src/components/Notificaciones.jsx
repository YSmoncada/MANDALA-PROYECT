import React from 'react';
import { Toaster } from 'react-hot-toast';

const Notificaciones = () => {
    return (
        <Toaster
            position="bottom-right"
            toastOptions={{
                className: '',
                style: {
                    background: '#2B0D49',
                    color: '#fff',
                    border: '1px solid #6C3FA8',
                },
            }}
        />
    );
};

export default Notificaciones;
