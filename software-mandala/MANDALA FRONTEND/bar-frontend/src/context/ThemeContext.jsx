import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    // Nox = Dark, Lux = Light
    // Default to 'nox' (dark) as requested
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('app-theme');
        return saved || 'nox';
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'nox') {
            root.classList.add('dark');
            root.classList.remove('lux-theme'); // just in case
        } else {
            root.classList.remove('dark');
            root.classList.add('lux-theme');
        }
        localStorage.setItem('app-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'nox' ? 'lux' : 'nox'));
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark: theme === 'nox' }}>
            {children}
        </ThemeContext.Provider>
    );
};
