import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { UI_CLASSES } from '../constants/ui';

const ConfirmModal = ({ open, onClose, onConfirm, title, message, confirmText = "Confirmar", cancelText = "Cancelar", type = "danger" }) => {
    if (!open) return null;

    const isDanger = type === "danger";

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl ${UI_CLASSES.fadeIn}`}>
            <div 
                className={`${UI_CLASSES.glassCard} relative w-full max-w-sm bg-[#120F25] p-0 overflow-hidden transform transition-all ${UI_CLASSES.scaleIn} shadow-[0_20px_80px_rgba(0,0,0,0.8)] border-white/10`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Decoration */}
                <div className={`h-1.5 w-full ${isDanger ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-8 flex flex-col items-center text-center">
                    <div className={`mb-6 p-5 rounded-[2rem] ${isDanger ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'} shadow-inner`}>
                        {isDanger ? <AlertTriangle size={32} /> : <Trash2 size={32} />}
                    </div>

                    <h3 className="text-2xl font-black text-white mb-3 tracking-tight uppercase">{title}</h3>
                    <p className="text-slate-400 mb-10 text-sm font-medium leading-relaxed">
                        {message}
                    </p>

                    <div className="flex flex-col gap-3 w-full">
                        <button
                            onClick={onConfirm}
                            className={`w-full ${isDanger ? UI_CLASSES.buttonDanger : UI_CLASSES.buttonSuccess}`}
                        >
                            {confirmText}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-4 text-slate-500 hover:text-white transition-all font-black uppercase text-[10px] tracking-[0.2em]"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
