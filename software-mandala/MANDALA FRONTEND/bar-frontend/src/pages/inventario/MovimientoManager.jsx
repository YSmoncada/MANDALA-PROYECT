// src/components/MovimientoManager.jsx
import React, { useState } from "react";
import axios from "axios";
import MovimientoModal from "./MovimientoModal";

const MovimientoManager = ({ producto }) => {
  const [open, setOpen] = useState(false);
  const [stock, setStock] = useState(producto.stock);

  const handleSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:8000/api/movimientos/", {
        tipo: data.tipo,
        cantidad: data.cantidad,
        motivo: data.motivo,
        usuario: data.usuario,
        producto: data.producto.id, // 👈 importante: el backend espera el id
      });

      console.log("Movimiento registrado ✅", response.data);

      // actualizar stock en UI con la respuesta del backend
      setStock(response.data.producto.stock);

      setOpen(false); // cerrar modal
    } catch (error) {
      console.error("Error al registrar movimiento ❌", error.response?.data || error.message);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-slate-800 text-white">
      <h2 className="text-lg font-bold">{producto.nombre}</h2>
      <p>Stock actual: {stock}</p>
      <button
        onClick={() => setOpen(true)}
        className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
      >
        Registrar movimiento
      </button>

      {/* Modal */}
      <MovimientoModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        producto={producto}
        stockActual={stock}
        categoria={producto.categoria}
      />
    </div>
  );
};

export default MovimientoManager;
