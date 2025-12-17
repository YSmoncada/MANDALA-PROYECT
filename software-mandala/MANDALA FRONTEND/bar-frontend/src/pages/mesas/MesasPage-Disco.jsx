import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import MesaForm from './MesaForm';
import toast from 'react-hot-toast';
import { API_URL } from '../../apiConfig';

const MESAS_API_URL = `${API_URL}/mesas/`;

const MesasPageDisco = () => {
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
            fetchMesas();
        } catch (error) {
            console.error("Error al agregar la mesa:", error.response?.data || error.message);
            toast.error(`Error: ${error.response?.data?.numero?.[0] || 'No se pudo guardar la mesa.'}`);
        }
    };

    const handleDeleteMesa = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta mesa?')) {
            try {
                await axios.delete(`${MESAS_API_URL}${id}/`);
                fetchMesas();
            } catch (error) {
                console.error("Error al eliminar la mesa:", error);
                alert('No se pudo eliminar la mesa. Es posible que tenga pedidos asociados.');
            }
        }
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 sm:p-8 text-white">
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
            </div>

            <button
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 z-10 flex items-center gap-2 rounded-lg bg-purple-600/80 backdrop-blur-sm px-4 py-2 text-white shadow-lg transition-all hover:bg-purple-600 hover:scale-105"
            >
                <ArrowLeft size={18} /> Volver
            </button>

            <div className="relative z-10 mx-auto max-w-6xl pt-20 sm:pt-0">
                <div className="text-center mb-10">
                    <h1 className="text-5xl md:text-6xl font-black mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                        Gestión de Mesas
                    </h1>
                    <div className="h-1 w-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto"></div>
                </div>

                <MesaForm key="form" onSubmit={handleAddMesa} />

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8">
                    {loading ? (
                        <p className="col-span-full text-center text-purple-300">Cargando mesas...</p>
                    ) : (
                        mesas.map((mesa) => (
                            <div
                                key={mesa.id}
                                className="relative bg-gray-800/70 backdrop-blur-sm border border-purple-500/40 hover:border-purple-400 rounded-xl p-5 text-center group transition-all duration-300 hover:scale-105"
                            >
                                <p className="text-xs font-medium text-purple-300/80 mb-1">Mesa</p>
                                <p className="text-5xl font-black text-white my-2">
                                    {mesa.numero}
                                </p>
                                <p className="text-xs text-gray-300">Cap: {mesa.capacidad}</p>

                                <button
                                    onClick={() => handleDeleteMesa(mesa.id)}
                                    className="absolute top-2 right-2 p-1.5 text-red-400 bg-red-900/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-800"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {!loading && mesas.length === 0 && (
                    <p className="text-center text-gray-400 mt-12 text-lg">
                        No hay mesas registradas. ¡Agrega la primera!
                    </p>
                )}
            </div>
        </div>
    );
};

export default MesasPageDisco;
