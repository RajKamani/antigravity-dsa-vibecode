import React from 'react';

type ProgressBarProps = { progress: number; colorClass?: string; className?: string; heightClass?: string; };

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, colorClass = 'bg-[var(--c-accent)]', className = '', heightClass = 'h-1' }) => {
  const safeProgress = Math.min(100, Math.max(0, progress));
  return (
    <div className={`w-full bg-[var(--c-surface)] rounded-full overflow-hidden ${heightClass} ${className}`}>
      <div className={`${heightClass} ${colorClass} transition-all duration-700 ease-out rounded-full`} style={{ width: `${safeProgress}%` }} />
    </div>
  );
};
