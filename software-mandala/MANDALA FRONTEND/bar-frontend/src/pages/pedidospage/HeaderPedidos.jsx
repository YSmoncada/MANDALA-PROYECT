// src/components/HeaderPedidos.jsx
import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, ShoppingCart, Clock, Home as HomeIcon } from 'lucide-react';

export default function HeaderPedidos({ mesera, onLogout, codigoConfirmado }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Nueva función para manejar el logout y cerrar el menú
  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
    setIsMenuOpen(false); // Cierra el menú
  };
  // Define las clases de estilo para los botones
  const baseClasses = "flex items-center space-x-1 px-3 py-1 rounded-lg transition";
  const activeClasses = "bg-purple-600 hover:bg-purple-700"; // Estilo para el botón activo
  const inactiveClasses = "hover:bg-white/10"; // Estilo para los botones inactivos

  const navLinks = [
    { href: "/login", label: "Menú", icon: <HomeIcon size={18} /> },
    { href: "/pedidos", label: "Pedido", icon: <ShoppingCart size={18} /> },
    { href: "/historial-pedidos", label: "Historial", icon: <Clock size={18} /> },
  ];

  return (
    <header className="bg-[#1A0933]/80 backdrop-blur-sm sticky top-0 z-50 text-white p-4 sm:px-6 shadow-lg shadow-black/20">
      <div className="flex items-center justify-between h-full">
        {/* Título del Sistema con diseño mejorado */}
        <div>
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#A944FF] to-[#FF4BC1]">
            Sistema de Pedidos
          </h1>
        </div>

        {/* Menú de Navegación para Desktop/Tablet (se oculta en móvil) */}
        <nav className="hidden sm:flex items-center space-x-2">
          {navLinks.map(link => {
            const isEnabled = mesera && (link.href === '/login' || codigoConfirmado);
            return isEnabled ? (
              <Link
                key={link.href}
                to={link.href}
                className={`${baseClasses} ${location.pathname === link.href ? activeClasses : inactiveClasses}`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ) : (
              <span key={link.href} className={`${baseClasses} text-gray-500 cursor-not-allowed`}>
                {link.icon}
                <span>{link.label}</span>
              </span>
            );
          })}
          {mesera && (
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg transition text-white"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
          )}
        </nav>

        {/* Botón de Menú para Móvil (se oculta en desktop/tablet) */}
        <div className="sm:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú Desplegable para Móvil */}
      {isMenuOpen && (
        <div className="sm:hidden mt-4 bg-[#2B0D49]/90 rounded-lg p-4">
          <nav className="flex flex-col gap-4">
            {navLinks.map(link => {
              const isEnabled = mesera && (link.href === '/login' || codigoConfirmado);
              return isEnabled ? (
                <Link key={link.href} to={link.href} onClick={() => setIsMenuOpen(false)} className="text-gray-200 hover:text-white text-lg py-2 flex items-center gap-3">
                  {link.icon} {link.label}
                </Link>
              ) : (
                <span key={link.href} className="text-gray-500 text-lg py-2 flex items-center gap-3">{link.icon} {link.label}</span>
              );
            })}
            {mesera && (
              <div className="border-t border-purple-800 pt-4 mt-2">
                <button onClick={handleLogoutClick} className="flex items-center gap-3 text-red-400 hover:text-red-300 text-lg py-2 w-full">
                  <LogOut size={20} /> Cerrar Sesión
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
