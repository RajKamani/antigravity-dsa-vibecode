import React from 'react';
import { Flame } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';
interface StreakProps { currentStreak: number; bestStreak: number; }
export const StreakTracker: React.FC<StreakProps> = ({ currentStreak, bestStreak }) => {
  const progress = bestStreak > 0 ? (currentStreak / bestStreak) * 100 : 0;
  return (
    <div className="ln-panel p-5 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div><h3 className="text-sm font-semibold text-[var(--c-text)] mb-0.5">Consistency</h3><p className="text-xs text-[var(--c-text-3)]">Keep your streak going</p></div>
        <Flame className="text-[var(--c-accent)] w-5 h-5" />
      </div>
      <div className="mt-auto space-y-3">
        <div className="flex justify-between items-end">
          <div><span className="text-3xl font-bold text-[var(--c-text)]">{currentStreak}</span><span className="text-[var(--c-text-3)] ml-1.5 text-sm">days</span></div>
          <div className="text-xs text-[var(--c-text-3)]">Best: <span className="text-[var(--c-text)] font-medium">{bestStreak}</span></div>
        </div>
        <ProgressBar progress={progress} />
      </div>
    </div>
  );
};
