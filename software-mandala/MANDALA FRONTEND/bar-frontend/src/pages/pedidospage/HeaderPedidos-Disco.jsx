import React, { useState, memo } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, ShoppingCart, Clock, Home as HomeIcon } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';

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

    const activeClasses = "bg-zinc-900 dark:bg-white text-white dark:text-black border border-white/10 dark:border-white shadow-xl";
    const inactiveClasses = "text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900";

    const navLinks = [
        { href: "/pedidos-disco", label: "Menú", icon: <HomeIcon size={18} /> },
        { href: "/pedidos", label: "Pedido", icon: <ShoppingCart size={18} /> },
        { href: "/mis-pedidos-disco", label: "Mis Pedidos", icon: <Clock size={18} /> },
    ];

    return (
        <>
            <div className="h-20 w-full"></div>

            <header className="fixed top-0 left-0 right-0 z-50 bg-[#0E0D23]/90 dark:bg-black/95 backdrop-blur-xl border-b border-white/10 dark:border-white/5 transition-all duration-500">
                <div className="w-full px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* LEFT: App Identity */}
                        <div className="flex items-center gap-4">
                            <div className="h-8 w-1.5 bg-gradient-to-b from-[#A944FF] to-transparent rounded-full"></div>
                            <h1 className="text-2xl font-black text-white dark:text-white tracking-widest uppercase italic">
                                Nox<span className="text-[#A944FF] dark:text-zinc-500">OS</span>
                            </h1>
                        </div>

                        {/* CENTER/RIGHT: Nav & Profile */}
                        <div className="flex items-center gap-10">
                            {/* Desktop Navigation */}
                            <nav className="hidden md:flex items-center gap-4 bg-black/40 dark:bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5">
                                {navLinks.map(link => {
                                    const isEnabled = user && (link.href === '/' || codigoConfirmado);
                                    const isActive = location.pathname === link.href;
                                    
                                    return isEnabled ? (
                                        <Link
                                            key={link.href}
                                            to={link.href}
                                            className={`flex items-center gap-3 px-6 py-2.5 rounded-xl transition-all duration-500 font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl ${isActive 
                                                ? "bg-[#A944FF] dark:bg-white text-white dark:text-black border border-white/20 shadow-[#A944FF]/20" 
                                                : "text-[#8A7BAF] dark:text-zinc-500 hover:text-white hover:bg-white/5"}`}
                                        >
                                            <span className={isActive ? "animate-pulse" : ""}>{link.icon}</span>
                                            <span>{link.label}</span>
                                        </Link>
                                    ) : null;
                                })}
                            </nav>

                            {/* Actions Area */}
                            <div className="flex items-center gap-6">
                                <ThemeToggle />
                                
                                {user && (
                                    <div className="flex items-center gap-6 border-l border-white/10 dark:border-white/5 pl-6">
                                        <div className="flex flex-col items-end">
                                            <span className="text-white dark:text-zinc-200 font-black text-xs uppercase tracking-widest italic">{user}</span>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                <span className="text-[9px] text-emerald-400 font-black tracking-[0.2em] uppercase">Online</span>
                                            </div>
                                        </div>
                                        
                                        <button
                                            onClick={handleLogoutClick}
                                            className="group flex items-center justify-center w-10 h-10 rounded-xl bg-rose-500/10 hover:bg-rose-500 dark:hover:bg-rose-600 text-rose-500 hover:text-white transition-all duration-500 border border-rose-500/20 shadow-lg shadow-rose-500/5 active:scale-90"
                                            title="Logout"
                                        >
                                            <LogOut size={18} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Burger */}
                            <div className="md:hidden">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="text-white p-3 hover:bg-white/5 rounded-2xl transition-all"
                                >
                                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Panel */}
                {isMenuOpen && (
                    <div className="md:hidden bg-[#0E0D23]/95 dark:bg-black/95 border-b border-white/10 absolute w-full shadow-2xl backdrop-blur-3xl animate-fadeIn">
                        <div className="px-6 pt-6 pb-10 space-y-4">
                            {navLinks.map(link => {
                                const isEnabled = user && (link.href === '/' || codigoConfirmado);
                                const isActive = location.pathname === link.href;
                                
                                return isEnabled ? (
                                    <Link
                                        key={link.href}
                                        to={link.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex items-center gap-5 px-6 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all ${isActive
                                            ? "bg-[#A944FF] text-white border border-white/20"
                                            : "text-[#8A7BAF] hover:bg-white/5 hover:text-white"
                                            }`}
                                    >
                                        {link.icon} {link.label}
                                    </Link>
                                ) : null;
                            })}
                            
                            {user && (
                                <button
                                    onClick={handleLogoutClick}
                                    className="w-full flex items-center justify-center gap-3 text-rose-500 bg-rose-500/10 px-6 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border border-rose-500/20 mt-6"
                                >
                                    <LogOut size={18} /> Finalizar Turno
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}

export default memo(HeaderPedidosDisco);
