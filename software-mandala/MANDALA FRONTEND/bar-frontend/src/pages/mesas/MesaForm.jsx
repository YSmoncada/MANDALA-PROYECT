import React, { useState, useEffect, memo } from 'react';
import { Table, Users, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { UI_CLASSES } from '../../constants/ui';

/**
 * Form to add or edit Mesa configuration.
 * Memoized to prevent unnecessary re-renders.
 */
const MesaForm = ({ onSubmit, initialData = { numero: '', capacidad: '' } }) => {
    const [numero, setNumero] = useState(initialData.numero || '');
    const [capacidad, setCapacidad] = useState(
        initialData.capacidad !== undefined && initialData.capacidad !== null
            ? String(initialData.capacidad)
            : ''
    );

    useEffect(() => {
        if (initialData) {
            setNumero(initialData.numero || '');
            setCapacidad(
                initialData.capacidad !== undefined && initialData.capacidad !== null
                    ? String(initialData.capacidad)
                    : ''
            );
        }
    }, [initialData.numero, initialData.capacidad]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!numero || !capacidad) {
            toast.error('Por favor, complete todos los campos.');
            return;
        }
        onSubmit({ numero, capacidad: parseInt(capacidad, 10) });
        setNumero('');
        setCapacidad('');
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 flex flex-wrap items-end gap-6 shadow-xl relative overflow-hidden group"
        >
            <div className="absolute inset-y-0 left-0 w-1 bg-[#A944FF] opacity-50 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex-1 min-w-[140px] space-y-2.5">
                <label htmlFor="numero" className="flex items-center gap-2 text-[10px] font-black text-[#A944FF] uppercase tracking-[0.2em] ml-1">
                    <Table size={12} />
                    Número de Mesa
                </label>
                <div className="relative">
                    <input
                        type="text"
                        id="numero"
                        value={numero}
                        onChange={(e) => {
                            const value = e.target.value;
                            setNumero(value.replace(/[^0-9]/g, ''));
                        }}
                        className={UI_CLASSES.input}
                        placeholder="Ej: 01"
                        required
                    />
                </div>
            </div>

            <div className="flex-1 min-w-[140px] space-y-2.5">
                <label htmlFor="capacidad" className="flex items-center gap-2 text-[10px] font-black text-[#A944FF] uppercase tracking-[0.2em] ml-1">
                    <Users size={12} />
                    Capacidad
                </label>
                <div className="relative">
                    <input
                        type="number"
                        id="capacidad"
                        value={capacidad}
                        onChange={(e) => setCapacidad(e.target.value)}
                        className={UI_CLASSES.input}
                        placeholder="Sillas"
                        min="1"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                className={`${UI_CLASSES.buttonPrimary} mt-2 sm:mt-0 shadow-lg shadow-purple-900/20`}
            >
                <Plus size={18} />
                <span>Agregar Mesa</span>
            </button>
        </form>
    );
};

export default memo(MesaForm);
