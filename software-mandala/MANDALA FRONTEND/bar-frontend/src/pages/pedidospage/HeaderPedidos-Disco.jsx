import React, { useState, memo } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, ShoppingCart, Clock, Home as HomeIcon } from 'lucide-react';

/**
 * Header component for the pedidos section.
 * Memoized to prevent unnecessary re-renders.
 */
function HeaderPedidosDisco({ user, onLogout, codigoConfirmado }) {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogoutClick = () => {
        if (onLogout) {
            onLogout();
        }
        setIsMenuOpen(false);
    };

    const activeClasses = "bg-white text-black border border-white shadow-xl";
    const inactiveClasses = "text-zinc-500 hover:text-white hover:bg-zinc-900";

    const navLinks = [
        { href: "/pedidos-disco", label: "Menú", icon: <HomeIcon size={18} /> },
        { href: "/pedidos", label: "Pedido", icon: <ShoppingCart size={18} /> },
        { href: "/mis-pedidos-disco", label: "Mis Pedidos", icon: <Clock size={18} /> },
    ];

    return (
        <>
            <div className="h-20 w-full"></div>

            <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/5 shadow-2xl">
                <div className="w-full px-6 sm:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* LEFT CORNER: Logo */}
                        <div className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-white/10 blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                                <h1 className="relative text-2xl font-black text-white tracking-[0.1em] uppercase">
                                    Nox<span className="text-zinc-500">OS</span>
                                </h1>
                            </div>
                        </div>

                        {/* RIGHT CORNER: Navigation & User Profile */}
                        <div className="flex items-center gap-6">

                            {/* Desktop Nav */}
                            <nav className="hidden md:flex items-center gap-2">
                                {navLinks.map(link => {
                                    const isEnabled = user && (link.href === '/' || codigoConfirmado);
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

                            {/* User Profile */}
                            <div className="hidden md:flex items-center gap-4">
                                {user && (
                                    <>
                                        <div className="flex items-center gap-3 mr-2 border-r border-white/10 pr-6">
                                            <div className="flex flex-col items-end">
                                                <span className="text-white font-bold text-sm leading-tight capitalize">{user}</span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                    <span className="text-[10px] text-emerald-500 font-bold tracking-wider uppercase">En turno</span>
                                                </div>
                                            </div>
                                            <div className="w-9 h-9 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-white font-bold shadow-lg">
                                                {user.charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                        <button
                                            onClick={onLogout}
                                            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-2 rounded-lg transition-all duration-300 border border-red-500/20 hover:border-red-500/40"
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
                                    className="text-white p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                                >
                                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-black border-b border-white/10 absolute w-full shadow-2xl backdrop-blur-xl">
                        <div className="px-4 pt-4 pb-6 space-y-2">
                            {user && (
                                <div className="mb-6 pb-6 border-b border-white/10 flex items-center justify-end">
                                    <button
                                        onClick={handleLogoutClick}
                                        className="flex items-center gap-2 text-red-400 bg-red-500/10 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide border border-red-500/20"
                                    >
                                        <LogOut size={16} /> Salir
                                    </button>
                                </div>
                            )}

                            {navLinks.map(link => {
                                const isEnabled = user && (link.href === '/' || codigoConfirmado);
                                return isEnabled ? (
                                    <Link
                                        key={link.href}
                                        to={link.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-bold transition-all ${location.pathname === link.href
                                            ? "bg-white text-black border border-white"
                                            : "text-zinc-500 hover:bg-zinc-900 hover:text-white"
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

export default memo(HeaderPedidosDisco);
