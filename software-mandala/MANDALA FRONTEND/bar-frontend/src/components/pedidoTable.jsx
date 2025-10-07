import { useState } from "react";
import SelectedProduct from "./selectedProduct";

export default function PedidoTable({ productosSeleccionados }) {
    // productosSeleccionados = [{producto: {}, cantidad: 2}, ...]
    const total = productosSeleccionados.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);

    return (
        <div className="w-full max-w-3xl bg-[#1E0A36] p-4 rounded-lg shadow-lg text-white">
            <h2 className="text-2xl font-bold mb-4 text-center">Pedido</h2>
            <div className="max-h-96 overflow-y-auto mb-4">
                {productosSeleccionados.length === 0 ? (
                    <p className="text-gray-400 text-center">No hay productos seleccionados.</p>
                ) : (
                    productosSeleccionados.map((item, index) => (
                        <SelectedProduct
                            key={index}
                            producto={item.producto}
                            cantidad={item.cantidad}
                        />
                    ))
                )}
            </div>
            <div className="text-right font-bold text-lg">
                Total: <span className="text-green-400">${total.toLocaleString("es-CO")}</span>
            </div>
        </div>
    );
}