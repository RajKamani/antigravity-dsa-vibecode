import React, { useEffect } from 'react';
import { X } from 'lucide-react';
type ModalProps = { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode; maxWidth?: string; };
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, maxWidth = 'max-w-xl' }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) { document.addEventListener('keydown', handleEscape); document.body.style.overflow = 'hidden'; }
    return () => { document.removeEventListener('keydown', handleEscape); document.body.style.overflow = 'unset'; };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-[var(--c-overlay)]" onClick={onClose} />
      <div className={`relative ln-panel w-full ${maxWidth} max-h-[85vh] overflow-y-auto`}>
        <div className="px-6 py-4 border-b border-[var(--c-border)] flex justify-between items-center">
          <h3 className="text-base font-semibold text-[var(--c-text)]">{title}</h3>
          <button onClick={onClose} className="text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors p-1 rounded hover:bg-[var(--c-surface)]"><X size={18} /></button>
        </div>
        <div className="px-6 py-4">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-[var(--c-border)] flex justify-end space-x-3">{footer}</div>}
      </div>
    </div>
  );
};
