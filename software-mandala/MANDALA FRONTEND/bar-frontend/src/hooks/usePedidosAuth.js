import { useState, useEffect, useCallback, useMemo } from 'react';
import apiClient from '../utils/apiClient';

/**
 * Hook to manage authentication and user profiles (staff/admin/bartender).
 * Refactored to be generic (not just meseras).
 */
export const usePedidosAuth = () => {
    const [profiles, setProfiles] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [codigoConfirmado, setCodigoConfirmado] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null);

    // Fetch staff profiles on mount
    const fetchProfiles = useCallback(async () => {
        try {
            const response = await apiClient.get('/meseras/'); // Still using /meseras/ endpoint from backend
            setProfiles(response.data);
        } catch (error) {
            setError("No se pudo conectar con el servidor para cargar los perfiles.");
            console.error("Error loading profiles:", error);
        } finally {
            setIsInitialized(true);
        }
    }, []);

    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles]);

    // Recover session state
    useEffect(() => {
        const storedProfile = sessionStorage.getItem('selectedProfile') || sessionStorage.getItem('selectedMesera');
        const storedCodigoConfirmado = sessionStorage.getItem('codigoConfirmado');
        const storedRole = sessionStorage.getItem('userRole');

        if (storedRole) {
            setUserRole(storedRole);
        }

        if (storedProfile && storedCodigoConfirmado === 'true') {
            setSelectedProfile(JSON.parse(storedProfile));
            setCodigoConfirmado(true);
            if (!storedRole) setUserRole('mesera');
        }
    }, []);

    const handleSelectProfile = useCallback((profile) => {
        setSelectedProfile(profile);
    }, []);

    const handleCodigoSubmit = useCallback(async (codigo) => {
        if (!selectedProfile) return false;

        try {
            const response = await apiClient.post('/verificar-codigo-mesera/', {
                mesera_id: selectedProfile.id,
                codigo: codigo
            });

            if (response.data.success) {
                setCodigoConfirmado(true);
                // Keep 'mesera' as the internal role for permission compatibility
                const role = 'mesera'; 
                setUserRole(role);

                sessionStorage.setItem('selectedProfile', JSON.stringify(selectedProfile));
                sessionStorage.setItem('codigoConfirmado', 'true');
                sessionStorage.setItem('userRole', role);
                return true;
            }
        } catch (error) {
            console.error("Error verifying code:", error);
            return false;
        }
        return false;
    }, [selectedProfile]);

    const loginSystem = useCallback(async (username, password) => {
        try {
            const response = await apiClient.post('/login/', { username, password });
            
            let finalRole = response.data?.role;
            const responseUsername = response.data?.username;

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
            
            setSelectedProfile(sysUser);
            setCodigoConfirmado(true);
            
            sessionStorage.setItem('userRole', finalRole);
            sessionStorage.setItem('selectedProfile', JSON.stringify(sysUser));
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
        setSelectedProfile(null);
        setCodigoConfirmado(false);
        setUserRole(null);
        sessionStorage.clear();
    }, []);

    const addProfile = useCallback(async (nombre, codigo) => {
        try {
            const response = await apiClient.post('/meseras/', { nombre, codigo });
            const nuevoPerfil = response.data;
            setProfiles(prev => [nuevoPerfil, ...prev]);
            handleSelectProfile(nuevoPerfil);
            return { success: true };
        } catch (error) {
            console.error("Error adding profile:", error.response?.data || error.message);
            const errorData = error.response?.data;
            let errorMessage = "Error al crear el perfil.";
            if (errorData?.nombre) errorMessage = `Nombre: ${errorData.nombre[0]}`;
            else if (errorData?.codigo) errorMessage = `Código: ${errorData.codigo[0]}`;

            return { success: false, message: errorMessage };
        }
    }, [handleSelectProfile]);

    const deleteProfile = useCallback(async (profileId) => {
        try {
            await apiClient.delete(`/meseras/${profileId}/`);
            setProfiles(prev => prev.filter(p => p.id !== profileId));
            if (selectedProfile?.id === profileId) {
                handleLogout();
            }
            return { success: true };
        } catch (error) {
            console.error("Error deleting profile:", error.response?.data || error.message);
            return { success: false, message: error.response?.data?.detail || "No se pudo eliminar el perfil." };
        }
    }, [selectedProfile, handleLogout]);

    const authValue = useMemo(() => ({
        // Maintain 'mesera' related keys for backward compatibility but add generic ones
        userName: selectedProfile?.nombre,
        userId: selectedProfile?.id,
        mesera: selectedProfile?.nombre, // Deprecated alias
        meseraId: selectedProfile?.id,   // Deprecated alias
        
        codigoConfirmado,
        userRole,
        role: userRole,
        isInitialized,
        
        profiles,
        meseras: profiles, // Deprecated alias
        
        handleSelectProfile,
        handleSelectMesera: handleSelectProfile, // Deprecated alias
        
        handleCodigoSubmit,
        loginSystem,
        handleLogout,
        
        addProfile,
        addMesera: addProfile, // Deprecated alias
        
        deleteProfile,
        deleteMesera: deleteProfile, // Deprecated alias
        
        error,
        selectedProfileObject: selectedProfile
    }), [
        selectedProfile, 
        codigoConfirmado, 
        userRole, 
        isInitialized, 
        profiles, 
        handleSelectProfile, 
        handleCodigoSubmit, 
        loginSystem, 
        handleLogout, 
        addProfile, 
        deleteProfile, 
        error
    ]);

    return authValue;
};