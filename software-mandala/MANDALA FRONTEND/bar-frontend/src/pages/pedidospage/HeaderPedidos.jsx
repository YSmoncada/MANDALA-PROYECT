// src/components/HeaderPedidos.jsx
import { Link, useLocation } from "react-router-dom";

export default function HeaderPedidos({ mesera, onLogout, codigoConfirmado }) {
  const location = useLocation();

  // Define las clases de estilo para los botones
  const baseClasses = "flex items-center space-x-1 px-3 py-1 rounded-lg transition";
  const activeClasses = "bg-purple-600 hover:bg-purple-700"; // Estilo para el botón activo
  const inactiveClasses = "hover:bg-white/10"; // Estilo para los botones inactivos

  return (
    <header className="bg-[rgb(37,17,66)] text-white shadow-md relative">
      <div className="flex items-center justify-between px-6 h-16">
        {/* Título del Sistema con diseño mejorado */}
        <div>
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#A944FF] to-[#FF4BC1]">
            Sistema de Pedidos
          </h1>
        </div>

        {/* Botones de navegación */}
        <nav className="flex items-center space-x-2">
          {mesera ? (
            <Link
              to="/login"
              className={`${baseClasses} ${location.pathname === '/login' ? activeClasses : inactiveClasses}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Menú</span>
            </Link>
          ) : (
            <span
              className="flex items-center space-x-1 text-gray-500 cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Menu</span>
            </span>
          )}

          {mesera && codigoConfirmado ? (
            <Link
              to="/pedidos"
              className={`${baseClasses} ${location.pathname === '/pedidos' ? activeClasses : inactiveClasses}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18l-1 9H4L3 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 16a2 2 0 11-4 0m8 0a2 2 0 11-4 0" />
              </svg>
              <span>Pedido</span>
            </Link>
          ) : (
            <span className="flex items-center space-x-1 text-gray-500 cursor-not-allowed">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18l-1 9H4L3 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 16a2 2 0 11-4 0m8 0a2 2 0 11-4 0" />
              </svg>
              <span>Pedido</span>
            </span>
          )}

          {mesera && codigoConfirmado ? (
            <Link
              to="/historial-pedidos"
              className={`${baseClasses} ${location.pathname === '/historial-pedidos' ? activeClasses : inactiveClasses}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Historial</span>
            </Link>
          ) : (
            <span className="flex items-center space-x-1 text-gray-500 cursor-not-allowed">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Historial</span>
            </span>
          )}

          {/* NUEVO: Botón de cerrar sesión */}
          {mesera && (
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg transition text-white"
            >
              Cerrar sesión
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
