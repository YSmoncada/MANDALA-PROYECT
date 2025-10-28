import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { Package, ClipboardList } from "lucide-react";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-slate-900 text-white">
      <Header />
      <main className="flex flex-col items-center justify-center pt-20">
        <h1 className="text-5xl font-bold mb-4">Bienvenidos</h1>
        <p className="text-xl text-purple-300 mb-12">Selecciona a dónde quieres ir</p>
        <div className="flex gap-8">
          <button
            onClick={() => navigate("/inventario")}
            className="flex flex-col items-center justify-center w-48 h-48 bg-white/10 hover:bg-white/20 rounded-2xl border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 shadow-lg"
          >
            <Package className="w-16 h-16 mb-4 text-purple-300" />
            <span className="text-lg font-semibold">Inventario</span>
          </button>
          <button
            onClick={() => navigate("/login")}
            className="flex flex-col items-center justify-center w-48 h-48 bg-white/10 hover:bg-white/20 rounded-2xl border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 shadow-lg"
          >
            <ClipboardList className="w-16 h-16 mb-4 text-purple-300" />
            <span className="text-lg font-semibold">Pedidos</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default Home;