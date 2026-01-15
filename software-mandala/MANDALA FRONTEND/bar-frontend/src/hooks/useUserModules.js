import { useMemo } from 'react';
import { usePedidosContext } from '../context/PedidosContext';
import { ALL_MODULES } from '../constants/navigation';

/**
 * Hook para gestionar los módulos visibles del usuario según su rol.
 * Centraliza la lógica de permisos para que pueda usarse en el dashboard,
 * barras laterales o cualquier menú de navegación.
 */
export const useUserModules = () => {
    const { auth } = usePedidosContext();
    const { codigoConfirmado, userRole, role, handleLogout } = auth;

    const visibleModules = useMemo(() => {
        // Determinamos el rol actual basándonos en las diferentes fuentes posibles
        const currentRole = role || userRole || (codigoConfirmado ? 'mesera' : null);
        
        if (!currentRole) return [];

        // Filtramos la lista maestra de botones según los roles permitidos
        return ALL_MODULES.filter(m => m.allowedRoles.includes(currentRole));
    }, [role, userRole, codigoConfirmado]);

    return {
        visibleModules,
        handleLogout,
        auth
    };
};
