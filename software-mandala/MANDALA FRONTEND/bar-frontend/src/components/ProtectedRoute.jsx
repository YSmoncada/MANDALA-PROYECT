import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { usePedidosContext } from '../context/PedidosContext';

import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { auth } = usePedidosContext();
    const { isInitialized, role, userRole } = auth;
    const navigate = useNavigate();

    const currentRole = role || userRole;

    useEffect(() => {
        if (isInitialized) {
            // Solo actuar si NO estamos en proceso de logout (es decir, si existe un rol o se esperaba uno)
            if (!currentRole) {
                // Si no hay rol, redirigir al login sin mostrar error (podría ser un logout normal)
                navigate('/login', { replace: true });
            } else if (!allowedRoles.includes(currentRole)) {
                // Si hay un rol pero no está permitido, entonces sí es Acceso Denegado
                toast.error('Acceso Denegado. No tienes permiso para ver esta página.');
                navigate('/', { replace: true });
            }
        }
    }, [isInitialized, currentRole, navigate, allowedRoles]);

    if (!isInitialized) {
        return <LoadingSpinner message="Verificando permisos..." />;
    }

    // Si el rol es válido, renderiza el componente hijo (la página)
    if (currentRole && allowedRoles.includes(currentRole)) {
        return children;
    }

    return <LoadingSpinner message="Redirigiendo..." />;
};

export default ProtectedRoute;