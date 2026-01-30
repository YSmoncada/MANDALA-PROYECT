import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { UI_CLASSES } from '../constants/ui';

const ConfirmModal = ({ open, onClose, onConfirm, title, message, confirmText = "Eliminar", cancelText = "Cancelar", type = "danger" }) => {
    if (!open) return null;

    const isDanger = type === "danger";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-fadeIn">
            <div 
                className="relative w-full max-w-sm bg-[#1A103C]/95 dark:bg-zinc-900 border border-white/20 dark:border-white/5 rounded-[2.5rem] p-0 overflow-hidden transform transition-all animate-scaleIn shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header/Banner decorative */}
                <div className={`h-1.5 w-full ${isDanger ? 'bg-gradient-to-r from-transparent via-rose-500 to-transparent' : 'bg-gradient-to-r from-transparent via-[#A944FF] to-transparent'}`} />
                
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 text-white/50 hover:text-white transition-all bg-white/5 hover:bg-white/10 p-2 rounded-xl"
                >
                    <X size={18} />
                </button>

                <div className="p-10 flex flex-col items-center text-center">
                    <div className={`mb-6 p-6 rounded-3xl ${isDanger ? 'bg-rose-500/10 text-rose-500' : 'bg-[#A944FF]/10 text-[#A944FF]'} border border-white/5 shadow-inner`}>
                        {isDanger ? <AlertTriangle size={48} strokeWidth={1.5} /> : <Trash2 size={48} strokeWidth={1.5} />}
                    </div>

                    <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tighter italic">{title}</h3>
                    <p className="text-[#8A7BAF] dark:text-zinc-500 mb-10 leading-relaxed text-sm font-medium uppercase tracking-widest">
                        {message}
                    </p>

                    <div className="flex flex-col gap-4 w-full">
                         <button
                            onClick={onConfirm}
                            className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all transform active:scale-95 shadow-2xl ${isDanger ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-[#441E73] dark:bg-zinc-100 dark:text-black hover:bg-[#A944FF] text-white'}`}
                        >
                            {confirmText}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-4 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] text-white/50 hover:text-white transition-all bg-white/5 hover:bg-white/10 border border-white/5"
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
