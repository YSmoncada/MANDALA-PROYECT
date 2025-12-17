import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Users, Table } from 'lucide-react';
import MesaForm from '../mesas/MesaForm';
import toast from 'react-hot-toast';
import { API_URL } from '../../apiConfig';
import { usePedidosContext } from '../../context/PedidosContext';

const MESAS_API_URL = `${API_URL}/mesas/`;
const MESEROS_API_URL = `${API_URL}/meseros/`;

const MesasPageDisco = () => {
    const [mesas, setMesas] = useState([]);
    const [meseros, setMeseros] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { auth } = usePedidosContext();

    const fetchData = async () => {
        try {
            // Añadir el token de autenticación a las cabeceras
            const config = {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            };
            const [mesasRes, meserosRes] = await Promise.all([
                axios.get(MESAS_API_URL, config),
                axios.get(MESEROS_API_URL, config)
            ]);
            setMesas(mesasRes.data);
            setMeseros(meserosRes.data);
        } catch (error) {
            console.error("Error al cargar los datos:", error);
            toast.error('No se pudieron cargar los datos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Carga los datos directamente al montar el componente.
        fetchData();
    }, []);

    const handleEliminarMesero = async (meseroId) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este mesero? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            await axios.delete(`${MESEROS_API_URL}${meseroId}/`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });
            toast.success('Mesero eliminado correctamente.');
            // Actualizar el estado para reflejar el cambio en la UI
            setMeseros(meseros.filter(m => m.id !== meseroId));
        } catch (error) {
            console.error("Error al eliminar el mesero:", error);
            toast.error(error.response?.data?.error || 'No se pudo eliminar el mesero.');
        }
    };

    const handleAddMesa = async (mesaData) => {
        try {
            await axios.post(MESAS_API_URL, mesaData, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });
            toast.success('¡Mesa guardada con éxito!');
            fetchData(); // Recarga mesas
        } catch (error) {
            console.error("Error al agregar la mesa:", error.response?.data || error.message);
            toast.error(`Error: ${error.response?.data?.numero?.[0] || 'No se pudo guardar la mesa.'}`);
        }
    };

    const handleDeleteMesa = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta mesa?')) {
            try {
                await axios.delete(`${MESAS_API_URL}${id}/`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                });
                fetchData(); // Recarga mesas
            } catch (error) {
                console.error("Error al eliminar la mesa:", error);
                alert('No se pudo eliminar la mesa. Es posible que tenga pedidos asociados.');
            }
        }
    };

    // Mostrar loader solo mientras se cargan los datos
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                <p className="ml-4">Cargando gestión...</p>
            </div>
        );
    }


    return (
        <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 sm:p-8 text-white">
            {/* Subtle background effects */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
            </div>

            <button
                onClick={() => navigate("/home-disco")}
                className="absolute top-6 left-6 z-10 flex items-center gap-2 rounded-lg bg-purple-600/80 backdrop-blur-sm px-4 py-2 text-white shadow-lg transition-all hover:bg-purple-600 hover:scale-105"
            >
                <ArrowLeft size={18} />
                <span className="font-medium">Volver al Home</span>
            </button>

            <div className="relative z-10 mx-auto max-w-6xl pt-20 sm:pt-0">
                <div className="text-center mb-10">
                    <h1 className="text-5xl md:text-6xl font-black mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                        Gestión de Mesas y Meseros
                    </h1>
                    <div className="h-1 w-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Columna de Mesas */}
                    <div>
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3"><Table /> Mesas</h2>
                        <MesaForm key="form" onSubmit={handleAddMesa} />
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
                            {mesas.map((mesa) => (
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
                            ))}
                        </div>
                        {mesas.length === 0 && (
                            <p className="text-center text-gray-400 mt-12 text-lg">No hay mesas registradas.</p>
                        )}
                    </div>

                    {/* Columna de Meseros */}
                    <div>
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3"><Users /> Meseros</h2>
                        <div className="space-y-3 bg-gray-800/50 backdrop-blur-sm border border-purple-500/40 rounded-xl p-6">
                            {meseros.map(mesero => (
                                <div key={mesero.id} className="bg-purple-950/40 p-4 rounded-lg flex justify-between items-center">
                                    <span className="font-semibold capitalize">{mesero.nombre}</span>
                                    <button
                                        onClick={() => handleEliminarMesero(mesero.id)}
                                        className="text-red-400 hover:text-red-200 p-2 rounded-md hover:bg-red-500/20 transition-colors"
                                        title="Eliminar mesero"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            {meseros.length === 0 && (
                                <p className="text-center text-gray-400 py-8">No hay meseros registrados.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MesasPageDisco;
