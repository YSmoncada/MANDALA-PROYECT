import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import MesaForm from './MesaForm';

const API_URL = 'http://127.0.0.1:8000/api/mesas/';

const MesasPage = () => {
    const [mesas, setMesas] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchMesas = async () => {
        try {
            const response = await axios.get(API_URL);
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
            await axios.post(API_URL, mesaData);
            fetchMesas(); // Recargar la lista
        } catch (error) {
            console.error("Error al agregar la mesa:", error.response?.data || error.message);
            alert(`Error: ${error.response?.data?.numero?.[0] || 'No se pudo guardar la mesa.'}`);
        }
    };

    const handleDeleteMesa = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta mesa?')) {
            try {
                await axios.delete(`${API_URL}${id}/`);
                fetchMesas(); // Recargar la lista
            } catch (error) {
                console.error("Error al eliminar la mesa:", error);
                alert('No se pudo eliminar la mesa. Es posible que tenga pedidos asociados.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0E0D23] to-[#511F86] p-8 text-white">
            <button
                onClick={() => navigate("/")}
                className="absolute top-6 left-6 flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
            >
                <ArrowLeft size={18} /> Volver al Inicio
            </button>

            <div className="max-w-4xl mx-auto">
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
