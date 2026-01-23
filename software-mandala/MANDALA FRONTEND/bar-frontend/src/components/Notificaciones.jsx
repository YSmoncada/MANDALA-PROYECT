import React from 'react';
import { Toaster } from 'react-hot-toast';

/**
 * Global component for toast notifications.
 * Configured with a dark theme and styles consistent with the Mandala aesthetic.
 */
const Notificaciones = () => {
    return (
        <Toaster
            position="top-center"
            toastOptions={{
                className: '',
                style: {
                    background: '#0E0D23',
                    color: '#fff',
                    border: '1px solid #A944FF',
                    padding: '16px',
                    borderRadius: '12px',
                    fontSize: '14px',
                },
                duration: 4000,
            }}
        />
    );
};

export default Notificaciones;
