import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, ClipboardList, SquareKanban, History, GlassWater, DollarSign } from "lucide-react";
import { usePedidosContext } from "../../context/PedidosContext";

// Toda la lógica de negocio se encapsula en este hook.
export const useHomeLogic = () => {
    const navigate = useNavigate();
    const { auth } = usePedidosContext();
    const { isInitialized, codigoConfirmado, handleLogout, mesera, role } = auth;

    // Efecto para redirigir si el usuario no está autenticado.
    useEffect(() => {
        if (isInitialized && !role && !codigoConfirmado) {
            navigate('/login', { replace: true });
        }
    }, [isInitialized, role, codigoConfirmado, navigate]);

    // Definición centralizada de todos los módulos disponibles en la aplicación.
    const allModules = [
        {
            id: 'inventario',
            icon: Package,
            label: "Inventario",
            path: "/inventario",
            color: "from-cyan-400 to-blue-500",
            allowedRoles: ['admin', 'mesera']
        },
        {
            id: 'pedidos',
            icon: ClipboardList,
            label: "Pedidos",
            path: "/pedidos-disco",
            color: "from-pink-400 to-rose-500",
            allowedRoles: ['admin', 'bartender', 'mesera']
        },
        {
            id: 'mesas',
            icon: SquareKanban,
            label: "Mesas",
            path: "/mesas",
            color: "from-purple-400 to-fuchsia-500",
            allowedRoles: ['admin', 'mesera']
        },
        {
            id: 'historial',
            icon: History,
            label: "Historial",
            path: "/historial-pedidos",
            color: "from-yellow-400 to-orange-500",
            allowedRoles: ['admin', 'mesera']
        },
        {
            id: 'bartender',
            icon: GlassWater,
            label: "Bartender",
            path: "/bartender",
            color: "from-green-400 to-emerald-500",
            allowedRoles: ['admin', 'bartender']
        },
        {
            id: 'contabilidad',
            icon: DollarSign,
            label: "Contabilidad",
            path: "/contabilidad-disco",
            color: "from-indigo-400 to-violet-500",
            allowedRoles: ['admin', 'mesera']
        },
    ];

    // Lógica para determinar los módulos visibles según el rol del usuario.
    const currentRole = role || (codigoConfirmado ? 'mesera' : null);
    const visibleModules = currentRole ? allModules.filter(m => m.allowedRoles.includes(currentRole)) : [];

    // El hook devuelve solo lo que el componente necesita para renderizar.
    return { isInitialized, visibleModules, mesera, handleLogout, navigate };
};