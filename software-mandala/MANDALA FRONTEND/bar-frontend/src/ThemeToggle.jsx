import React, { useState, useEffect } from 'react';
import './ThemeToggle.css';

const ThemeToggle = () => {
    // Estado para el tema: 'default' o 'neon'
    // Leemos de localStorage para recordar la elección del usuario
    const [theme, setTheme] = useState(localStorage.getItem('mandala-theme') || 'default');

    useEffect(() => {
        // Aplicar el atributo al body para que el CSS global actúe
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('mandala-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'default' ? 'neon' : 'default'));
    };

    return (
        <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'default' ? "Activar Modo Disco" : "Volver al Modo Clásico"}
        >
            {theme === 'default' ? (
                <>
                    <span role="img" aria-label="disco">🎨</span>
                    <span className="btn-text">Modo Disco</span>
                </>
            ) : (
                <>
                    <span role="img" aria-label="light">☀️</span>
                    <span className="btn-text">Modo Día</span>
                </>
            )}
        </button>
    );
};

export default ThemeToggle;