import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../apiConfig';

const MESAS_API_URL = `${API_URL}/mesas/`;
const MESEROS_API_URL = `${API_URL}/meseras/`;

/**
 * Hook to manage mesas and staff (meseros) data and actions.
 */
export const useMesasManagement = (authToken) => {
    const [mesas, setMesas] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const [mesasRes, meserosRes] = await Promise.all([
                axios.get(MESAS_API_URL),
                axios.get(MESEROS_API_URL)
            ]);
            setMesas(mesasRes.data);
            setStaff(meserosRes.data);
        } catch (error) {
            console.error("Error al cargar los datos:", error);
            toast.error("No se pudieron cargar los datos.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddMesa = async (mesaData) => {
        try {
            await axios.post(MESAS_API_URL, mesaData, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            toast.success('¡Mesa guardada con éxito!');
            fetchData();
        } catch (error) {
            console.error("Error al agregar la mesa:", error.response?.data || error.message);
            toast.error(`Error: ${error.response?.data?.numero?.[0] || 'No se pudo guardar la mesa.'}`);
        }
    };

    const handleDeleteMesa = async (id) => {
        try {
            await axios.delete(`${MESAS_API_URL}${id}/`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            toast.success('Mesa eliminada correctamente.');
            fetchData();
        } catch (error) {
            console.error("Error al eliminar la mesa:", error);
            toast.error(error.response?.data?.detail || 'No se pudo eliminar la mesa. Es posible que tenga pedidos asociados.');
        }
    };

    const handleDeleteStaff = async (staffId) => {
        try {
            await axios.delete(`${MESEROS_API_URL}${staffId}/`);
            toast.success('Perfil eliminado correctamente.');
            setStaff(current => current.filter(s => s.id !== staffId));
        } catch (error) {
            console.error("Error al eliminar el perfil:", error);
            toast.error(error.response?.data?.error || 'No se pudo eliminar el perfil.');
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
