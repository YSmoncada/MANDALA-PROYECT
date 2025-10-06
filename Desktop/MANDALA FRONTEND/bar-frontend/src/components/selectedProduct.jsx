import React, { useState } from "react";

export default function SelectedProduct({ producto, cantidad }) {
    const [cantidadState, setCantidadState] = useState(cantidad);
    const aumentar = () => setCantidadState(cantidadState + 1);
    const disminuir = () => setCantidadState(cantidadState > 1 ? cantidadState - 1 : 1);
    return (
        <div className="flex items-center justify-between bg-[#2B0D49] border border-[#6C3FA8] rounded-xl p-4 shadow-lg text-white mb-2">
            <div className="flex items-center gap-4">
                <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="w-16 h-16 object-contain rounded-lg bg-[#ffffff] p-2"
                />
                <div>
                    <h3 className="font-bold text-lg">{producto.nombre}</h3>
                    <p className="text-sm text-gray-400">{producto.unidad}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="font-semibold text-lg">x{cantidad}</span>
                <span className="font-semibold text-green-400">
                    ${(producto.precio * cantidad).toLocaleString("es-CO")}
                </span>
            </div>
            <div>
                <div className="flex justify-center items-center gap-2">
                    <button
                        onClick={disminuir}
                        className="px-3 py-1 bg-purple-700 rounded hover:bg-purple-600"
                    >
                        -
                    </button>
                    <span className="px-3">{cantidadState}</span>
                    <button
                        onClick={aumentar}
                        className="px-3 py-1 bg-purple-700 rounded hover:bg-purple-600"
                    >
                        +
                    </button>
                </div>
            </div>
            <div>
                <button className="ml-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:opacity-90">
                    Eliminar
                </button>
            </div>
            <div className="text-right font-bold text-lg">
                Total: <span className="text-green-400">${(producto.precio * cantidadState).toLocaleString("es-CO")}</span>
            </div>
        </div>
    );
}