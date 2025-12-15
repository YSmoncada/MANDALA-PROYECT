// src/App.jsx
import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Notificaciones from "./components/Notificaciones";

// Lazy loading de componentes para mejorar el rendimiento
const Inventario = lazy(() => import("./pages/inventario/Inventario"));
const Home = lazy(() => import("./pages/home/Home"));
const HistorialPedidosPageDisco = lazy(() => import("./pages/historialpedidos/HistorialPedidosPage-Disco"));
const PedidosDisco = lazy(() => import("./pages/pedidosAuth/Pedidos-Disco"));
const PedidosPageDisco = lazy(() => import("./pages/pedidospage/PedidosPage-Disco"));
const MisPedidosPageDisco = lazy(() => import("./pages/pedidospage/MisPedidosPage-Disco")); // 🎨 Disco Mis Pedidos
const ContabilidadDisco = lazy(() => import("./pages/contabilidad/Contabilidad-Disco")); // 🎨 Disco Contabilidad
const MesasPage = lazy(() => import("./pages/mesas/MesasPage"));
const BartenderPageDisco = lazy(() => import("./pages/bartender/BartenderPage-Disco"));
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
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/mesas" element={<MesasPage />} />
            <Route path="/bartender" element={<BartenderPageDisco />} />

            {/* Rutas de Pedidos (Contexto global ahora disponible) */}
            <Route path="/login" element={<PedidosDisco />} />
            <Route path="/pedidos" element={<PedidosPageDisco />} />
            <Route path="/login-disco" element={<PedidosDisco />} />
            <Route path="/pedidos-disco" element={<PedidosPageDisco />} />
            <Route path="/mis-pedidos-disco" element={<MisPedidosPageDisco />} />
            <Route path="/contabilidad-disco" element={<ContabilidadDisco />} />

            <Route path="/historial-pedidos" element={<HistorialPedidosPageDisco />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </PedidosProvider>
    </BrowserRouter>
  );
}

export default App;
