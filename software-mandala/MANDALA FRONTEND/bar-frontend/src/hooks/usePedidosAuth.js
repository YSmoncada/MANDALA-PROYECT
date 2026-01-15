import { useState, useEffect, useCallback, useMemo } from 'react';
import apiClient from '../utils/apiClient';

/**
 * Hook to manage authentication and user profiles (meseras/admin/bartender).
 */
export const usePedidosAuth = () => {
    const [meseras, setMeseras] = useState([]);
    const [selectedMesera, setSelectedMesera] = useState(null);
    const [codigoConfirmado, setCodigoConfirmado] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null);

    // Fetch meseras on mount
    const fetchMeseras = useCallback(async () => {
        try {
            const response = await apiClient.get('/meseras/');
            setMeseras(response.data);
        } catch (error) {
            setError("No se pudo conectar con el servidor para cargar las meseras.");
            console.error("Error loading meseras:", error);
        } finally {
            setIsInitialized(true);
        }
    }, []);

    useEffect(() => {
        fetchMeseras();
    }, [fetchMeseras]);

    // Recover session state
    useEffect(() => {
        const storedMesera = sessionStorage.getItem('selectedMesera');
        const storedCodigoConfirmado = sessionStorage.getItem('codigoConfirmado');
        const storedRole = sessionStorage.getItem('userRole');

        if (storedRole) {
            setUserRole(storedRole);
        }

        if (storedMesera && storedCodigoConfirmado === 'true') {
            setSelectedMesera(JSON.parse(storedMesera));
            setCodigoConfirmado(true);
            if (!storedRole) setUserRole('mesera');
        }
    }, []);

    const handleSelectMesera = useCallback((meseraSeleccionada) => {
        setSelectedMesera(meseraSeleccionada);
    }, []);

    const handleCodigoSubmit = useCallback(async (codigo) => {
        if (!selectedMesera) return false;

        try {
            const response = await apiClient.post('/verificar-codigo-mesera/', {
                mesera_id: selectedMesera.id,
                codigo: codigo
            });

            if (response.data.success) {
                setCodigoConfirmado(true);
                setUserRole('mesera');

                sessionStorage.setItem('selectedMesera', JSON.stringify(selectedMesera));
                sessionStorage.setItem('codigoConfirmado', 'true');
                sessionStorage.setItem('userRole', 'mesera');
                return true;
            }
        } catch (error) {
            console.error("Error verifying code:", error);
            return false;
        }
        return false;
    }, [selectedMesera]);

    const loginSystem = useCallback(async (username, password) => {
        try {
            const response = await apiClient.post('/login/', { username, password });
            
            let finalRole = response.data?.role;
            const responseUsername = response.data?.username;

            // Security patch for 'barra' user
            if (username === 'barra') {
                finalRole = 'bartender';
            }

            if (!finalRole || !['admin', 'bartender', 'prueba'].includes(finalRole)) {
                return { success: false, message: 'El servidor devolvió un rol inválido o nulo.' };
            }

            setUserRole(finalRole);
            const token = response.data.token;
            const sysUser = {
                id: response.data.user_id,
                nombre: responseUsername,
                role: finalRole
            };
            
            setSelectedMesera(sysUser);
            setCodigoConfirmado(true);
            
            sessionStorage.setItem('userRole', finalRole);
            sessionStorage.setItem('selectedMesera', JSON.stringify(sysUser));
            sessionStorage.setItem('codigoConfirmado', 'true');
            if (token) {
                sessionStorage.setItem('authToken', token);
            }
            return { success: true, role: finalRole };
        } catch (error) {
            console.error("Login error:", error);
            return { 
                success: false, 
                message: error.response?.data?.detail || error.response?.data?.message || "Error de conexión con el servidor" 
            };
        }
    }, []);

    const handleLogout = useCallback(() => {
        setSelectedMesera(null);
        setCodigoConfirmado(false);
        setUserRole(null);
        sessionStorage.clear();
    }, []);

    const addMesera = useCallback(async (nombre, codigo) => {
        try {
            const response = await apiClient.post('/meseras/', { nombre, codigo });
            const nuevaMesera = response.data;
            setMeseras(prev => [nuevaMesera, ...prev]);
            handleSelectMesera(nuevaMesera);
            return { success: true };
        } catch (error) {
            console.error("Error adding mesera:", error.response?.data || error.message);
            const errorData = error.response?.data;
            let errorMessage = "Error al crear la mesera.";
            if (errorData?.nombre) errorMessage = `Nombre: ${errorData.nombre[0]}`;
            else if (errorData?.codigo) errorMessage = `Código: ${errorData.codigo[0]}`;

            return { success: false, message: errorMessage };
        }
    }, [handleSelectMesera]);

    const deleteMesera = useCallback(async (meseraId) => {
        try {
            await apiClient.delete(`/meseras/${meseraId}/`);
            setMeseras(prev => prev.filter(m => m.id !== meseraId));
            if (selectedMesera?.id === meseraId) {
                handleLogout();
            }
            return { success: true };
        } catch (error) {
            console.error("Error deleting mesera:", error.response?.data || error.message);
            return { success: false, message: error.response?.data?.detail || "No se pudo eliminar la mesera." };
        }
    }, [selectedMesera, handleLogout]);

    const authValue = useMemo(() => ({
        mesera: selectedMesera?.nombre,
        meseraId: selectedMesera?.id,
        codigoConfirmado,
        userRole,
        role: userRole,
        isInitialized,
        meseras,
        handleSelectMesera,
        handleCodigoSubmit,
        loginSystem,
        handleLogout,
        addMesera,
        deleteMesera,
        error,
        selectedMeseraObject: selectedMesera
    }), [
        selectedMesera, 
        codigoConfirmado, 
        userRole, 
        isInitialized, 
        meseras, 
        handleSelectMesera, 
        handleCodigoSubmit, 
        loginSystem, 
        handleLogout, 
        addMesera, 
        deleteMesera, 
        error
    ]);

    return authValue;
};