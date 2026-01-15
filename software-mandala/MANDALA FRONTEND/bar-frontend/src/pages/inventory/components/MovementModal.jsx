import React, { useState, useMemo } from 'react';
import { UI_CLASSES } from '../../../constants/ui';
import { X, TrendingUp, TrendingDown, ClipboardCheck } from 'lucide-react';

const MovementModal = ({
  open,
  onClose,
  onSubmit,
  stockActual = 0,
  categoria = 'N/A',
  producto = { id: null, nombre: 'Product' },
}) => {
  const [tipo, setTipo] = useState('entrada'); // 'entrada' or 'salida'
  const [cantidad, setCantidad] = useState(1);
  const [motivo, setMotivo] = useState('');
  const [usuario, setUsuario] = useState('Administrador');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const motivosEntrada = [
    "Compra a proveedor",
    "Devolución de cliente",
    "Ajuste de inventario (adición)",
  ];

  const motivosSalida = [
    "Consumo",
    "Consumo interno / Cortesía",
    "Merma / Producto dañado",
    "Ajuste de inventario (reducción)",
    "Devolución a proveedor"
  ];

  React.useEffect(() => {
    if (open) {
      setTipo('entrada');
      setCantidad(1);
      setMotivo('');
      setUsuario('Administrador');
    }
  }, [open]);

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
      const payload = {
        producto: producto.id,
        tipo,
        cantidad,
        descripcion: motivo,
        usuario
      };

      if (typeof onSubmit === 'function') {
        await onSubmit(payload);
      }
      onClose();
    } catch (err) {
      setError(err?.response?.data?.detail || 'Error al registrar movimiento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 ${UI_CLASSES.fadeIn}`} onClick={onClose}>
      <div className={`${UI_CLASSES.glassCard} bg-[#1A103C] w-full max-w-lg mx-auto relative max-h-[90vh] overflow-y-auto ${UI_CLASSES.scaleIn}`} onClick={(e) => e.stopPropagation()}>

        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-[#6C3FA8]/30">
          <div className="flex items-center text-lg text-white font-bold gap-2">
            {tipo === 'entrada' ? <TrendingUp className="text-emerald-400" /> : <TrendingDown className="text-rose-400" />}
            Registrar Movimiento
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors duration-200">
            <X size={24} />
          </button>
        </div>

        <div className="mt-4 grid gap-5">
          {/* Product Info */}
          <div className="flex items-center justify-between text-base text-white bg-[#2B0D49] rounded-xl p-4 border border-[#6C3FA8]/30 shadow-inner">
            <div>
              <div className="font-bold text-lg text-[#A944FF]">{producto?.nombre}</div>
              <div className="text-gray-400 text-sm">Stock actual: <span className="font-bold text-white">{stockActual}</span></div>
            </div>
            <div className="text-sm text-gray-400">Categoría: <span className="font-medium text-purple-300">{categoria}</span></div>
          </div>

          {/* Movement Type Selector */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setTipo('entrada')}
              className={`flex flex-col items-center justify-center py-4 rounded-xl border-2 text-sm font-bold transition-all duration-300 ${tipo === 'entrada'
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                : 'border-[#6C3FA8]/30 text-gray-400 bg-[#2B0D49]/50 hover:bg-[#2B0D49]'
                }`}
            >
              <TrendingUp />
              <span className="mt-1 text-sm uppercase">Entrada</span>
            </button>
            <button
              onClick={() => setTipo('salida')}
              className={`flex flex-col items-center justify-center py-4 rounded-xl border-2 text-sm font-bold transition-all duration-300 ${tipo === 'salida'
                ? 'border-rose-500 bg-rose-500/10 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                : 'border-[#6C3FA8]/30 text-gray-400 bg-[#2B0D49]/50 hover:bg-[#2B0D49]'
                }`}
            >
              <TrendingDown />
              <span className="mt-1 text-sm uppercase">Salida</span>
            </button>
          </div>

          {/* Quantity */}
          <div className="grid gap-2">
            <label className="text-xs font-bold text-gray-300 uppercase mb-1">Cantidad *</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className={UI_CLASSES.input}
              placeholder="Ingrese la cantidad"
              required
            />
          </div>

          {/* Reason */}
          <div className="grid gap-2">
            <label className="text-xs font-bold text-gray-300 uppercase mb-1">Motivo del Movimiento *</label>
            <div className="relative">
              <select
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className={UI_CLASSES.select}
                required
              >
                <option value="" disabled>Seleccionar motivo</option>
                {tipo === 'entrada'
                  ? motivosEntrada.map(m => <option key={m} value={m}>{m}</option>)
                  : motivosSalida.map(m => <option key={m} value={m}>{m}</option>)
                }
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <TrendingDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Responsible User */}
          <div className="grid gap-2">
            <label className="text-xs font-bold text-gray-300 uppercase mb-1">Usuario Responsable</label>
            <div className="relative">
              <select
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className={UI_CLASSES.select}
              >
                <option value="Administrador">Administrador</option>
                <option value="Trabajador">Trabajador</option>
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && <div className={`${UI_CLASSES.fadeIn} text-rose-500 text-sm mt-2 font-medium bg-rose-500/10 p-3 rounded-xl border border-rose-500/20`}>{error}</div>}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#6C3FA8]/30">
          <button
            onClick={onClose}
            className={UI_CLASSES.buttonSecondary}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-white font-bold transition-all min-w-[200px] shadow-lg ${
              isValid
                ? (tipo === 'entrada' 
                    ? UI_CLASSES.buttonSuccess 
                    : UI_CLASSES.buttonDanger)
                : 'bg-gray-600/30 cursor-not-allowed opacity-50'
            }`}
          >
            {loading ? 'Guardando...' : <><ClipboardCheck size={20} /> Registrar {tipo === 'entrada' ? 'Entrada' : 'Salida'}</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovementModal;
