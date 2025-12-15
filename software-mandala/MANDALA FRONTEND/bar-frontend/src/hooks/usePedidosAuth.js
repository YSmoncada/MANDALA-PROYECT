// src/hooks/usePedidosAuth.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../apiConfig';

export const usePedidosAuth = () => {
    const [userRole, setUserRole] = useState(null); // 'admin', 'bartender', 'mesera', null

    // Cargar meseras desde la API al iniciar
    useEffect(() => {
        const fetchMeseras = async () => {
            try {
                const response = await axios.get(`${API_URL}/meseras/`);
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
        const storedRole = sessionStorage.getItem('userRole');

        if (storedRole) {
            setUserRole(storedRole);
        }

        if (storedMesera && storedCodigoConfirmado) {
            setSelectedMesera(JSON.parse(storedMesera));
            setCodigoConfirmado(true);
            if (!storedRole) setUserRole('mesera'); // Fallback legacy
        }
    }, []);

    const handleSelectMesera = useCallback((meseraSeleccionada) => {
        setSelectedMesera(meseraSeleccionada);
    }, []);

    const handleCodigoSubmit = useCallback((codigo) => {
        if (selectedMesera && selectedMesera.codigo === codigo) {
            setCodigoConfirmado(true);
            setUserRole('mesera');

            sessionStorage.setItem('selectedMesera', JSON.stringify(selectedMesera));
            sessionStorage.setItem('codigoConfirmado', 'true');
            sessionStorage.setItem('userRole', 'mesera');
            return true;
        }
        return false;
    }, [selectedMesera]);

    const loginSystem = async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/login/`, { username, password });
            if (response.data.success) {
                const { role, username: dbUsername } = response.data;
                setUserRole(role);
                // Set fake mesera object for compatibility with components that display name
                const sysUser = { id: 'sys', nombre: dbUsername, role: role };
                setSelectedMesera(sysUser);
                setCodigoConfirmado(true);

                sessionStorage.setItem('userRole', role);
                sessionStorage.setItem('selectedMesera', JSON.stringify(sysUser));
                sessionStorage.setItem('codigoConfirmado', 'true');
                return { success: true, role };
            }
            return { success: false, message: 'Invalid credentials' };
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: error.response?.data?.detail || "Error de conexión" };
        }
    };

    const handleLogout = useCallback(() => {
        setSelectedMesera(null);
        setCodigoConfirmado(false);
        setUserRole(null);

        sessionStorage.removeItem('selectedMesera');
        sessionStorage.removeItem('codigoConfirmado');
        sessionStorage.removeItem('userRole');
    }, []);

    const addMesera = async (nombre, codigo) => {
        try {
            const response = await axios.post(`${API_URL}/meseras/`, { nombre, codigo });
            const nuevaMesera = response.data;
            setMeseras(prevMeseras => [nuevaMesera, ...prevMeseras]);
            handleSelectMesera(nuevaMesera);
            return { success: true };
        } catch (error) {
            console.error("Error al agregar la mesera:", error.response?.data || error.message);
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
            setMeseras(prevMeseras => prevMeseras.filter(m => m.id !== meseraId));
            if (selectedMesera?.id === meseraId) {
                handleLogout();
            }
            return { success: true };
        } catch (error) {
            console.error("Error al eliminar la mesera:", error.response?.data || error.message);
            const errorMessage = error.response?.data?.detail || "No se pudo eliminar la mesera.";
            return { success: false, message: errorMessage };
        }
    };

    return {
        mesera: selectedMesera?.nombre,
        meseraId: selectedMesera?.id,
        codigoConfirmado,
        userRole, // Expose role
        isInitialized,
        meseras,
        handleSelectMesera,
        handleCodigoSubmit,
        loginSystem, // Expose loginSystem
        handleLogout,
        addMesera,
        deleteMesera,
        error,
        selectedMeseraObject: selectedMesera
    };
};