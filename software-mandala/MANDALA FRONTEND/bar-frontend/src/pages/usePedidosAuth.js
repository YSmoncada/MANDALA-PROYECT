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

    // Cargar mesera guardada en localStorage al iniciar
    useEffect(() => {
        const savedMesera = localStorage.getItem("mesera");
        if (savedMesera) {
            setMesera(savedMesera);
            setCodigoConfirmado(true);
        }
    }, []);

    const handleSelectMesera = (nombre) => {
        setMesera(nombre);
        setCodigoConfirmado(false);
    };

    const handleCodigoSubmit = (codigo) => {
        if (codigo.length === 4) {
            setCodigoConfirmado(true);
            localStorage.setItem("mesera", mesera);
        } else {
            alert("El código debe tener 4 dígitos");
        }
    };

    const handleLogout = () => {
        setMesera(null);
        setCodigoConfirmado(false);
        localStorage.removeItem("mesera");
    };

    return { mesera, codigoConfirmado, meseras: MESERAS, handleSelectMesera, handleCodigoSubmit, handleLogout };
}