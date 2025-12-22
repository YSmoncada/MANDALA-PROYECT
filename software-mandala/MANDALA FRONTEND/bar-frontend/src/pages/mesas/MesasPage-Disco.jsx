import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Users, Table } from 'lucide-react';
import MesaForm from './MesaForm';
import toast from 'react-hot-toast';
import { API_URL } from '../../apiConfig';
import { usePedidosContext } from '../../context/PedidosContext';

const MESAS_API_URL = `${API_URL}/mesas/`;
const MESEROS_API_URL = `${API_URL}/meseras/`;

const MesasPageDisco = () => {
    const [mesas, setMesas] = useState([]);
    const [meseros, setMeseros] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { auth } = usePedidosContext();

    const fetchData = async () => {
        try {
            const [mesasRes, meserosRes] = await Promise.all([
                axios.get(MESAS_API_URL),
                axios.get(MESEROS_API_URL)
            ]);
            setMesas(mesasRes.data);
            setMeseros(meserosRes.data);
        } catch (error) {
            console.error("Error al cargar los datos:", error);
            toast.error("No se pudieron cargar los datos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEliminarMesero = async (meseroId) => {
        const meseroAEliminar = meseros.find(m => m.id === meseroId);
        if (!meseroAEliminar) return;

        toast((t) => (
            <div className="bg-[#1A103C] text-white p-5 rounded-xl shadow-lg border border-purple-700/50 max-w-sm">
                <p className="font-bold text-lg mb-2">Confirmar Eliminación</p>
                <p className="text-sm text-gray-300 mb-4">
                    ¿Estás seguro de que quieres eliminar a <span className="font-bold capitalize text-pink-400">{meseroAEliminar.nombre}</span>? Esta acción no se puede deshacer.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            procederEliminacion(meseroId);
                        }}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition text-sm"
                    >
                        Sí, eliminar
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition text-sm"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        ), {
            duration: 6000, // La notificación desaparecerá después de 6 segundos si no se interactúa
        });
    };

    const procederEliminacion = async (meseroId) => {
        try {
            await axios.delete(`${MESEROS_API_URL}${meseroId}/`);
            toast.success('Mesero eliminado correctamente.');
            setMeseros(currentMeseros => currentMeseros.filter(m => m.id !== meseroId));
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
            fetchData();
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
                fetchData();
            } catch (error) {
                console.error("Error al eliminar la mesa:", error);
                alert('No se pudo eliminar la mesa. Es posible que tenga pedidos asociados.');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                <p className="ml-4">Cargando gestión...</p>
            </div>
        );
    }


    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white selection:bg-purple-500/30 overflow-x-hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
            {/* Background Glows matching Home-Disco and Pedidos-Disco */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
            </div>

            <main className="flex-1 p-3 pt-24 pb-20 sm:p-8 relative z-10">
                <button
                    onClick={() => navigate("/home-disco")}
                    className="fixed top-6 left-6 z-50 flex items-center gap-2 rounded-xl bg-[#441E73]/60 backdrop-blur-xl border border-[#6C3FA8] px-4 py-2 hover:bg-[#A944FF]/20 transition-all shadow-lg hover:scale-105"
                >
                    <ArrowLeft size={18} />
                    <span className="font-bold uppercase tracking-wider text-xs">Volver</span>
                </button>

                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl font-black mb-4 text-white tracking-tight drop-shadow-[0_0_15px_rgba(168,85,247,0.3)] uppercase">
                            Gestión de Mesas y Meseros
                        </h1>
                        <div className="h-1.5 w-32 bg-gradient-to-r from-[#A944FF] via-[#FF4BC1] to-transparent rounded-full mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Columna de Mesas */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-3 uppercase tracking-wider text-white">
                                <div className="p-2 bg-[#A944FF]/10 rounded-lg">
                                    <Table className="text-[#A944FF]" size={20} />
                                </div>
                                Mesas Configuradas
                            </h2>

                            <div className="bg-[#441E73]/60 backdrop-blur-xl border border-[#6C3FA8] rounded-2xl p-6 shadow-xl">
                                <MesaForm key="form" onSubmit={handleAddMesa} />

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
                                    {mesas.map((mesa) => (
                                        <div
                                            key={mesa.id}
                                            className="relative bg-[#2B0D49] border border-[#6C3FA8]/30 hover:border-[#A944FF] rounded-2xl p-6 text-center group transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(169,68,255,0.2)] overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-[#A944FF]/5 rounded-bl-full pointer-events-none"></div>

                                            <p className="text-[10px] font-bold text-[#A944FF] uppercase tracking-widest mb-1">MESA</p>
                                            <p className="text-5xl font-black text-white my-3 drop-shadow-sm">
                                                {mesa.numero}
                                            </p>
                                            <div className="flex items-center justify-center gap-1.5 text-gray-400">
                                                <Users size={12} className="text-[#C2B6D9]" />
                                                <span className="text-xs font-medium">Cap: {mesa.capacidad}</span>
                                            </div>

                                            <button
                                                onClick={() => handleDeleteMesa(mesa.id)}
                                                className="absolute top-3 right-3 p-2 text-red-500 bg-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-lg"
                                                title="Eliminar Mesa"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {mesas.length === 0 && !loading && (
                                    <div className="text-center py-12 border-2 border-dashed border-[#6C3FA8]/30 rounded-2xl bg-white/5">
                                        <p className="text-[#C2B6D9] font-bold uppercase tracking-widest text-xs">No hay mesas</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Columna de Meseros */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-3 uppercase tracking-wider text-white">
                                <div className="p-2 bg-[#FF4BC1]/10 rounded-lg">
                                    <Users className="text-[#FF4BC1]" size={20} />
                                </div>
                                Meseros Registrados
                            </h2>

                            <div className="bg-[#441E73]/60 backdrop-blur-xl border border-[#6C3FA8] rounded-2xl p-6 shadow-xl space-y-3">
                                {meseros.map(mesero => (
                                    <div key={mesero.id} className="bg-[#2B0D49] hover:bg-[#2B0D49]/80 p-4 rounded-xl flex justify-between items-center transition-all border border-[#6C3FA8]/30 hover:border-[#A944FF]/50 group shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A944FF] to-[#FF4BC1] flex items-center justify-center font-black text-xs text-white uppercase shadow-lg">
                                                {mesero.nombre.charAt(0)}
                                            </div>
                                            <span className="font-bold text-white tracking-wide uppercase text-sm">{mesero.nombre}</span>
                                        </div>
                                        <button
                                            onClick={() => handleEliminarMesero(mesero.id)}
                                            className="text-gray-500 hover:text-red-500 p-2.5 rounded-xl hover:bg-red-500/10 transition-all opacity-40 group-hover:opacity-100"
                                            title="Eliminar mesero"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                {meseros.length === 0 && !loading && (
                                    <div className="text-center py-12 border-2 border-dashed border-[#6C3FA8]/30 rounded-2xl bg-white/5">
                                        <p className="text-[#C2B6D9] font-bold uppercase tracking-widest text-xs">No hay meseros</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MesasPageDisco;
