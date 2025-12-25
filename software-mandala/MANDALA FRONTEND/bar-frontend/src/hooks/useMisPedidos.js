import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../apiConfig';

export const useMisPedidos = (userId, role) => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchMisPedidos = async () => {
            try {
                const d = new Date();
                const offset = d.getTimezoneOffset();
                const localDate = new Date(d.getTime() - (offset * 60 * 1000));
                const hoy = localDate.toISOString().split('T')[0];
                const isSystemUser = role === 'admin' || role === 'bartender' || role === 'prueba';

                // Si es admin/bartender usamos el filtro 'usuario', si es mesera usamos 'mesera'
                const filterParam = isSystemUser ? `usuario=${userId}` : `mesera=${userId}`;

                const response = await axios.get(`${API_URL}/pedidos/?${filterParam}&fecha=${hoy}`);
                const sorted = response.data.sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora));
                setPedidos(sorted);
            } catch (error) {
                console.error('Error fetching orders:', error);
                // Opcional: podrías añadir un estado de error aquí
            } finally {
                setLoading(false);
            }
        };

        fetchMisPedidos();
        const interval = setInterval(fetchMisPedidos, 15000); // Auto-refresh

        // Limpieza al desmontar el componente
        return () => clearInterval(interval);
    }, [userId, role]);

    return { pedidos, loading };
};