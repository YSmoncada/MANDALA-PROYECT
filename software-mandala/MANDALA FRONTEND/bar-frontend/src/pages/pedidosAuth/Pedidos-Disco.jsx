import React, { useState } from "react";
import { User, Lock, ArrowLeft, Plus, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeaderPedidosDisco from "../pedidospage/HeaderPedidos-Disco";
import CodeInputDisco from "./CodeInput-Disco";
import ProductGridDisco from "./ProductGrid-Disco";
import { usePedidosContext } from "../../context/PedidosContext";

export default function PedidosDisco() {
    const { auth, addProductToOrder: onProductAdd } = usePedidosContext();

    const {
        mesera,
        codigoConfirmado,
        isInitialized,
        meseras,
        handleSelectMesera,
        handleCodigoSubmit,
        handleLogout,
        addMesera,
        deleteMesera,
    } = auth;

    const [showAddForm, setShowAddForm] = useState(false);
    const [newMeseraName, setNewMeseraName] = useState("");
    const [newMeseraCode, setNewMeseraCode] = useState("");
    const navigate = useNavigate();

    // Redirección si ya está logueado
    useEffect(() => {
        if (mesera && codigoConfirmado) {
            navigate('/login-disco', { replace: true });
        }
    }, [mesera, codigoConfirmado, navigate]);

    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-purple-400 font-bold tracking-widest text-xs">CARGANDO...</p>
                </div>
            </div>
        );
    }

    const handleAddMeseraSubmit = async (e) => {
        e.preventDefault();
        if (newMeseraName.trim() === "" || newMeseraCode.length !== 4) {
            alert("Por favor, complete el nombre y un código de 4 dígitos.");
            return;
        }
        const result = await addMesera(newMeseraName, newMeseraCode);
        if (!result.success) {
            alert(`Error: ${result.message}`);
        } else {
            setShowAddForm(false);
            setNewMeseraName("");
            setNewMeseraCode("");
        }
    };

    const handleDeleteClick = async (e, meseraObj) => {
        e.stopPropagation();
        if (window.confirm(`¿Estás seguro de que quieres eliminar a ${meseraObj.nombre}?`)) {
            const result = await deleteMesera(meseraObj.id);
            if (!result.success) {
                alert(`Error: ${result.message}`);
            }
        }
    };

    return (
        // Unified Background: Matches Home-Disco and Inventario-Disco
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white selection:bg-purple-500/30">
            {/* Background Glows matching Home-Disco */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
            </div>

            {mesera && codigoConfirmado && (
                <HeaderPedidosDisco mesera={mesera} onLogout={handleLogout} codigoConfirmado={codigoConfirmado} />
            )}

            {/* Adjusted padding - only add top padding when header is visible */}
            <div className={`flex flex-1 items-center justify-center p-4 sm:p-8 relative z-10 ${mesera && codigoConfirmado ? 'pt-20 sm:pt-24' : ''}`}>

                {/* Add New Mesera Form */}
                {showAddForm && !mesera && (
                    <div className="bg-[#441E73]/80 backdrop-blur-xl border border-[#6C3FA8] p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.3)] w-full max-w-md text-center animate-fadeIn relative overflow-hidden">
                        {/* Glow Effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A944FF] to-transparent"></div>

                        <div className="w-16 h-16 bg-gradient-to-br from-[#A944FF] to-[#FF4BC1] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#A944FF]/20">
                            <Sparkles size={24} className="text-white" />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">Nueva Mesera</h2>
                        <p className="text-[#C2B6D9] text-sm mb-8">Crea un perfil para acceder al sistema</p>

                        <form onSubmit={handleAddMeseraSubmit} className="flex flex-col gap-4">
                            <div className="group relative">
                                <User className="absolute left-4 top-3.5 text-[#8A7BAF] group-focus-within:text-[#A944FF] transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Nombre completo"
                                    value={newMeseraName}
                                    onChange={(e) => setNewMeseraName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#2B0D49] border border-[#6C3FA8]/30 text-white placeholder-[#8A7BAF] focus:outline-none focus:bg-[#2B0D49]/80 focus:border-[#A944FF] focus:ring-1 focus:ring-[#A944FF] transition-all"
                                />
                            </div>
                            <div className="group relative">
                                <Lock className="absolute left-4 top-3.5 text-[#8A7BAF] group-focus-within:text-[#A944FF] transition-colors" size={18} />
                                <input
                                    type="password"
                                    inputMode="numeric"
                                    placeholder="Código de 4 dígitos"
                                    value={newMeseraCode}
                                    onChange={(e) => /^\d{0,4}$/.test(e.target.value) && setNewMeseraCode(e.target.value)}
                                    maxLength={4}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#2B0D49] border border-[#6C3FA8]/30 text-white placeholder-[#8A7BAF] focus:outline-none focus:bg-[#2B0D49]/80 focus:border-[#A944FF] focus:ring-1 focus:ring-[#A944FF] transition-all tracking-widest"
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-[#C2B6D9] py-3 rounded-xl font-bold transition-all text-sm tracking-wide border border-white/5">CANCELAR</button>
                                <button type="submit" className="flex-1 bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] hover:brightness-110 text-white py-3 rounded-xl font-bold shadow-lg shadow-[#A944FF]/30 transition-all transform hover:scale-[1.02] text-sm tracking-wide">GUARDAR</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Step 1: Select Mesera */}
                {!mesera && !codigoConfirmado && !showAddForm && (
                    <div className="w-full max-w-6xl mx-auto -mt-16">
                        <button
                            onClick={() => navigate("/")}
                            // Fixed position for mobile (top-4), absolute for desktop (sm:top-6 sm:left-6)
                            className="fixed top-4 left-4 sm:absolute sm:top-6 sm:left-6 z-50 flex items-center gap-2 rounded-lg bg-[#441E73]/50 border border-[#6C3FA8] px-4 py-2 text-white hover:bg-[#441E73] transition-all backdrop-blur-md shadow-lg hover:scale-105"
                        >
                            <ArrowLeft size={18} />
                            <span className="font-medium">Volver</span>
                        </button>

                        <div className="text-center mb-12 mt-16 sm:mt-2">
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-[0_0_25px_rgba(169,68,255,0.4)]">
                                BIENVENIDA
                            </h1>
                            <p className="text-xl text-[#C2B6D9] font-light tracking-wide">Selecciona tu perfil para ingresar</p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-6">
                            {meseras.map((meseraObj) => (
                                <button
                                    key={meseraObj.id}
                                    onClick={() => handleSelectMesera(meseraObj)}
                                    // Reduced padding (p-8 -> p-6) and adjusted sizing
                                    className="group relative flex flex-col items-center gap-4 bg-[#6C3FA8]/20 hover:bg-[#6C3FA8]/40 border border-[#6C3FA8] hover:border-[#A944FF] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(169,68,255,0.2)] backdrop-blur-sm w-48"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-[#A944FF] blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-full"></div>
                                        {/* Reduced avatar size (w-20 h-20 -> w-16 h-16) */}
                                        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#441E73] to-[#6C3FA8] flex items-center justify-center text-2xl font-bold text-white shadow-inner group-hover:scale-110 transition-transform duration-300 border border-[#6C3FA8]">
                                            {meseraObj.nombre.charAt(0).toUpperCase()}
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <span className="text-lg font-bold text-white block mb-1 group-hover:text-[#FF4BC1] transition-colors truncate max-w-[120px]">{meseraObj.nombre}</span>
                                        <span className="text-[10px] text-[#8A7BAF] uppercase tracking-widest font-bold group-hover:text-[#C2B6D9] transition-colors">Mesera</span>
                                    </div>

                                    <div
                                        onClick={(e) => handleDeleteClick(e, meseraObj)}
                                        className="absolute top-2 right-2 p-1.5 text-[#8A7BAF] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                    >
                                        <Trash2Icon />
                                    </div>
                                </button>
                            ))}

                            {/* Add New Button - Adjusted size */}
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="flex flex-col items-center justify-center gap-3 min-h-[180px] border-2 border-dashed border-[#6C3FA8] hover:border-[#A944FF] hover:bg-[#441E73]/20 rounded-2xl text-[#8A7BAF] hover:text-white transition-all duration-300 group w-48"
                            >
                                <div className="w-12 h-12 rounded-full bg-[#441E73]/30 flex items-center justify-center group-hover:bg-[#A944FF]/20 transition-all duration-300">
                                    <Plus size={20} className="group-hover:text-[#A944FF] transition-colors" />
                                </div>
                                <span className="font-bold text-xs tracking-widest uppercase">Nueva Mesera</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Code Input */}
                {mesera && !codigoConfirmado && (
                    <div className="w-full max-w-md animate-fadeIn flex justify-center">
                        <CodeInputDisco
                            mesera={mesera}
                            onBack={handleLogout}
                            onSubmit={handleCodigoSubmit}
                        />
                    </div>
                )}
                {/* Step 3: Product Grid */}
                {mesera && codigoConfirmado && (
                    <div className="w-full max-w-[1600px] mx-auto">

                        <ProductGridDisco
                            onProductAdd={onProductAdd}
                        />
                    </div>
                )}

            </div >
        </div >
    );
}

function Trash2Icon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
    )
}
