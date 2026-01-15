import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { UI_CLASSES } from '../constants/ui';

const ConfirmModal = ({ open, onClose, onConfirm, title, message, confirmText = "Eliminar", cancelText = "Cancelar", type = "danger" }) => {
    if (!open) return null;

    const isDanger = type === "danger";

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm ${UI_CLASSES.fadeIn}`}>
            <div 
                className={`${UI_CLASSES.glassCard} relative w-full max-w-sm bg-[#1A103C] p-0 overflow-hidden transform transition-all ${UI_CLASSES.scaleIn}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header/Banner decorative */}
                <div className={`h-2 w-full ${isDanger ? 'bg-rose-600' : 'bg-blue-500'}`} />
                
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-8 flex flex-col items-center text-center">
                    <div className={`mb-4 p-4 rounded-full ${isDanger ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'}`}>
                        {isDanger ? <AlertTriangle size={40} /> : <Trash2 size={40} />}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        {message}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <button
                            onClick={onClose}
                            className={UI_CLASSES.buttonSecondary}
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 ${isDanger ? UI_CLASSES.buttonDanger : UI_CLASSES.buttonPrimary}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
