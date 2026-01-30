import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FileText, Plus, Edit2, Trash2, Search } from 'lucide-react';

const initialPUC = [
    {
        code: '1', name: 'ACTIVO', type: 'Clase', children: [
            {
                code: '11', name: 'DISPONIBLE', type: 'Grupo', children: [
                    {
                        code: '1105', name: 'Caja', type: 'Cuenta', children: [
                            { code: '110505', name: 'Caja General', type: 'Subcuenta' },
                            { code: '110510', name: 'Cajas Menores', type: 'Subcuenta' }
                        ]
                    },
                    { code: '1110', name: 'Bancos', type: 'Cuenta', children: [] }
                ]
            },
            {
                code: '13', name: 'DEUDORES', type: 'Grupo', children: [
                    {
                        code: '1355', name: 'Anticipo de Impuestos', type: 'Cuenta', children: [
                            { code: '135515', name: 'Retención en la fuente (Anticipo)', type: 'Subcuenta' }
                        ]
                    }
                ]
            },
            {
                code: '14', name: 'INVENTARIOS', type: 'Grupo', children: [
                    {
                        code: '1435', name: 'Mercancías no fabricadas por la empresa', type: 'Cuenta', children: [
                            { code: '143501', name: 'Licores y Bebidas', type: 'Subcuenta' },
                            { code: '143502', name: 'Insumos y Mezcladores', type: 'Subcuenta' },
                            { code: '143503', name: 'Cigarrillos y Varios', type: 'Subcuenta' }
                        ]
                    }
                ]
            },
            {
                code: '15', name: 'PROPIEDAD PLANTA Y EQUIPO', type: 'Grupo', children: [
                    { code: '1524', name: 'Equipo de Oficina', type: 'Cuenta' },
                    { code: '1528', name: 'Equipo de Computación y Comunicación', type: 'Cuenta' },
                    { code: '1540', name: 'Flota y Equipo de Transporte', type: 'Cuenta' }
                ]
            }
        ]
    },
    {
        code: '2', name: 'PASIVO', type: 'Clase', children: [
            {
                code: '22', name: 'PROVEEDORES', type: 'Grupo', children: [
                    { code: '2205', name: 'Nacionales', type: 'Cuenta' }
                ]
            },
            {
                code: '23', name: 'CUENTAS POR PAGAR', type: 'Grupo', children: [
                    { code: '2335', name: 'Costos y Gastos por Pagar', type: 'Cuenta' },
                    {
                        code: '2365', name: 'Retención en la Fuente', type: 'Cuenta', children: [
                            { code: '236515', name: 'Honorarios', type: 'Subcuenta' },
                            { code: '236525', name: 'Servicios', type: 'Subcuenta' },
                            { code: '236540', name: 'Compras', type: 'Subcuenta' }
                        ]
                    }
                ]
            },
            {
                code: '24', name: 'IMPUESTOS, GRAVÁMENES Y TASAS', type: 'Grupo', children: [
                    {
                        code: '2408', name: 'Impuesto sobre las Ventas por Pagar (IVA)', type: 'Cuenta', children: [
                            { code: '240801', name: 'IVA Generado (Ventas)', type: 'Subcuenta' },
                            { code: '240802', name: 'IVA Descontable (Compras)', type: 'Subcuenta' }
                        ]
                    },
                    {
                        code: '2495', name: 'Impuesto Nacional al Consumo', type: 'Cuenta', children: [
                            { code: '249501', name: 'Impoconsumo Generado', type: 'Subcuenta' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        code: '3', name: 'PATRIMONIO', type: 'Clase', children: [
            {
                code: '31', name: 'CAPITAL SOCIAL', type: 'Grupo', children: []
            }
        ]
    },
    {
        code: '4', name: 'INGRESOS', type: 'Clase', children: [
            {
                code: '41', name: 'OPERACIONALES', type: 'Grupo', children: [
                    {
                        code: '4135', name: 'Comercio al por mayor y al por menor', type: 'Cuenta', children: [
                            { code: '413501', name: 'Venta de Licores', type: 'Subcuenta' },
                            { code: '413502', name: 'Venta de Cocteles', type: 'Subcuenta' },
                            { code: '413503', name: 'Cover / Entradas', type: 'Subcuenta' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        code: '5', name: 'GASTOS', type: 'Clase', children: [
            {
                code: '51', name: 'OPERACIONALES DE ADMINISTRACIÓN', type: 'Grupo', children: [
                    {
                        code: '5105', name: 'Gastos de Personal', type: 'Cuenta', children: [
                            { code: '510506', name: 'Sueldos', type: 'Subcuenta' },
                            { code: '510515', name: 'Horas Extras y Recargos', type: 'Subcuenta' }
                        ]
                    },
                    { code: '5120', name: 'Arrendamientos', type: 'Cuenta' },
                    {
                        code: '5135', name: 'Servicios', type: 'Cuenta', children: [
                            { code: '513525', name: 'Acueducto y Alcantarillado', type: 'Subcuenta' },
                            { code: '513530', name: 'Energía Eléctrica', type: 'Subcuenta' },
                            { code: '513535', name: 'Teléfono', type: 'Subcuenta' },
                            { code: '513540', name: 'Internet', type: 'Subcuenta' }
                        ]
                    }
                ]
            },
            {
                code: '52', name: 'OPERACIONALES DE VENTAS', type: 'Grupo', children: [
                    { code: '5205', name: 'Gastos de Personal Ventas', type: 'Cuenta' },
                    { code: '5235', name: 'Servicios', type: 'Cuenta' }
                ]
            }
        ]
    },
    {
        code: '6', name: 'COSTOS DE VENTAS', type: 'Clase', children: [
            {
                code: '61', name: 'COSTO DE VENTAS Y DE PRESTACIÓN DE SERVICIOS', type: 'Grupo', children: [
                    { code: '6135', name: 'Comercio al por mayor y al por menor', type: 'Cuenta' }
                ]
            }
        ]
    }
];

const AccountNode = ({ node, level = 0 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="select-none">
            <div
                className={`flex items-center gap-2 py-3 px-4 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors cursor-pointer border-b border-zinc-100 dark:border-white/5 ${level === 0 ? 'bg-zinc-50 dark:bg-white/5 font-black text-zinc-900 dark:text-white uppercase tracking-tight' : 'text-zinc-600 dark:text-zinc-400'}`}
                style={{ paddingLeft: `${level * 20 + 16}px` }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="w-6 flex justify-center">
                    {hasChildren ? (
                        isOpen ? <ChevronDown size={16} className="text-zinc-900 dark:text-white" /> : <ChevronRight size={16} className="text-zinc-400 dark:text-zinc-600" />
                    ) : (
                        <div className="w-4" />
                    )}
                </div>

                <div className="mr-2 text-zinc-900 dark:text-white">
                    {level === 0 ? <Folder size={18} /> : <FileText size={16} />}
                </div>

                <div className="flex-1 flex items-center gap-3">
                    <span className="font-mono text-xs font-black bg-zinc-900 dark:bg-white text-white dark:text-black px-2 py-0.5 rounded tracking-tighter">{node.code}</span>
                    <span className={level === 0 ? 'text-sm' : 'text-xs font-medium'}>{node.name}</span>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Placeholder actions */}
                </div>
            </div>

            {isOpen && hasChildren && (
                <div className="animate-fadeIn">
                    {node.children.map((child) => (
                        <AccountNode key={child.code} node={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function PUCDisco() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="w-full bg-white dark:bg-zinc-900/30 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-3xl overflow-hidden flex flex-col h-[600px] shadow-sm dark:shadow-2xl">
            {/* Header / Toolbar */}
            <div className="p-6 border-b border-zinc-200 dark:border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-50 dark:bg-zinc-950/50">
                <div>
                    <h2 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2 uppercase tracking-tight">
                        <Folder className="text-zinc-900 dark:text-white" />
                        Plan Único de Cuentas (PUC)
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Estructura contable del establecimiento</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-2.5 text-zinc-400 dark:text-zinc-600" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar cuenta..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-white/20 transition-all text-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="bg-zinc-900 dark:bg-white text-white dark:text-black p-2.5 rounded-xl transition-all hover:scale-105 shadow-lg active:scale-95">
                        <Plus size={20} weight="bold" />
                    </button>
                </div>
            </div>

            {/* Tree View */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                {initialPUC.map((node) => (
                    <AccountNode key={node.code} node={node} />
                ))}
            </div>

            {/* Footer */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-200 dark:border-white/10 text-center text-zinc-400 dark:text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                Total Cuentas: {initialPUC.length} Clases principales
            </div>
        </div>
    );
}
