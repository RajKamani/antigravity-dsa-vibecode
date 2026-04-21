import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { calculateReadinessScore, getStrengthsAndWeaknesses } from '../engine/readinessScore';
import { ReadinessScoreCircle } from '../components/readiness/ReadinessScoreCircle';
import { StrengthWeakness } from '../components/readiness/StrengthWeakness';
import { DifficultyChart } from '../components/readiness/DifficultyChart';
export const ReadinessPage: React.FC = () => {
  const { state } = useAppContext();
  const score = useMemo(() => calculateReadinessScore(state.problems), [state.problems]);
  const { strengths, weaknesses } = useMemo(() => getStrengthsAndWeaknesses(state.problems), [state.problems]);
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div><h1 className="text-xl font-bold text-[var(--c-text)] mb-1">Interview Readiness</h1><p className="text-xs text-[var(--c-text-3)]">Composite score based on coverage, success rate, and confidence.</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5"><div className="lg:col-span-1"><ReadinessScoreCircle score={score} /></div><div className="lg:col-span-2"><StrengthWeakness strengths={strengths} weaknesses={weaknesses} /></div></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5"><DifficultyChart problems={state.problems} /><div className="ln-panel p-5"><h3 className="text-sm font-semibold text-[var(--c-text)] mb-4">Score Breakdown</h3><ul className="space-y-3 text-xs text-[var(--c-text-3)]"><li className="flex justify-between items-center pb-3 border-b border-[var(--c-border)]"><span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[var(--c-accent)] mr-2.5"/> Topic Coverage (30%)</span></li><li className="flex justify-between items-center pb-3 border-b border-[var(--c-border)]"><span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[var(--c-success)] mr-2.5"/> Revision Success (30%)</span></li><li className="flex justify-between items-center pb-3 border-b border-[var(--c-border)]"><span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[var(--c-warning)] mr-2.5"/> Confidence Ratings (20%)</span></li><li className="flex justify-between items-center"><span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[var(--c-danger)] mr-2.5"/> Pattern Diversity (20%)</span></li></ul></div></div>
    </div>
  );
};
