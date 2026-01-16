import React, { useState, useEffect, memo } from 'react';
import { Table, Users, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

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
            className="bg-[#2B0D49]/40 border border-[#6C3FA8]/20 rounded-2xl p-6 mb-8 flex flex-wrap items-end gap-6 shadow-xl relative overflow-hidden group"
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
                        className="w-full p-4 bg-[#210931] border border-[#6C3FA8]/40 rounded-xl text-white focus:ring-2 focus:ring-[#A944FF]/50 focus:border-[#A944FF] outline-none transition-all placeholder:text-gray-700 font-bold text-sm shadow-inner"
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
                        className="w-full p-4 bg-[#210931] border border-[#6C3FA8]/40 rounded-xl text-white focus:ring-2 focus:ring-[#A944FF]/50 focus:border-[#A944FF] outline-none transition-all placeholder:text-gray-700 font-bold text-sm shadow-inner"
                        placeholder="Sillas"
                        min="1"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                className="h-[56px] px-8 bg-gradient-to-br from-[#A944FF] to-[#6C3FA8] text-white font-black uppercase tracking-[0.1em] text-[10px] rounded-xl hover:brightness-125 transition-all shadow-lg shadow-[#A944FF]/20 hover:shadow-[#A944FF]/40 hover:scale-[1.02] active:scale-[0.95] mt-2 sm:mt-0 flex items-center justify-center gap-2 border border-[#A944FF]/30"
            >
                <PlusCircle size={16} />
                Agregar Mesa
            </button>
        </form>
    );
};

export default memo(MesaForm);
