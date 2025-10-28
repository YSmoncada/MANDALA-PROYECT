// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Inventario from "./pages/inventario/Inventario";
import Home from "./pages/home/Home";
import Pedidos from "./pages/pedidosAuth/pedidos";
import PedidosPage from "./pages/pedidospage/PedidosPage";
import { useOrder } from "./hooks/useOrder"

function App() {
  const {
    orderItems,
    addProductToOrder,
    clearOrder,
    updateProductQuantity,
    removeProductFromOrder
  } = useOrder();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/login" element={<Pedidos onProductAdd={addProductToOrder} />} />
        <Route
          path="/pedidos"
          element={<PedidosPage orderItems={orderItems} onClearOrder={clearOrder} onUpdateCantidad={updateProductQuantity} onRemoveItem={removeProductFromOrder} />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
