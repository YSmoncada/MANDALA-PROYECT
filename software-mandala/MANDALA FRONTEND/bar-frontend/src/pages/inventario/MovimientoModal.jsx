// src/components/MovimientoModal.jsx
import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { API_URL } from '../../apiConfig'; // ajusta si tu config es distinta

// Iconos SVG personalizados para el estilo del modal
const ChartUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20V10" />
    <path d="M18 20V4" />
    <path d="M6 20v-4" />
    <path d="M18 4l-7 7-3-3-4 4" />
  </svg>
);

const ChartDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4v10" />
    <path d="M18 4v16" />
    <path d="M6 4v4" />
    <path d="M18 20l-7-7-3 3-4-4" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const RegisterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M12 18v-6" />
    <path d="M9 15h6" />
  </svg>
);


const MovimientoModal = ({
  open,
  onClose,
  onSubmit,
  stockActual = 200750,
  categoria = 'Bebidas Alcohólicas',
  producto = { id: null, nombre: 'whisky' },
}) => {
  const [tipo, setTipo] = useState('entrada'); // 'entrada' o 'salida'
  const [cantidad, setCantidad] = useState(1);
  const [motivo, setMotivo] = useState('');
  const [usuario, setUsuario] = useState('Administrador');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Motivos racionales e independientes para cada tipo de movimiento
  const motivosEntrada = [
    "Compra a proveedor",
    "Devolución de cliente",
    "Ajuste de inventario (adición)",
  ];

  const motivosSalida = [
    "Consumo", // Motivo que faltaba
    "Consumo interno / Cortesía",
    "Merma / Producto dañado",
    "Ajuste de inventario (reducción)",
    "Devolución a proveedor"
  ];
  // Resetea campos al abrir/cerrar
  React.useEffect(() => {
    if (open) {
      setTipo('entrada');
      setCantidad(1);
      setMotivo('');
      setUsuario('Administrador');
    }
  }, [open]);

  // Resetea el motivo cuando cambia el tipo de movimiento
  React.useEffect(() => {
    setMotivo('');
  }, [tipo]);

  const isValid = useMemo(() => {
    return cantidad > 0 && motivo.trim().length > 0 && usuario.trim().length > 0;
  }, [cantidad, motivo, usuario]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Normalizar y garantizar 'entrada' o 'salida'
      const tipoRaw = (tipo || '').toString().trim().toLowerCase();
      const entradaAliases = ['entrada', 'in', 'ingreso', 'e', 'add', 'agregar'];
      const salidaAliases = ['salida', 'out', 'egreso', 's', 'retirar', 'remove', 'quitar'];
      let tipoNorm = '';
      if (entradaAliases.includes(tipoRaw)) tipoNorm = 'entrada';
      else if (salidaAliases.includes(tipoRaw)) tipoNorm = 'salida';
      else {
        setError('Tipo inválido. Seleccione Entrada o Salida.');
        setLoading(false);
        return;
      }

      const payload = {
        producto: producto.id,
        tipo: tipoNorm, // enviar el tipo normalizado
        cantidad,
        descripcion: motivo,
        usuario
      };

      // NO hacer axios.post aquí: delegar la petición al padre
      if (typeof onSubmit === 'function') {
        // si el handler del padre devuelve una promesa, esperarla
        await onSubmit(payload);
      }

      onClose();
    } catch (err) {
      console.error('Movimiento error', err?.response?.data || err?.message || err);
      setError(err?.response?.data?.detail || 'Error al registrar movimiento');
    } finally {
      setLoading(false);
    }
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-[#1A103C] border border-[#6C3FA8] rounded-2xl shadow-2xl w-full max-w-lg mx-auto p-6 relative max-h-[90vh] overflow-y-auto transform transition-all animate-scaleIn" onClick={handleContentClick}>

        {/* Encabezado del Modal */}
        <div className="flex justify-between items-center pb-4 border-b border-[#6C3FA8]/30">
          <div className="flex items-center text-lg text-white font-bold gap-2">
            <ChartUpIcon />
            Registrar Movimiento
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors duration-200">
            <CloseIcon />
          </button>
        </div>

        <div className="mt-4 grid gap-5">
          {/* Información del Producto */}
          <div className="flex items-center justify-between text-base text-white bg-[#2B0D49] rounded-xl p-4 border border-[#6C3FA8]/30 shadow-inner">
            <div>
              <div className="font-bold text-lg text-[#A944FF]">{producto?.nombre || 'Producto'}</div>
              <div className="text-gray-400 text-sm">Stock actual: <span className="font-bold text-white">{stockActual}</span></div>
            </div>
            <div className="text-sm text-gray-400">Categoría: <span className="font-medium text-purple-300">{categoria}</span></div>
          </div>

          {/* Tipo de Movimiento */}
          <div className="grid grid-cols-2 gap-4">
            <button
              aria-label="Entrada"
              onClick={() => setTipo('entrada')}
              className={`flex flex-col items-center justify-center py-4 rounded-xl border-2 text-sm font-bold transition-all duration-300 ${tipo === 'entrada'
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                : 'border-[#6C3FA8]/30 text-gray-400 bg-[#2B0D49]/50 hover:bg-[#2B0D49]'
                }`}
            >
              <ChartUpIcon />
              <span className="mt-1">Entrada</span>
            </button>
            <button
              aria-label="Salida"
              onClick={() => setTipo('salida')}
              className={`flex flex-col items-center justify-center py-4 rounded-xl border-2 text-sm font-bold transition-all duration-300 ${tipo === 'salida'
                ? 'border-rose-500 bg-rose-500/10 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                : 'border-[#6C3FA8]/30 text-gray-400 bg-[#2B0D49]/50 hover:bg-[#2B0D49]'
                }`}
            >
              <ChartDownIcon />
              <span className="mt-1">Salida</span>
            </button>
          </div>

          {/* Cantidad */}
          <div className="grid gap-2">
            <label className="text-xs font-bold text-gray-300 uppercase mb-1">Cantidad *</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="w-full p-3 bg-[#2B0D49] border border-[#6C3FA8]/50 rounded-lg text-white focus:ring-2 focus:ring-[#A944FF] outline-none transition-all placeholder:text-gray-500"
              placeholder="Ingrese la cantidad"
              required
            />
          </div>

          {/* Motivo */}
          <div className="grid gap-2">
            <label className="text-xs font-bold text-gray-300 uppercase mb-1">Motivo del Movimiento *</label>
            <select
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full p-3 bg-[#2B0D49] border border-[#6C3FA8]/50 rounded-lg text-white focus:ring-2 focus:ring-[#A944FF] outline-none transition-all appearance-none [&>option]:bg-[#1A103C]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2394A3B8' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1rem',
              }}
              required
            >
              <option value="" disabled>Seleccionar motivo</option>
              {tipo === 'entrada'
                ? motivosEntrada.map(m => <option key={m} value={m}>{m}</option>)
                : motivosSalida.map(m => <option key={m} value={m}>{m}</option>)
              }
            </select>
          </div>

          {/* Usuario Responsable */}
          <div className="grid gap-2">
            <label className="text-xs font-bold text-gray-300 uppercase mb-1">Usuario Responsable</label>
            <select
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full p-3 bg-[#2B0D49] border border-[#6C3FA8]/50 rounded-lg text-white focus:ring-2 focus:ring-[#A944FF] outline-none transition-all appearance-none [&>option]:bg-[#1A103C]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2394A3B8' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1rem',
              }}
            >
              <option value="Administrador">Administrador</option>
              <option value="Trabajador">Trabajador</option>
            </select>
          </div>

          {/* Error Message */}
          {error && <div className="text-rose-500 text-sm mt-2 font-medium bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">{error}</div>}
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#6C3FA8]/30">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all font-bold"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-white font-bold transition-all min-w-[180px] shadow-lg ${
              isValid
                ? 'bg-[#6C3FA8] hover:bg-[#5A328E] active:scale-95'
                : 'bg-[#6C3FA8]/50 cursor-not-allowed'
            }`}
          >
            {loading ? 'Guardando...' : <><RegisterIcon /> Registrar {tipo === 'entrada' ? 'Entrada' : 'Salida'}</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovimientoModal;

// ejemplo de handler en el componente inventario
const handleMovimientoResponse = (data) => {
  // data = { movimiento: {...}, producto: {...} }
  const updatedProduct = data.producto;
  setProductos(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
};