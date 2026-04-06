import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './useToast';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  const bgColor = {
    success: 'bg-[var(--green)]',
    error: 'bg-[var(--red)]',
    info: 'bg-[var(--accent)]',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`${bgColor[toast.type]} text-white px-5 py-3 rounded-xl shadow-lg font-medium text-sm flex items-center gap-3 cursor-pointer`}
            onClick={() => removeToast(toast.id)}
          >
            {toast.type === 'success' && '✓'}
            {toast.type === 'error' && '✕'}
            {toast.type === 'info' && 'ℹ'}
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export { ToastProvider } from './useToast';
