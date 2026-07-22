import React from 'react';
import { useStone } from '../context/StoneContext';
import { CheckCircle2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useStone();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="pointer-events-auto flex items-center gap-3 bg-[#111111] dark:bg-[#1A1A1E] text-white border border-[#C8A96A]/40 px-5 py-4 rounded-xl shadow-2xl backdrop-blur-md"
          >
            {toast.type === 'info' ? (
              <Info className="w-5 h-5 text-[#C8A96A] shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-[#C8A96A] shrink-0" />
            )}
            <p className="text-sm font-sans-luxury font-medium text-gray-100">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
