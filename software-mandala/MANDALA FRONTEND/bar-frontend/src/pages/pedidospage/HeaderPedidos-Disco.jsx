import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, ShoppingCart, Clock, Home as HomeIcon, DollarSign } from 'lucide-react';

export default function HeaderPedidosDisco({ mesera, onLogout, codigoConfirmado }) {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogoutClick = () => {
        if (onLogout) {
            onLogout();
        }
        setIsMenuOpen(false);
    };

    // Enhanced Original Style Matching
    // Gradient accents from Pedidos.jsx
    const activeClasses = "bg-[#441E73] text-white border border-[#A944FF]/50 shadow-[0_0_15px_rgba(169,68,255,0.3)]";
    const inactiveClasses = "text-[#C2B6D9] hover:text-white hover:bg-[#441E73]/50";

    const navLinks = [
        { href: "/login-mesera-pedidos", label: "Menú", icon: <ShoppingCart size={18} /> },
        { href: "/mis-pedidos-disco", label: "Mis Pedidos", icon: <Clock size={18} /> },
        { href: "/", label: "Inicio", icon: <HomeIcon size={18} /> },
    ];

    return (
        <>
            <div className="h-20 w-full"></div>

            <header className="fixed top-0 left-0 right-0 z-50 bg-[#0E0D23]/90 backdrop-blur-md border-b border-[#6C3FA8]/30 shadow-lg">
                <div className="w-full px-6 sm:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* LEFT CORNER: Logo */}
                        <div className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                                <h1 className="relative text-2xl font-bold text-white tracking-widest drop-shadow-[0_0_10px_rgba(169,68,255,0.5)]">
                                    MANDALA
                                </h1>
                            </div>
                        </div>

                        {/* RIGHT CORNER: Navigation & User Profile */}
                        <div className="flex items-center gap-6">

                            {/* Desktop Nav - Moved to right side */}
                            <nav className="hidden md:flex items-center gap-2">
                                {navLinks.map(link => {
                                    const isEnabled = mesera && (link.href === '/' || codigoConfirmado);
                                    return isEnabled ? (
                                        <Link
                                            key={link.href}
                                            to={link.href}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-bold text-sm tracking-wide ${location.pathname === link.href ? activeClasses : inactiveClasses}`}
                                        >
                                            {link.icon}
                                            <span>{link.label}</span>
                                        </Link>
                                    ) : null;
                                })}
                            </nav>

                            {/* User Profile - Simplified to just Logout */}
                            <div className="hidden md:flex items-center gap-4">
                                {mesera && (
                                    <>
                                        <div className="flex items-center gap-3 mr-2 border-r border-[#6C3FA8]/30 pr-6">
                                            <div className="flex flex-col items-end">
                                                <span className="text-white font-bold text-sm leading-tight capitalize">{mesera}</span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                                    <span className="text-[10px] text-green-400 font-bold tracking-wider uppercase">En turno</span>
                                                </div>
                                            </div>
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#441E73] to-[#6C3FA8] border border-[#A944FF]/50 flex items-center justify-center text-white font-bold shadow-[0_0_10px_rgba(169,68,255,0.3)]">
                                                {mesera.charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                        <button
                                            onClick={onLogout}
                                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg transition-all duration-300 border border-red-500/20 hover:border-red-500/40"
                                            title="Cerrar sesión"
                                        >
                                            <LogOut size={18} />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Mobile Toggle */}
                            <div className="md:hidden">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="text-white p-2 hover:bg-[#441E73]/50 rounded-lg transition-colors"
                                >
                                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-[#0E0D23]/95 border-b border-[#6C3FA8]/30 absolute w-full shadow-2xl backdrop-blur-xl">
                        <div className="px-4 pt-4 pb-6 space-y-2">
                            {mesera && (
                                <div className="mb-6 pb-6 border-b border-[#6C3FA8]/30 flex items-center justify-end">
                                    <button
                                        onClick={handleLogoutClick}
                                        className="flex items-center gap-2 text-red-400 bg-red-500/10 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide border border-red-500/20"
                                    >
                                        <LogOut size={16} /> Salir
                                    </button>
                                </div>
                            )}

                            {navLinks.map(link => {
                                const isEnabled = mesera && (link.href === '/' || codigoConfirmado);
                                return isEnabled ? (
                                    <Link
                                        key={link.href}
                                        to={link.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-bold transition-all ${location.pathname === link.href
                                            ? "bg-[#441E73] text-white border border-[#A944FF]/50"
                                            : "text-[#C2B6D9] hover:bg-[#441E73]/50 hover:text-white"
                                            }`}
                                    >
                                        {link.icon} {link.label}
                                    </Link>
                                ) : null;
                            })}
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}
