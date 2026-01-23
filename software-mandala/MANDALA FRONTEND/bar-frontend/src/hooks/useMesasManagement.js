import { useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';
import { toast } from 'sonner';

/**
 * Hook to manage mesas and staff data and actions using apiClient for auto-auth.
 */
export const useMesasManagement = () => {
    const [mesas, setMesas] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            // Use apiClient to ensure the 'Authorization: Token <key>' header is added automatically
            const [mesasRes, meserosRes] = await Promise.all([
                apiClient.get('/mesas/'),
                apiClient.get('/meseras/')
            ]);
            setMesas(mesasRes.data);
            setStaff(meserosRes.data);
        } catch (error) {
            console.error("Error al cargar los datos:", error);
            // Error visual handled by apiClient interceptor
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddMesa = async (mesaData) => {
        try {
            await apiClient.post('/mesas/', mesaData);
            toast.success('¡Mesa guardada con éxito!');
            fetchData();
        } catch (error) {
            console.error("Error al agregar la mesa:", error);
        }
    };

    const handleDeleteMesa = async (id) => {
        try {
            await apiClient.delete(`/mesas/${id}/`);
            toast.success('Mesa eliminada correctamente.');
            fetchData();
        } catch (error) {
            console.error("Error al eliminar la mesa:", error);
        }
    };

    const handleDeleteStaff = async (staffId) => {
        try {
            await apiClient.delete(`/meseras/${staffId}/`);
            toast.success('Perfil eliminado correctamente.');
            setStaff(current => current.filter(s => s.id !== staffId));
        } catch (error) {
            console.error("Error al eliminar el perfil:", error);
        }
    };

    return {
        mesas,
        staff,
        loading,
        handleAddMesa,
        handleDeleteMesa,
        handleDeleteStaff,
        refresh: fetchData
    };
};
