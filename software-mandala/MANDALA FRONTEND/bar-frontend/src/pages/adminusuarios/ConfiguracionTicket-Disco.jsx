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
        <div className="min-h-screen bg-transparent flex flex-col items-center justify-center transition-all duration-500">
            <div className="w-20 h-20 border-4 border-[#6C3FA8]/20 dark:border-zinc-800 border-t-[#A944FF] dark:border-t-white rounded-[2rem] animate-spin mb-8 shadow-2xl"></div>
            <p className="text-[#8A7BAF] dark:text-zinc-500 font-black uppercase tracking-[0.4em] text-[11px] animate-pulse">Sincronizando Sistema...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-transparent text-white dark:text-white transition-colors duration-500 pb-20">
            {/* Subtle background effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#441E73]/10 dark:bg-zinc-900/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#A944FF]/5 dark:bg-white/5 rounded-full blur-[100px]"></div>
            </div>

            <header className="relative z-20 p-8 sm:p-10 mb-8">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => navigate('/usuarios-disco')} 
                            className="p-4 rounded-2xl bg-[#0E0D23] dark:bg-zinc-800 hover:bg-[#1A103C] dark:hover:bg-zinc-700 text-[#8A7BAF] dark:text-zinc-400 hover:text-white dark:hover:text-white transition-all border border-white/5 shadow-2xl active:scale-90 group"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div className="text-center sm:text-left">
                            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white dark:text-white flex items-center gap-4 uppercase italic drop-shadow-2xl">
                                Configuración
                            </h1>
                            <p className="text-[10px] text-[#A944FF] dark:text-zinc-500 font-black tracking-[0.4em] uppercase ml-1 mt-1">Identidad de Facturación</p>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        className="flex items-center gap-3 px-10 py-4 bg-[#A944FF] dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:brightness-110 active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(169,68,255,0.4)] dark:shadow-none"
                    >
                        <Save size={18} /> Guardar Cambios
                    </button>
                </div>
            </header>

            <main className="relative z-10 px-4 sm:px-8 max-w-4xl mx-auto">
                <div className="bg-[#1A103C]/80 dark:bg-zinc-900/30 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-[3rem] p-8 sm:p-12 space-y-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] dark:shadow-none">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Nombre del Establecimiento */}
                        <div className="space-y-4 group">
                            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-[#8A7BAF] dark:text-zinc-500 flex items-center gap-3 ml-1 group-focus-within:text-[#A944FF] transition-colors">
                                <Building2 size={14} className="text-[#A944FF]" /> Nombre Comercial
                            </label>
                            <input
                                type="text"
                                value={config.nombre}
                                onChange={(e) => setConfig({...config, nombre: e.target.value})}
                                className="w-full bg-[#0E0D23] dark:bg-black/50 border-2 border-[#6C3FA8]/30 dark:border-white/5 text-white dark:text-white rounded-2xl p-5 text-sm font-bold placeholder-[#8A7BAF]/20 focus:border-[#A944FF] dark:focus:border-white outline-none transition-all uppercase tracking-widest"
                                placeholder="E.g. MANDALA DISCO CLUB"
                            />
                        </div>

                        {/* NIT */}
                        <div className="space-y-4 group">
                            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-[#8A7BAF] dark:text-zinc-500 flex items-center gap-3 ml-1 group-focus-within:text-[#A944FF] transition-colors">
                                <Hash size={14} className="text-[#A944FF]" /> NIT / Identificación
                            </label>
                            <input
                                type="text"
                                value={config.nit}
                                onChange={(e) => setConfig({...config, nit: e.target.value})}
                                className="w-full bg-[#0E0D23] dark:bg-black/50 border-2 border-[#6C3FA8]/30 dark:border-white/5 text-white dark:text-white rounded-2xl p-5 text-sm font-bold placeholder-[#8A7BAF]/20 focus:border-[#A944FF] dark:focus:border-white outline-none transition-all"
                                placeholder="E.g. 900.123.456-7"
                            />
                        </div>

                        {/* Dirección */}
                        <div className="space-y-4 group">
                            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-[#8A7BAF] dark:text-zinc-500 flex items-center gap-3 ml-1 group-focus-within:text-[#A944FF] transition-colors">
                                <MapPin size={14} className="text-[#A944FF]" /> Dirección Física
                            </label>
                            <input
                                type="text"
                                value={config.direccion}
                                onChange={(e) => setConfig({...config, direccion: e.target.value})}
                                className="w-full bg-[#0E0D23] dark:bg-black/50 border-2 border-[#6C3FA8]/30 dark:border-white/5 text-white dark:text-white rounded-2xl p-5 text-sm font-bold placeholder-[#8A7BAF]/20 focus:border-[#A944FF] dark:focus:border-white outline-none transition-all uppercase"
                                placeholder="E.g. CALLE 10 # 5-20"
                            />
                        </div>

                        {/* Teléfono */}
                        <div className="space-y-4 group">
                            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-[#8A7BAF] dark:text-zinc-500 flex items-center gap-3 ml-1 group-focus-within:text-[#A944FF] transition-colors">
                                <Phone size={14} className="text-[#A944FF]" /> Contacto Telefónico
                            </label>
                            <input
                                type="text"
                                value={config.telefono}
                                onChange={(e) => setConfig({...config, telefono: e.target.value})}
                                className="w-full bg-[#0E0D23] dark:bg-black/50 border-2 border-[#6C3FA8]/30 dark:border-white/5 text-white dark:text-white rounded-2xl p-5 text-sm font-bold placeholder-[#8A7BAF]/20 focus:border-[#A944FF] dark:focus:border-white outline-none transition-all"
                                placeholder="E.g. +57 321 000 0000"
                            />
                        </div>

                        {/* Moneda */}
                        <div className="space-y-4 group">
                            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-[#8A7BAF] dark:text-zinc-500 flex items-center gap-3 ml-1 group-focus-within:text-[#A944FF] transition-colors">
                                <DollarSign size={14} className="text-[#A944FF]" /> Símbolo Monetario
                            </label>
                            <input
                                type="text"
                                value={config.moneda}
                                onChange={(e) => setConfig({...config, moneda: e.target.value})}
                                className="w-full bg-[#0E0D23] dark:bg-black/50 border-2 border-[#6C3FA8]/30 dark:border-white/5 text-white dark:text-white rounded-2xl p-5 text-sm font-bold placeholder-[#8A7BAF]/20 focus:border-[#A944FF] dark:focus:border-white outline-none transition-all text-center"
                                placeholder="$"
                            />
                        </div>

                        {/* Impuesto */}
                        <div className="space-y-4 group">
                            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-[#8A7BAF] dark:text-zinc-500 flex items-center gap-3 ml-1 group-focus-within:text-[#A944FF] transition-colors">
                                <Percent size={14} className="text-[#A944FF]" /> Impuesto / Consumo (%)
                            </label>
                            <input
                                type="number"
                                value={config.impuesto_porcentaje}
                                onChange={(e) => setConfig({...config, impuesto_porcentaje: e.target.value})}
                                className="w-full bg-[#0E0D23] dark:bg-black/50 border-2 border-[#6C3FA8]/30 dark:border-white/5 text-white dark:text-white rounded-2xl p-5 text-sm font-bold focus:border-[#A944FF] dark:focus:border-white outline-none transition-all text-center"
                            />
                        </div>
                    </div>

                    {/* Footer Message */}
                    <div className="space-y-4 group">
                        <label className="text-[10px] font-black uppercase tracking-[0.25em] text-[#8A7BAF] dark:text-zinc-500 flex items-center gap-3 ml-1 group-focus-within:text-[#A944FF] transition-colors">
                            <MessageSquare size={14} className="text-[#A944FF]" /> Mensaje de Pie de Página (Ticket)
                        </label>
                        <textarea
                            value={config.mensaje_footer}
                            onChange={(e) => setConfig({...config, mensaje_footer: e.target.value})}
                            className="w-full bg-[#0E0D23] dark:bg-black/50 border-2 border-[#6C3FA8]/30 dark:border-white/5 text-white dark:text-white rounded-3xl p-6 text-sm font-bold placeholder-[#8A7BAF]/20 focus:border-[#A944FF] dark:focus:border-white outline-none transition-all min-h-[120px] resize-none uppercase"
                            placeholder="E.g. GRACIAS POR SU COMPRA - VUELVA PRONTO"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ConfiguracionTicketDisco;
