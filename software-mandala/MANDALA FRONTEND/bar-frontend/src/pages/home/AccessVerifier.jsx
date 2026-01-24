import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';

/**
 * AccessVerifier handles root route protection.
 * If the user has no permissions, it redirects them to login.
 */
const AccessVerifier = ({ auth, children }) => {
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
        return null;
    }

    return children;
};

export default AccessVerifier;
