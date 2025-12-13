// src/hooks/usePedidosAuth.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../apiConfig';

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
                const response = await axios.get(`${API_URL}/meseras/`); // Ya estaba bien, pero se confirma
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
            const response = await axios.post(`${API_URL}/meseras/`, { nombre, codigo }); // Ya estaba bien, pero se confirma
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

    const deleteMesera = async (meseraId) => {
        try {
            await axios.delete(`${API_URL}/meseras/${meseraId}/`);
            // Actualiza el estado para remover la mesera de la lista en la UI
            setMeseras(prevMeseras => prevMeseras.filter(m => m.id !== meseraId));
            // Si la mesera eliminada era la que estaba seleccionada, se desloguea
            if (selectedMesera?.id === meseraId) {
                handleLogout();
            }
            return { success: true };
        } catch (error) {
            console.error("Error al eliminar la mesera:", error.response?.data || error.message);
            const errorMessage = error.response?.data?.detail || "No se pudo eliminar la mesera. Es posible que tenga pedidos asociados.";
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
        addMesera, // Función para agregar
        deleteMesera, // Exponemos la nueva función para eliminar
        error,
        selectedMeseraObject: selectedMesera
    };
};