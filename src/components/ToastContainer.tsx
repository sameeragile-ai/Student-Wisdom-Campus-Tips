import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-[#0EA5A0] shrink-0" />,
    info: <Info className="w-5 h-5 text-[#FF8A3D] shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#F2A93B] shrink-0" />,
    error: <XCircle className="w-5 h-5 text-[#E5484D] shrink-0" />,
  };

  const borderMap = {
    success: 'border-[#0EA5A0]/30',
    info: 'border-[#FF8A3D]/30',
    warning: 'border-[#F2A93B]/30',
    error: 'border-[#E5484D]/30',
  };

  return (
    <div
      aria-live="polite"
      className="fixed z-50 pointer-events-none bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 flex flex-col items-center md:items-end gap-2.5 max-w-sm ml-auto"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`pointer-events-auto flex items-center justify-between gap-3 w-full p-3.5 rounded-xl bg-[#0E1A2B] text-white shadow-xl border ${
              borderMap[toast.type]
            } backdrop-blur-md`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {iconMap[toast.type]}
              <p className="text-xs sm:text-sm font-medium leading-snug line-clamp-2">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-[#7A8699] hover:text-white rounded-md transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
