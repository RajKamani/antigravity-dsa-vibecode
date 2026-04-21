import React from 'react';

type BadgeProps = {
  children: React.ReactNode;
  variant?: 'easy' | 'medium' | 'hard' | 'success' | 'warning' | 'danger' | 'muted' | 'accent' | 'primary' | 'slate' | 'outline' | 'orange';
  className?: string;
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'muted', className = '' }) => {
  const baseClasses = 'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium capitalize';
  const variants: Record<string, string> = {
    easy: 'bg-[var(--c-success-soft)] text-[var(--c-success)]',
    medium: 'bg-[var(--c-warning-soft)] text-[var(--c-warning)]',
    hard: 'bg-[var(--c-danger-soft)] text-[var(--c-danger)]',
    success: 'bg-[var(--c-success-soft)] text-[var(--c-success)]',
    warning: 'bg-[var(--c-warning-soft)] text-[var(--c-warning)]',
    danger: 'bg-[var(--c-danger-soft)] text-[var(--c-danger)]',
    muted: 'bg-[var(--c-surface)] text-[var(--c-text-2)]',
    accent: 'bg-[var(--c-accent-soft)] text-[var(--c-accent)]',
    primary: 'bg-[var(--c-accent-soft)] text-[var(--c-accent)]',
    orange: 'bg-[var(--c-accent-soft)] text-[var(--c-accent)]',
    slate: 'bg-[var(--c-surface)] text-[var(--c-text-2)]',
    outline: 'bg-[var(--c-surface)] text-[var(--c-text-2)]',
  };
  return <span className={`${baseClasses} ${variants[variant] || variants.muted} ${className}`}>{children}</span>;
};
