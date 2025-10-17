// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Inventario from "./pages/Inventario";
import Home from "./pages/Home";
import Pedidos from "./pages/pedidos";
import PedidosPage from "./pages/PedidosPage";
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/login" element={<Pedidos />} />
        <Route path="/pedidos" element={<PedidosPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
