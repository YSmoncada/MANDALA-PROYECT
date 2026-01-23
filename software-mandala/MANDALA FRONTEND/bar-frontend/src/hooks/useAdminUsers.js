import { useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';
import { toast } from 'sonner';

/**
 * Hook to manage administration of users and profiles (staff).
 */
export const useAdminUsers = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [meseras, setMeseras] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch meseras first (usually allowed for more roles or handled separately)
            try {
                const meserasRes = await apiClient.get('/meseras/');
                setMeseras(meserasRes.data);
            } catch (err) {
                console.error("Error loading meseras:", err);
            }

            // Fetch system users (requires superuser/staff)
            try {
                const usersRes = await apiClient.get('/usuarios/');
                setUsuarios(usersRes.data);
            } catch (err) {
                // If it's a 403, we just don't show system users, but don't break the whole page
                if (err.response?.status === 403) {
                    console.log("Acceso restringido a usuarios del sistema.");
                } else {
                    console.error("Error loading system users:", err);
                }
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const updateCredentials = async (id, type, newValue) => {
        const isUser = type === 'usuario';
        try {
            if (isUser) {
                await apiClient.post(`/usuarios/${id}/cambiar-password/`, {
                    password: newValue
                });
            } else {
                await apiClient.post(`/meseras/${id}/cambiar-codigo/`, {
                    codigo: newValue
                });
            }
            toast.success(`${isUser ? 'Contraseña' : 'Código'} actualizado correctamente.`);
            fetchData();
            return { success: true };
        } catch (error) {
            console.error("Error al actualizar credenciales:", error);
            return { success: false, error };
        }
    };

    const deleteItem = async (id, type) => {
        try {
            if (type === 'usuario') {
                await apiClient.delete(`/usuarios/${id}/`);
            } else {
                await apiClient.delete(`/meseras/${id}/`);
            }
            toast.success("Eliminado correctamente.");
            fetchData();
            return { success: true };
        } catch (error) {
            console.error("Error al eliminar:", error);
            return { success: false, error };
        }
    };

    return {
        usuarios,
        meseras,
        loading,
        updateCredentials,
        deleteItem,
        refresh: fetchData
    };
};
