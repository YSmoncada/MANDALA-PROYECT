import { Package, ClipboardList, SquareKanban, History, GlassWater, DollarSign, Users } from "lucide-react";

export const ALL_MODULES = [
    {
        id: 'inventario',
        icon: Package,
        label: "Inventario",
        path: "/inventario",
        color: "from-cyan-400 to-blue-500",
        allowedRoles: ['admin', 'prueba']
    },
    {
        id: 'pedidos',
        icon: ClipboardList,
        label: "Pedidos",
        path: "/pedidos-disco",
        color: "from-pink-400 to-rose-500",
        allowedRoles: ['admin', 'bartender', 'mesera', 'prueba']
    },
    {
        id: 'mesas',
        icon: SquareKanban,
        label: "Mesas",
        path: "/mesas",
        color: "from-purple-400 to-fuchsia-500",
        allowedRoles: ['admin', 'prueba']
    },
    {
        id: 'historial',
        icon: History,
        label: "Historial",
        path: "/historial-pedidos",
        color: "from-yellow-400 to-orange-500",
        allowedRoles: ['admin', 'prueba']
    },
    {
        id: 'bartender',
        icon: GlassWater,
        label: "Bartender",
        path: "/bartender",
        color: "from-green-400 to-emerald-500",
        allowedRoles: ['admin', 'bartender', 'prueba']
    },
    {
        id: 'contabilidad',
        icon: DollarSign,
        label: "Contabilidad",
        path: "/contabilidad-disco",
        color: "from-indigo-400 to-violet-500",
        allowedRoles: ['admin', 'prueba']
    },
    {
        id: 'usuarios',
        icon: Users,
        label: "Usuarios",
        path: "/usuarios-disco",
        color: "from-orange-400 to-red-500",
        allowedRoles: ['admin', 'prueba']
    },
];
