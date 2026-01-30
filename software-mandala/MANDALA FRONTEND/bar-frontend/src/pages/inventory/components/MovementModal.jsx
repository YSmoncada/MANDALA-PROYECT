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
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/80 dark:bg-black/90 backdrop-blur-sm p-4 md:p-10 ${UI_CLASSES.fadeIn}`} onClick={onClose}>
      <div className={`${UI_CLASSES.glassCard} bg-white dark:bg-black w-full max-w-lg mx-auto relative max-h-[85vh] overflow-y-auto ${UI_CLASSES.scaleIn} shadow-2xl border-zinc-200 dark:border-white/10`} onClick={(e) => e.stopPropagation()}>

        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-white/5">
          <div className="flex items-center text-lg text-zinc-900 dark:text-white font-bold gap-2">
            {tipo === 'entrada' ? <TrendingUp className="text-emerald-500" /> : <TrendingDown className="text-rose-500" />}
            Registrar Movimiento
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors duration-200">
            <X size={24} />
          </button>
        </div>

        <div className="mt-4 grid gap-5">
          {/* Product Info */}
          <div className="flex items-center justify-between text-base text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 border border-zinc-100 dark:border-white/5 shadow-inner">
            <div>
              <div className="font-bold text-lg text-zinc-900 dark:text-white">{producto?.nombre}</div>
              <div className="text-zinc-500 dark:text-zinc-400 text-sm">Stock actual: <span className="font-bold text-zinc-700 dark:text-white">{stockActual}</span></div>
            </div>
            <div className="text-sm text-zinc-400 dark:text-zinc-500">Categoría: <span className="font-medium text-zinc-600 dark:text-zinc-300">{categoria}</span></div>
          </div>

          {/* Movement Type Selector */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setTipo('entrada')}
              className={`flex flex-col items-center justify-center py-4 rounded-xl border-2 text-sm font-bold transition-all duration-300 ${tipo === 'entrada'
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-lg'
                : 'border-zinc-100 dark:border-white/5 text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-600 dark:hover:text-zinc-300'
                }`}
            >
              <TrendingUp />
              <span className="mt-1 text-sm uppercase">Entrada</span>
            </button>
            <button
              onClick={() => setTipo('salida')}
              className={`flex flex-col items-center justify-center py-4 rounded-xl border-2 text-sm font-bold transition-all duration-300 ${tipo === 'salida'
                ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 shadow-lg'
                : 'border-zinc-100 dark:border-white/5 text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-600 dark:hover:text-zinc-300'
                }`}
            >
              <TrendingDown />
              <span className="mt-1 text-sm uppercase">Salida</span>
            </button>
          </div>

          {/* Quantity */}
          <div className="grid gap-2">
            <label className="text-xs font-bold text-zinc-500 uppercase mb-1">Cantidad *</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className={`${UI_CLASSES.input} border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-white/20`}
              placeholder="Ingrese la cantidad"
              required
            />
          </div>

          {/* Reason */}
          <div className="grid gap-2">
            <label className="text-xs font-bold text-zinc-500 uppercase mb-1">Motivo del Movimiento *</label>
            <div className="relative">
              <select
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className={`${UI_CLASSES.select} border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-white/20`}
                required
              >
                <option value="" disabled>Seleccionar motivo</option>
                {tipo === 'entrada'
                  ? motivosEntrada.map(m => <option key={m} value={m}>{m}</option>)
                  : motivosSalida.map(m => <option key={m} value={m}>{m}</option>)
                }
              </select>
            </div>
          </div>

          {/* Responsible User */}
          <div className="grid gap-2">
            <label className="text-xs font-bold text-zinc-500 uppercase mb-1">Usuario Responsable</label>
            <div className="relative">
              <select
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className={`${UI_CLASSES.select} border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-white/20`}
              >
                <option value="Administrador">Administrador</option>
                <option value="Trabajador">Trabajador</option>
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && <div className={`${UI_CLASSES.fadeIn} text-red-500 text-sm mt-2 font-medium bg-red-50 p-3 rounded-xl border border-red-100 dark:bg-rose-500/10 dark:border-rose-500/20`}>{error}</div>}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-zinc-100 dark:border-white/5">
          <button
            onClick={onClose}
            className={`${UI_CLASSES.buttonSecondary}`}
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
                : 'bg-zinc-100 dark:bg-zinc-800 cursor-not-allowed opacity-50 text-zinc-400'
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
