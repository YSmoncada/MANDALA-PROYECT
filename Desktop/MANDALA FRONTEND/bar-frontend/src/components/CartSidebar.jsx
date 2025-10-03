import { motion } from "framer-motion";

export default function CartSidebar({ abierto, setAbierto, carrito, eliminar }) {
  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: abierto ? "0%" : "100%" }}
      transition={{ duration: 0.3 }}
      className="w-80 bg-[#1A0B2E] text-white shadow-xl p-4 fixed right-0 top-0 h-full flex flex-col z-50"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Pedido</h2>
        <button onClick={() => setAbierto(false)} className="text-gray-400 hover:text-white">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {carrito.length === 0 ? (
          <p className="text-gray-400">No hay productos</p>
        ) : (
          carrito.map((p, i) => (
            <div key={i} className="flex justify-between items-center bg-[#2B0D49] p-3 rounded-lg">
              <div>
                <p className="font-semibold">{p.nombre}</p>
                <p className="text-sm text-gray-400">{p.cantidad} x ${p.precio.toLocaleString("es-CO")}</p>
              </div>
              <button
                onClick={() => eliminar(p.nombre)}
                className="text-pink-400 hover:text-pink-600"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {carrito.length > 0 && (
        <div className="mt-4">
          <p className="font-bold text-lg">Total: ${total.toLocaleString("es-CO")}</p>
          <button className="w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-500 py-2 rounded-lg font-semibold hover:opacity-90">
            Confirmar Pedido
          </button>
        </div>
      )}
    </motion.div>
  );
}
