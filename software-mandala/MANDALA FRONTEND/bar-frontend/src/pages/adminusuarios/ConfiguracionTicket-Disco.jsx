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
        if (currentRole !== 'admin') {
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
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white selection:bg-purple-500/30">
            <header className="relative z-20 p-6 bg-white/5 backdrop-blur-md border-b border-white/10">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/usuarios-disco')} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                                <Settings className="text-purple-400" size={24} />
                                CONFIGURAR TICKET
                            </h1>
                            <p className="text-[10px] text-gray-400 font-black tracking-[0.2em] uppercase">Datos del Recibo</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 p-4 sm:p-8 max-w-4xl mx-auto">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nombre del Establecimiento */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-purple-400 flex items-center gap-2">
                                <Building2 size={12} /> Nombre del Establecimiento
                            </label>
                            <input
                                type="text"
                                value={config.nombre}
                                onChange={(e) => setConfig({ ...config, nombre: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-purple-500 transition-all font-bold"
                                placeholder="Ej: MANDALA DISCO CLUB"
                            />
                        </div>

                        {/* NIT / RUT */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-purple-400 flex items-center gap-2">
                                <Hash size={12} /> NIT / Identificación
                            </label>
                            <input
                                type="text"
                                value={config.nit}
                                onChange={(e) => setConfig({ ...config, nit: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-purple-500 transition-all font-bold"
                                placeholder="Ej: 900.123.456-7"
                            />
                        </div>

                        {/* Dirección */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-purple-400 flex items-center gap-2">
                                <MapPin size={12} /> Dirección
                            </label>
                            <input
                                type="text"
                                value={config.direccion}
                                onChange={(e) => setConfig({ ...config, direccion: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-purple-500 transition-all font-bold"
                                placeholder="Ej: Calle 10 # 5-20"
                            />
                        </div>

                        {/* Teléfono */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-purple-400 flex items-center gap-2">
                                <Phone size={12} /> Teléfono
                            </label>
                            <input
                                type="text"
                                value={config.telefono}
                                onChange={(e) => setConfig({ ...config, telefono: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-purple-500 transition-all font-bold"
                                placeholder="Ej: +57 321 000 0000"
                            />
                        </div>

                        {/* Moneda */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-purple-400 flex items-center gap-2">
                                <DollarSign size={12} /> Símbolo Moneda
                            </label>
                            <input
                                type="text"
                                value={config.moneda}
                                onChange={(e) => setConfig({ ...config, moneda: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-purple-500 transition-all font-bold"
                                placeholder="Ej: $"
                            />
                        </div>

                        {/* Impuesto */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-purple-400 flex items-center gap-2">
                                <Percent size={12} /> Impuesto (%)
                            </label>
                            <input
                                type="number"
                                value={config.impuesto_porcentaje}
                                onChange={(e) => setConfig({ ...config, impuesto_porcentaje: parseFloat(e.target.value) || 0 })}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-purple-500 transition-all font-bold"
                                placeholder="Ej: 8"
                            />
                        </div>
                    </div>

                    {/* Mensaje Footer */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-purple-400 flex items-center gap-2">
                            <MessageSquare size={12} /> Mensaje al final del ticket
                        </label>
                        <textarea
                            value={config.mensaje_footer}
                            onChange={(e) => setConfig({ ...config, mensaje_footer: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-purple-500 transition-all font-bold h-32 resize-none"
                            placeholder="Ej: ¡Muchas gracias por su preferencia! Vuelva pronto."
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full py-5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black tracking-widest uppercase text-sm shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transform hover:scale-[1.01] transition-all flex items-center justify-center gap-3"
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
