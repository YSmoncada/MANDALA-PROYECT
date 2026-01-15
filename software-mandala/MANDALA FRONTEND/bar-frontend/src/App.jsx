// src/App.jsx
import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from "./components/ProtectedRoute";
import Notificaciones from "./components/Notificaciones";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy loading de componentes para mejorar el rendimiento
const Inventario = lazy(() => import("./pages/inventario/Inventario"));
const Home = lazy(() => import("./pages/home/PanelPrincipal"));
const HistorialPedidosPageDisco = lazy(() => import("./pages/historialpedidos/HistorialPedidosPage-Disco"));
const PedidosDisco = lazy(() => import("./pages/pedidosAuth/Pedidos-Disco"));
const PedidosPageDisco = lazy(() => import("./pages/pedidospage/PedidosPage-Disco"));
const SeleccionProductosDisco = lazy(() => import("./pages/pedidospage/SeleccionProductos-Disco")); 
const MisPedidosPageDisco = lazy(() => import("./pages/pedidospage/MisPedidosPage-Disco")); 
const ContabilidadDisco = lazy(() => import("./pages/contabilidad/Contabilidad-Disco"));
const MesasPageDisco = lazy(() => import("./pages/mesas/MesasPage-Disco"));
const BartenderPageDisco = lazy(() => import("./pages/bartender/BartenderPage-Disco"));
const AdminUsuariosDisco = lazy(() => import("./pages/adminusuarios/AdminUsuarios-Disco"));
const ConfiguracionTicketDisco = lazy(() => import("./pages/adminusuarios/ConfiguracionTicket-Disco"));


import { PedidosProvider } from "./context/PedidosContext";

function App() {
  return (
    <BrowserRouter>
      <PedidosProvider>
        <Notificaciones />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Rutas Protegidas */}
            <Route path="/inventario" element={
              <ProtectedRoute allowedRoles={['admin', 'prueba']}>
                <Inventario />
              </ProtectedRoute>
            } />
            <Route path="/mesas" element={
              <ProtectedRoute allowedRoles={['admin', 'prueba']}>
                <MesasPageDisco />
              </ProtectedRoute>
            } />
            <Route path="/bartender" element={
              <ProtectedRoute allowedRoles={['admin', 'bartender', 'prueba']}>
                <BartenderPageDisco />
              </ProtectedRoute>
            } />
            <Route path="/contabilidad-disco" element={
              <ProtectedRoute allowedRoles={['admin', 'prueba']}><ContabilidadDisco /></ProtectedRoute>
            } />
            <Route path="/usuarios-disco" element={
              <ProtectedRoute allowedRoles={['admin', 'prueba']}><AdminUsuariosDisco /></ProtectedRoute>
            } />
            <Route path="/configuracion-ticket" element={
              <ProtectedRoute allowedRoles={['admin', 'prueba']}><ConfiguracionTicketDisco /></ProtectedRoute>
            } />
            {/* Rutas de Pedidos (Contexto global ahora disponible) */}
            <Route path="/login" element={<PedidosDisco />} /> {/* Login Principal */}
            <Route path="/login-mesera-pedidos" element={<PedidosDisco />} /> {/* Modulo Pedidos Mesera */}

            <Route path="/pedidos" element={
              <ProtectedRoute allowedRoles={['admin', 'bartender', 'mesera', 'prueba']}>
                <PedidosPageDisco />
              </ProtectedRoute>
            } />
            <Route path="/pedidos-disco" element={
              <ProtectedRoute allowedRoles={['admin', 'bartender', 'mesera', 'prueba']}>
                <SeleccionProductosDisco />
              </ProtectedRoute>
            } />
            <Route path="/mis-pedidos-disco" element={
              <ProtectedRoute allowedRoles={['admin', 'bartender', 'mesera', 'prueba']}>
                <MisPedidosPageDisco />
              </ProtectedRoute>
            } />
            <Route path="/historial-pedidos" element={
              <ProtectedRoute allowedRoles={['admin', 'bartender', 'prueba']}>
                <HistorialPedidosPageDisco />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect default to login */}
          </Routes>
        </Suspense>
      </PedidosProvider>
    </BrowserRouter>
  );
}

export default App;
