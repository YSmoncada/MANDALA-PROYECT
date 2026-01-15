import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';

/**
 * VerificadorDeAcceso se encarga de proteger la ruta principal.
 * Si el usuario no tiene permisos, lo redirige al login.
 */
const VerificadorDeAcceso = ({ auth, children }) => {
    const { isInitialized, role, userRole, codigoConfirmado } = auth;
    const navigate = useNavigate();

    const hasAccess = role || userRole || codigoConfirmado;
    const shouldRedirect = isInitialized && !hasAccess;

    useEffect(() => {
        if (shouldRedirect) {
            navigate('/login', { replace: true });
        }
    }, [shouldRedirect, navigate]);

    if (!isInitialized || shouldRedirect) {
        return <LoadingSpinner message="Verificando sesión..." />;
    }

    return children;
};

export default VerificadorDeAcceso;
