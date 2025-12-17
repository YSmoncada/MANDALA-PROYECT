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
            className="bg-[#1A103C]/80 backdrop-blur-md border border-[#6C3FA8]/50 rounded-2xl p-6 mb-8 flex flex-wrap items-end gap-4"
        >
            <div>
                <label htmlFor="numero" className="block mb-2 text-sm font-medium text-gray-300">
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
                    className="w-full p-3 bg-[#2B0D49] border border-[#6C3FA8]/50 rounded-lg text-white focus:ring-2 focus:ring-[#A944FF] outline-none transition-all placeholder:text-gray-500"
                    placeholder="Ej: 1, 2, 10"
                    required
                />
            </div>

            <div>
                <label htmlFor="capacidad" className="block mb-2 text-sm font-medium text-gray-300">
                    Capacidad
                </label>
                <input
                    type="number"
                    id="capacidad"
                    value={capacidad}
                    onChange={(e) => setCapacidad(e.target.value)}
                    className="w-full p-3 bg-[#2B0D49] border border-[#6C3FA8]/50 rounded-lg text-white focus:ring-2 focus:ring-[#A944FF] outline-none transition-all placeholder:text-gray-500"
                    placeholder="Ej: 4"
                    min="1"
                    required
                />
            </div>

            <button
                type="submit"
                className="bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] text-white font-bold py-3 px-6 rounded-lg hover:brightness-110 transition-all shadow-lg shadow-[#A944FF]/20"
            >
                Guardar Mesa
            </button>
        </form>
    );
};

export default MesaForm;
