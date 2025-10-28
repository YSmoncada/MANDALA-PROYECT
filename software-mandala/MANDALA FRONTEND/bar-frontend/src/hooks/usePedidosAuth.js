// src/hooks/usePedidosAuth.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/meseras/';

export const usePedidosAuth = () => {
    const [meseras, setMeseras] = useState([]);
    const [selectedMesera, setSelectedMesera] = useState(null); // Almacenará el objeto completo {id, nombre, codigo}
    const [codigoConfirmado, setCodigoConfirmado] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState(null);

    // Cargar meseras desde la API al iniciar
    useEffect(() => {
        const fetchMeseras = async () => {
            try {
                const response = await axios.get(API_URL);
                setMeseras(response.data);
            } catch (error) {
                setError("No se pudo conectar con el servidor para cargar las meseras.");
                console.error("Error al cargar las meseras:", error);
            } finally {
                setIsInitialized(true);
            }
        };

        fetchMeseras();
    }, []);

    // Recuperar estado de la sesión al recargar la página
    useEffect(() => {
        const storedMesera = sessionStorage.getItem('selectedMesera');
        const storedCodigoConfirmado = sessionStorage.getItem('codigoConfirmado');

        if (storedMesera && storedCodigoConfirmado) {
            setSelectedMesera(JSON.parse(storedMesera));
            setCodigoConfirmado(true);
        }
    }, []);

    const handleSelectMesera = useCallback((meseraSeleccionada) => {
        // meseraSeleccionada es ahora el objeto completo
        setSelectedMesera(meseraSeleccionada);
    }, []);

    const handleCodigoSubmit = useCallback((codigo) => {
        if (selectedMesera && selectedMesera.codigo === codigo) {
            setCodigoConfirmado(true);
            // Guardar en sessionStorage para persistir la sesión
            sessionStorage.setItem('selectedMesera', JSON.stringify(selectedMesera));
            sessionStorage.setItem('codigoConfirmado', 'true');
            return true;
        }
        alert('Código incorrecto. Inténtalo de nuevo.');
        return false;
    }, [selectedMesera]);

    const handleLogout = useCallback(() => {
        setSelectedMesera(null);
        setCodigoConfirmado(false);
        // Limpiar sessionStorage
        sessionStorage.removeItem('selectedMesera');
        sessionStorage.removeItem('codigoConfirmado');
    }, []);

    const addMesera = async (nombre, codigo) => {
        try {
            const response = await axios.post(API_URL, { nombre, codigo });
            const nuevaMesera = response.data;
            // Actualizar la lista de meseras en el estado para que aparezca inmediatamente
            setMeseras(prevMeseras => [nuevaMesera, ...prevMeseras]);
            // Seleccionar automáticamente la nueva mesera
            handleSelectMesera(nuevaMesera);
            return { success: true };
        } catch (error) {
            console.error("Error al agregar la mesera:", error.response?.data || error.message);
            // Lógica mejorada para mostrar el mensaje de error correcto
            const errorData = error.response?.data;
            let errorMessage = "Error al crear la mesera.";
            if (errorData?.nombre) errorMessage = `Nombre: ${errorData.nombre[0]}`;
            else if (errorData?.codigo) errorMessage = `Código: ${errorData.codigo[0]}`;

            return { success: false, message: errorMessage };
        }
    };

    return {
        mesera: selectedMesera?.nombre, // Devuelve solo el nombre para la UI
        meseraId: selectedMesera?.id,   // Devuelve el ID para las llamadas a la API
        codigoConfirmado,
        isInitialized,
        meseras, // La lista completa de objetos de meseras
        handleSelectMesera,
        handleCodigoSubmit,
        handleLogout,
        addMesera, // Exponemos la nueva función
        error,
        selectedMeseraObject: selectedMesera
    };
};