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
    
    // Initialize dark mode from localStorage or default to true when authenticated
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved !== null ? saved === 'true' : true;
    });

    useEffect(() => {
        // Only apply dark mode if user is authenticated
        if (codigoConfirmado && isDarkMode) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
    }, [codigoConfirmado, isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(prev => {
            const newValue = !prev;
            localStorage.setItem('darkMode', newValue.toString());
            return newValue;
        });
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};
