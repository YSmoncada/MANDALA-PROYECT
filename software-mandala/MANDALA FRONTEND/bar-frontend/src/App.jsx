// src/App.jsx
import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Notificaciones from "./components/Notificaciones";

// Lazy loading de componentes para mejorar el rendimiento
const Inventario = lazy(() => import("./pages/inventario/Inventario"));
const Home = lazy(() => import("./pages/home/Home"));
const Pedidos = lazy(() => import("./pages/pedidosAuth/pedidos"));
const PedidosPage = lazy(() => import("./pages/pedidospage/PedidosPage"));
const MesasPage = lazy(() => import("./pages/mesas/MesasPage"));
const HistorialPedidosPage = lazy(() => import("./pages/historialpedidos/HistorialPedidosPage"));
const BartenderPage = lazy(() => import("./pages/bartender/BartenderPage"));
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

function App() {
  return (
    <BrowserRouter>
      <Notificaciones />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/mesas" element={<MesasPage />} />
          <Route path="/bartender" element={<BartenderPage />} />

          {/* Rutas que comparten el contexto de Pedidos */}
          <Route element={<PedidosLayout />}>
            <Route path="/login" element={<Pedidos />} />
            <Route path="/pedidos" element={<PedidosPage />} />
          </Route>

          <Route path="/historial-pedidos" element={<HistorialPedidosPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
