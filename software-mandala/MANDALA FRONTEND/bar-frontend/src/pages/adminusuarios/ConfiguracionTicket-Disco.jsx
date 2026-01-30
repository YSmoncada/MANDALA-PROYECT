import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Save, ArrowLeft, Building2, Phone, MapPin, Hash, MessageSquare, DollarSign, Percent } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../apiConfig';
import toast from 'react-hot-toast';
import { usePedidosContext } from '../../context/PedidosContext';

const ConfiguracionTicketDisco = () => {
    const [config, setConfig] = useState({
        nombre: '',
        nit: '',
        direccion: '',
        telefono: '',
        mensaje_footer: '',
        moneda: '$',
        impuesto_porcentaje: 0
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { auth } = usePedidosContext();
    const { role, userRole } = auth;

    useEffect(() => {
        const currentRole = role || userRole;
        if (currentRole !== 'admin' && currentRole !== 'prueba') {
            navigate('/');
        }
    }, [role, userRole, navigate]);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await axios.get(`${API_URL}/config/`);
                if (res.data && res.data.length > 0) {
                    setConfig(res.data[0]);
                } else if (res.data && res.data.id) {
                    setConfig(res.data);
                }
            } catch (error) {
                console.error("Error al cargar configuración:", error);
                toast.error("No se pudo cargar la configuración.");
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleSave = async () => {
        try {
            if (config.id) {
                await axios.put(`${API_URL}/config/${config.id}/`, config);
            } else {
                await axios.post(`${API_URL}/config/`, config);
            }
            toast.success("Configuración guardada correctamente.");
            navigate('/usuarios-disco');
        } catch (error) {
            console.error("Error al guardar:", error);
            toast.error("Error al guardar la configuración.");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center transition-colors duration-300">
            <div className="w-16 h-16 border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-white rounded-full animate-spin mb-6"></div>
            <p className="text-zinc-500 font-black uppercase tracking-[0.4em] text-[10px]">Cargando configuración...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white transition-colors duration-300">
            <header className="relative z-20 p-6 bg-zinc-50/80 dark:bg-zinc-900/50 backdrop-blur-md border-b border-zinc-200 dark:border-white/5">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/usuarios-disco')} className="p-3 rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all border border-zinc-200 dark:border-white/5 shadow-sm active:scale-95">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white flex items-center gap-2 uppercase">
                                <Settings className="text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-lg" size={32} />
                                CONFIGURAR TICKET
                            </h1>
                            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-black tracking-[0.2em] uppercase">Datos del Recibo</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 p-4 sm:p-8 max-w-4xl mx-auto">
                <div className="bg-white dark:bg-zinc-900/30 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-3xl p-8 space-y-8 shadow-xl dark:shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Nombre del Establecimiento */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                                <Building2 size={12} /> Nombre del Establecimiento
                            </label>
                            <input
                                type="text"
                                value={config.nombre}
                                onChange={(e) => setConfig({ ...config, nombre: e.target.value })}
                                className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-white/20 transition-all font-bold placeholder-zinc-400"
                                placeholder="Mandala Disco"
                            />
                        </div>

                        {/* NIT / RUT */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                                <Hash size={12} /> NIT / Identificación
                            </label>
                            <input
                                type="text"
                                value={config.nit}
                                onChange={(e) => setConfig({ ...config, nit: e.target.value })}
                                className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-white/20 transition-all font-bold placeholder-zinc-400"
                                placeholder="Ej: 900.123.456-7"
                            />
                        </div>

                        {/* Dirección */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                                <MapPin size={12} /> Dirección
                            </label>
                            <input
                                type="text"
                                value={config.direccion}
                                onChange={(e) => setConfig({ ...config, direccion: e.target.value })}
                                className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-white/20 transition-all font-bold placeholder-zinc-400"
                                placeholder="Ej: Calle 10 # 5-20"
                            />
                        </div>

                        {/* Teléfono */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                                <Phone size={12} /> Teléfono
                            </label>
                            <input
                                type="text"
                                value={config.telefono}
                                onChange={(e) => setConfig({ ...config, telefono: e.target.value })}
                                className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-white/20 transition-all font-bold placeholder-zinc-400"
                                placeholder="Ej: +57 321 000 0000"
                            />
                        </div>

                        {/* Moneda */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                                <DollarSign size={12} /> Símbolo Moneda
                            </label>
                            <input
                                type="text"
                                value={config.moneda}
                                onChange={(e) => setConfig({ ...config, moneda: e.target.value })}
                                className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-white/20 transition-all font-bold"
                                placeholder="Ej: $"
                            />
                        </div>

                        {/* Impuesto */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                                <Percent size={12} /> Impuesto (%)
                            </label>
                            <input
                                type="number"
                                value={config.impuesto_porcentaje}
                                onChange={(e) => setConfig({ ...config, impuesto_porcentaje: parseFloat(e.target.value) || 0 })}
                                className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-white/20 transition-all font-bold"
                                placeholder="Ej: 8"
                            />
                        </div>
                    </div>

                    {/* Mensaje Footer */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                            <MessageSquare size={12} /> Mensaje al final del ticket
                        </label>
                        <textarea
                            value={config.mensaje_footer}
                            onChange={(e) => setConfig({ ...config, mensaje_footer: e.target.value })}
                            className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-white/20 transition-all font-bold h-32 resize-none placeholder-zinc-400"
                            placeholder="Ej: ¡Muchas gracias por su preferencia! Vuelva pronto."
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full py-5 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black border border-transparent dark:border-white font-black tracking-widest uppercase text-sm shadow-xl hover:bg-black dark:hover:bg-zinc-200 transform hover:scale-[1.01] transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                        <Save size={20} />
                        Guardar Configuración
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ConfiguracionTicketDisco;
