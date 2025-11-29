import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import MesaForm from './MesaForm'; import toast from 'react-hot-toast';
import { API_URL } from '../../apiConfig'; // Importar la URL centralizada
const MESAS_API_URL = `${API_URL}/mesas/`;

const MesasPage = () => {
    const [mesas, setMesas] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchMesas = async () => {
        try {
            const response = await axios.get(MESAS_API_URL);
            setMesas(response.data);
        } catch (error) {
            console.error("Error al cargar las mesas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMesas();
    }, []);

    const handleAddMesa = async (mesaData) => {
        try {
            await axios.post(MESAS_API_URL, mesaData);
            toast.success('¡Mesa guardada con éxito!');
            fetchMesas(); // Recargar la lista
        } catch (error) {
            console.error("Error al agregar la mesa:", error.response?.data || error.message);
            toast.error(`Error: ${error.response?.data?.numero?.[0] || 'No se pudo guardar la mesa.'}`);
        }
    };

    const handleDeleteMesa = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta mesa?')) {
            try {
                await axios.delete(`${MESAS_API_URL}${id}/`);
                fetchMesas(); // Recargar la lista
            } catch (error) {
                console.error("Error al eliminar la mesa:", error);
                alert('No se pudo eliminar la mesa. Es posible que tenga pedidos asociados.');
            }
        }
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-[#0E0D23] to-[#511F86] p-4 sm:p-8 text-white">
            <button
                onClick={() => navigate(-1)} // Usamos navigate(-1) para volver a la página anterior
                className="absolute top-6 left-6 z-10 flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white shadow-lg transition-colors hover:bg-purple-700"
            >
                <ArrowLeft size={18} /> Volver al Inicio
            </button>

            {/* Contenedor del contenido con padding-top solo en móviles */}
            <div className="mx-auto max-w-4xl pt-20 sm:pt-0">
                <h1 className="text-4xl font-bold text-center mb-8">Gestión de Mesas</h1>

                {/* ✅ Clave fija para evitar reinicio del formulario */}
                <MesaForm key="form" onSubmit={handleAddMesa} />

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {loading ? (
                        <p>Cargando mesas...</p>
                    ) : (
                        mesas.map((mesa) => (
                            <div
                                key={mesa.id}
                                className="relative bg-[#441E73]/70 border border-[#6C3FA8] rounded-lg p-4 text-center group"
                            >
                                <p className="text-lg font-bold">Mesa</p>
                                <p className="text-4xl font-black text-purple-300">{mesa.numero}</p>
                                <p className="text-xs text-gray-400">Capacidad: {mesa.capacidad}</p>

                                <button
                                    onClick={() => handleDeleteMesa(mesa.id)}
                                    className="absolute top-2 right-2 p-1 text-red-500 bg-red-900/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {!loading && mesas.length === 0 && (
                    <p className="text-center text-gray-400 mt-8">
                        No hay mesas registradas. ¡Agrega la primera!
                    </p>
                )}
            </div>
        </div>
    );
};

export default MesasPage;
