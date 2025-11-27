// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Notificaciones from "./components/Notificaciones";
import Inventario from "./pages/inventario/Inventario";
import Home from "./pages/home/Home";
import Pedidos from "./pages/pedidosAuth/pedidos";
import PedidosPage from "./pages/pedidospage/PedidosPage";
import MesasPage from "./pages/mesas/MesasPage";
import HistorialPedidosPage from "./pages/historialpedidos/HistorialPedidosPage";
import BartenderPage from "./pages/bartender/BartenderPage";
import PedidosLayout from "./layouts/PedidosLayout";

function App() {
  return (
    <BrowserRouter>
      <Notificaciones />
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
    </BrowserRouter>
  );
}

export default App;
