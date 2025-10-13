import { useState, useEffect } from "react";

const MESERAS = [
    "María González",
    "Ana Rodríguez",
    "Carmen López",
    "Sofía Martínez",
    "Valentina Torres",
];

export function usePedidosAuth() {
    const [mesera, setMesera] = useState(null);
    const [codigoConfirmado, setCodigoConfirmado] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Cargar mesera guardada en localStorage al iniciar
    useEffect(() => {
        try {
            const savedMesera = localStorage.getItem("mesera");
            console.log("Loaded mesera from localStorage:", savedMesera);
            
            if (savedMesera && savedMesera !== "null") {
                setMesera(savedMesera);
                setCodigoConfirmado(true);
                console.log("Mesera restored:", savedMesera);
            }
        } catch (error) {
            console.error("Error loading from localStorage:", error);
        }
        setIsInitialized(true);
    }, []);

    const handleSelectMesera = (nombre) => {
        setMesera(nombre);
        setCodigoConfirmado(false);
    };

    const handleCodigoSubmit = (codigo) => {
        if (codigo.length === 4) {
            setCodigoConfirmado(true);
            localStorage.setItem("mesera", mesera);
            console.log("Mesera saved to localStorage:", mesera);
        } else {
            alert("El código debe tener 4 dígitos");
        }
    };

    const handleLogout = () => {
        setMesera(null);
        setCodigoConfirmado(false);
        localStorage.removeItem("mesera");
    };

    return { 
        mesera, 
        codigoConfirmado, 
        isInitialized,
        meseras: MESERAS, 
        handleSelectMesera, 
        handleCodigoSubmit, 
        handleLogout 
    };
}