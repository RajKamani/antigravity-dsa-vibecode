import React, { ReactNode } from 'react';
type EmptyStateProps = { icon: ReactNode; title: string; description: string; action?: ReactNode; };
export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center ln-panel">
    <div className="w-14 h-14 rounded-lg bg-[var(--c-surface)] flex items-center justify-center text-[var(--c-text-3)] mb-4">{icon}</div>
    <h3 className="text-base font-semibold text-[var(--c-text)] mb-1">{title}</h3>
    <p className="text-sm text-[var(--c-text-2)] max-w-sm mb-5">{description}</p>
    {action && <div>{action}</div>}
  </div>
);
