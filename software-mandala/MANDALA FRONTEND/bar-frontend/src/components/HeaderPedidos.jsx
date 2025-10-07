// src/components/HeaderPedidos.jsx
import { Link } from "react-router-dom";

export default function HeaderPedidos({ mesera, onLogout }) {
  return (
    <header className="bg-[rgb(37,17,66)] text-white shadow-md relative">
      <div className="flex items-center justify-between px-6 h-16">
        {/* Logo + título */}
        <div className="flex items-center space-x-3">
          <div className="bg-pink-400 p-2 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5.121 17.804A9.969 9.969 0 0112 15c2.21 0 4.236.72 5.879 1.927M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-lg">Disco Bar</h1>
            <p className="text-sm text-gray-300">Sistema de Pedidos</p>
          </div>
        </div>

        {/* Botones de navegación */}
        <nav className="flex items-center space-x-6">
          {mesera ? (
            <Link
              to="/login"
              className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-lg transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Menú</span>
            </Link>
          ) : (
            <span className="flex items-center space-x-1 bg-purple-800/50 text-gray-400 px-3 py-1 rounded-lg cursor-not-allowed">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Menú</span>
            </span>
          )}

          {mesera ? (
            <Link to="/pedidos" className="flex items-center space-x-1 hover:text-pink-400">
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

          {mesera ? (
            <Link to="/historial" className="flex items-center space-x-1 hover:text-pink-400">
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
