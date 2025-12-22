import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const MesaForm = ({ onSubmit, initialData = { numero: '', capacidad: '' } }) => {
    const [numero, setNumero] = useState(initialData.numero || '');
    const [capacidad, setCapacidad] = useState(
        initialData.capacidad !== undefined && initialData.capacidad !== null
            ? String(initialData.capacidad)
            : ''
    );

    // ✅ Evitar que se resetee al escribir si el padre se vuelve a renderizar
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
            className="bg-[#2B0D49]/50 border border-[#6C3FA8]/30 rounded-2xl p-6 mb-8 flex flex-wrap items-end gap-6 shadow-inner"
        >
            <div className="flex-1 min-w-[140px] space-y-2">
                <label htmlFor="numero" className="text-[10px] font-bold text-[#A944FF] uppercase tracking-widest ml-1">
                    Número de Mesa
                </label>
                <input
                    type="text"
                    id="numero"
                    value={numero}
                    onChange={(e) => {
                        const value = e.target.value;
                        setNumero(value.replace(/[^0-9]/g, '')); // Solo permite números
                    }}
                    className="w-full p-3.5 bg-[#2B0D49] border border-[#6C3FA8] rounded-xl text-white focus:ring-1 focus:ring-[#A944FF] focus:border-[#A944FF] outline-none transition-all placeholder:text-gray-600 text-sm"
                    placeholder="Ej: 01"
                    required
                />
            </div>

            <div className="flex-1 min-w-[140px] space-y-2">
                <label htmlFor="capacidad" className="text-[10px] font-bold text-[#A944FF] uppercase tracking-widest ml-1">
                    Capacidad
                </label>
                <input
                    type="number"
                    id="capacidad"
                    value={capacidad}
                    onChange={(e) => setCapacidad(e.target.value)}
                    className="w-full p-3.5 bg-[#2B0D49] border border-[#6C3FA8] rounded-xl text-white focus:ring-1 focus:ring-[#A944FF] focus:border-[#A944FF] outline-none transition-all placeholder:text-gray-600 text-sm"
                    placeholder="Sillas"
                    min="1"
                    required
                />
            </div>

            <button
                type="submit"
                className="h-[52px] px-8 bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:brightness-110 transition-all shadow-lg shadow-[#A944FF]/20 hover:shadow-[#A944FF]/40 hover:scale-[1.02] active:scale-[0.98] mt-2 sm:mt-0"
            >
                Agregar Mesa
            </button>
        </form>
    );
};

export default MesaForm;
