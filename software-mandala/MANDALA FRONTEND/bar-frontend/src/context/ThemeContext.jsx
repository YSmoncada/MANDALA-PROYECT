import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePedidosContext } from './PedidosContext';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const { auth } = usePedidosContext();
    const { codigoConfirmado } = auth;
    
    // Initialize dark mode from localStorage, default to true (dark)
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('noxos-theme');
        return saved !== null ? saved === 'dark' : true;
    });

    useEffect(() => {
        // Only apply theme if user is authenticated
        if (codigoConfirmado) {
            if (isDarkMode) {
                document.documentElement.classList.add('dark-theme');
                document.documentElement.classList.remove('light-theme');
            } else {
                document.documentElement.classList.add('light-theme');
                document.documentElement.classList.remove('dark-theme');
            }
        } else {
            // Remove theme classes when not authenticated
            document.documentElement.classList.remove('dark-theme', 'light-theme');
        }
    }, [codigoConfirmado, isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(prev => {
            const newValue = !prev;
            localStorage.setItem('noxos-theme', newValue ? 'dark' : 'light');
            return newValue;
        });
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};
