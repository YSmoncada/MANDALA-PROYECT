import { useState, useEffect, useCallback, useMemo } from 'react';
import apiClient from '../utils/apiClient';

/**
 * Hook to manage accounting logic, fetching sales data and reports.
 */
export const useAccounting = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [ventasDiarias, setVentasDiarias] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/reportes/ventas-diarias/');
            const rawVentas = Array.isArray(response.data) ? response.data : [];
            const safeVentas = rawVentas.filter(v => v && typeof v === 'object');
            setVentasDiarias(safeVentas);
        } catch (error) {
            console.error("Error loading accounting data:", error);
            setVentasDiarias([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const stats = useMemo(() => {
        const totalVentas = ventasDiarias.reduce((acc, curr) => {
            const val = parseFloat(curr?.total_ventas || 0);
            return acc + (isNaN(val) ? 0 : val);
        }, 0);

        const totalImpuestos = totalVentas > 0 ? totalVentas - (totalVentas / 1.08) : 0;
        const gananciaEstimada = totalVentas > 0 ? totalVentas / 1.08 : 0;

        return {
            totalVentas,
            totalImpuestos,
            gananciaEstimada
        };
    }, [ventasDiarias]);

    return {
        activeTab,
        setActiveTab,
        ventasDiarias,
        loading,
        stats,
        refresh: fetchDashboardData
    };
};
