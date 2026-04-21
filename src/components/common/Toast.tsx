import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
export type ToastType = 'success' | 'error' | 'info';
export interface ToastMessage { id: string; type: ToastType; message: string; }
let toastListener: ((toast: Omit<ToastMessage, 'id'>) => void) | null = null;
export const showToast = (message: string, type: ToastType = 'info') => { if (toastListener) toastListener({ message, type }); };
export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  useEffect(() => {
    toastListener = (toast) => { const id = Math.random().toString(36).substring(2, 9); setToasts((prev) => [...prev, { ...toast, id }]); setTimeout(() => { setToasts((prev) => prev.filter(t => t.id !== id)); }, 4000); };
    return () => { toastListener = null; };
  }, []);
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto flex items-center p-3 ln-panel w-72">
          <div className="shrink-0 mr-3">
            {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-[var(--c-success)]" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[var(--c-danger)]" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-[var(--c-accent)]" />}
          </div>
          <div className="text-sm text-[var(--c-text)] flex-grow">{toast.message}</div>
          <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="ml-2 text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors"><X className="w-3.5 h-3.5" /></button>
        </div>
      ))}
    </div>
  );
};
