import { useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';
import toast from 'react-hot-toast';

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
            const [usersRes, meserasRes] = await Promise.all([
                apiClient.get('/usuarios/'),
                apiClient.get('/meseras/')
            ]);
            setUsuarios(usersRes.data);
            setMeseras(meserasRes.data);
        } catch (error) {
            console.error("Error al cargar datos de administración:", error);
            // Error handling is partly handled by apiClient interceptor
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
