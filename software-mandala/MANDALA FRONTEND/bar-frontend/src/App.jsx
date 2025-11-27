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
import { useOrder } from "./hooks/useOrder";
import { usePedidosAuth } from "./hooks/usePedidosAuth";

function App() {
  const {
    orderItems,
    addProductToOrder,
    clearOrder,
    updateProductQuantity,
    removeProductFromOrder
  } = useOrder();

  // Centralizamos el hook de autenticación aquí
  const auth = usePedidosAuth();

  return (
    <BrowserRouter>
      <Notificaciones />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/mesas" element={<MesasPage />} />
        <Route path="/bartender" element={<BartenderPage />} />
        <Route
          path="/login"
          element={
            <Pedidos
              auth={auth} // Pasamos el objeto de autenticación completo
              onProductAdd={addProductToOrder}
            />
          }
        />
        <Route path="/historial-pedidos" element={<HistorialPedidosPage />} />
        <Route
          path="/pedidos"
          element={
            <PedidosPage
              auth={auth} // Pasamos el objeto de autenticación completo
              orderItems={orderItems}
              onClearOrder={clearOrder}
              onUpdateCantidad={updateProductQuantity}
              onRemoveItem={removeProductFromOrder}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
