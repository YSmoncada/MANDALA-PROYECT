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
        <div className="select-none group">
            <div
                className={`flex items-center gap-2 py-4 px-6 hover:bg-white/5 dark:hover:bg-white/5 transition-all cursor-pointer border-b border-white/5 dark:border-white/5 ${level === 0 ? 'bg-white/5 dark:bg-zinc-950/40 font-black text-white dark:text-zinc-100 uppercase tracking-widest' : 'text-[#8A7BAF] dark:text-zinc-500'}`}
                style={{ paddingLeft: `${level * 24 + 24}px` }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="w-8 flex justify-center">
                    {hasChildren ? (
                        isOpen ? <ChevronDown size={18} className="text-[#A944FF] dark:text-zinc-400" /> : <ChevronRight size={18} className="text-[#8A7BAF] dark:text-zinc-700" />
                    ) : (
                        <div className="w-4" />
                    )}
                </div>

                <div className="mr-3 text-[#A944FF] dark:text-zinc-400 group-hover:scale-110 transition-transform">
                    {level === 0 ? <Folder size={18} /> : <FileText size={16} />}
                </div>

                <div className="flex-1 flex items-center gap-4">
                    <span className="font-mono text-[10px] font-black bg-[#441E73] dark:bg-zinc-800 text-white dark:text-zinc-400 px-3 py-1 rounded-lg tracking-tighter shadow-lg border border-white/10">{node.code}</span>
                    <span className={`${level === 0 ? 'text-xs' : 'text-[11px] font-bold'} uppercase italic tracking-tight`}>{node.name}</span>
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
        <div className="w-full bg-[#1A103C]/80 dark:bg-zinc-900/30 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col h-[700px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] transition-all duration-500">
            {/* Header / Toolbar */}
            <div className="p-8 border-b border-white/10 dark:border-white/5 flex flex-col lg:flex-row gap-6 justify-between items-center bg-white/5 dark:bg-zinc-950/50">
                <div>
                    <h2 className="text-2xl font-black text-white dark:text-white flex items-center gap-4 uppercase tracking-tighter italic">
                        <Folder className="text-[#A944FF] dark:text-zinc-200" />
                        Plan Único de Cuentas (PUC)
                    </h2>
                    <p className="text-[#8A7BAF] dark:text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">Estructura contable del establecimiento</p>
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-80 group">
                        <Search className="absolute left-4 top-3.5 text-[#8A7BAF] dark:text-zinc-700 group-focus-within:text-[#A944FF] transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar cuenta por nombre o código..."
                            className="w-full pl-12 pr-6 py-3.5 rounded-2xl bg-[#0E0D23] dark:bg-zinc-900 border border-white/10 dark:border-white/5 text-white dark:text-white placeholder-[#8A7BAF]/30 dark:placeholder-zinc-800 focus:outline-none focus:border-[#A944FF] dark:focus:border-white/20 transition-all text-xs font-black uppercase tracking-widest shadow-inner"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="bg-[#441E73] dark:bg-white text-white dark:text-black p-4 rounded-2xl transition-all hover:scale-105 shadow-2xl active:scale-95 border border-white/10 dark:border-transparent">
                        <Plus size={20} className="font-black" />
                    </button>
                </div>
            </div>

            {/* Tree View */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {initialPUC.map((node) => (
                    <AccountNode key={node.code} node={node} />
                ))}
            </div>

            {/* Footer */}
            <div className="p-5 bg-white/5 dark:bg-zinc-950/50 border-t border-white/10 dark:border-white/5 text-center text-[#8A7BAF] dark:text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">
                Total Cuentas: {initialPUC.length} Clases principales registradas
            </div>
        </div>
    );
}
