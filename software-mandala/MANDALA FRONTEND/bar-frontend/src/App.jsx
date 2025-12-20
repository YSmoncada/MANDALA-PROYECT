// src/App.jsx
import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from "./components/ProtectedRoute";
import Notificaciones from "./components/Notificaciones";

// Lazy loading de componentes para mejorar el rendimiento
const Inventario = lazy(() => import("./pages/inventario/Inventario"));
const Home = lazy(() => import("./pages/home/Home-Disco"));
const HistorialPedidosPageDisco = lazy(() => import("./pages/historialpedidos/HistorialPedidosPage-Disco"));
const PedidosDisco = lazy(() => import("./pages/pedidosAuth/Pedidos-Disco"));
const PedidosPageDisco = lazy(() => import("./pages/pedidospage/PedidosPage-Disco"));
const SeleccionProductosDisco = lazy(() => import("./pages/pedidospage/SeleccionProductos-Disco")); // Página de selección de productos
const MisPedidosPageDisco = lazy(() => import("./pages/pedidospage/MisPedidosPage-Disco")); // 🎨 Disco Mis Pedidos
const ContabilidadDisco = lazy(() => import("./pages/contabilidad/Contabilidad-Disco")); // 🎨 Disco Contabilidad
const MesasPageDisco = lazy(() => import("./pages/mesas/MesasPage-Disco"));
const BartenderPageDisco = lazy(() => import("./pages/bartender/BartenderPage-Disco"));
const AdminUsuariosDisco = lazy(() => import("./pages/adminusuarios/AdminUsuarios-Disco"));
const ConfiguracionTicketDisco = lazy(() => import("./pages/adminusuarios/ConfiguracionTicket-Disco"));
const PedidosLayout = lazy(() => import("./layouts/PedidosLayout"));

// Componente de carga
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0E0D23] to-[#511F86]">
    <div className="text-white text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
      <p className="text-lg">Cargando...</p>
    </div>
  </div>
);

import { PedidosProvider } from "./context/PedidosContext";

function App() {
  return (
    <BrowserRouter>
      <PedidosProvider>
        <Notificaciones />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Rutas Protegidas */}
            <Route path="/inventario" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Inventario />
              </ProtectedRoute>
            } />
            <Route path="/mesas" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MesasPageDisco />
              </ProtectedRoute>
            } />
            <Route path="/bartender" element={
              <ProtectedRoute allowedRoles={['admin', 'bartender']}>
                <BartenderPageDisco />
              </ProtectedRoute>
            } />
            <Route path="/contabilidad-disco" element={
              <ProtectedRoute allowedRoles={['admin']}><ContabilidadDisco /></ProtectedRoute>
            } />
            <Route path="/usuarios-disco" element={
              <ProtectedRoute allowedRoles={['admin']}><AdminUsuariosDisco /></ProtectedRoute>
            } />
            <Route path="/configuracion-ticket" element={
              <ProtectedRoute allowedRoles={['admin']}><ConfiguracionTicketDisco /></ProtectedRoute>
            } />
            {/* Rutas de Pedidos (Contexto global ahora disponible) */}
            <Route path="/login" element={<PedidosDisco />} /> {/* Login Principal */}
            <Route path="/login-mesera-pedidos" element={<PedidosDisco />} /> {/* Modulo Pedidos Mesera */}

            {/* Alias por compatibilidad o futuros usos */}
            <Route path="/pedidos" element={<PedidosPageDisco />} />
            <Route path="/login-disco" element={<PedidosDisco />} />
            <Route path="/pedidos-disco" element={<SeleccionProductosDisco />} /> {/* Página de selección de productos */}

            <Route path="/mis-pedidos-disco" element={<MisPedidosPageDisco />} />
            <Route path="/historial-pedidos" element={<HistorialPedidosPageDisco />} />

            <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect default to login */}
          </Routes>
        </Suspense>
      </PedidosProvider>
    </BrowserRouter>
  );
}

export default App;
