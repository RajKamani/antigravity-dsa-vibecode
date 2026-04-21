import React from 'react';
import { useAppContext } from '../context/AppContext';
import { PatternGrid } from '../components/patterns/PatternGrid';
import { WeaknessHeatmap } from '../components/patterns/WeaknessHeatmap';
export const PatternsPage: React.FC = () => {
  const { state } = useAppContext();
  return (<div className="space-y-6"><div><h1 className="text-xl font-bold text-[var(--c-text)] mb-1">Pattern Mastery</h1><p className="text-xs text-[var(--c-text-3)]">Track your coverage across all DSA patterns.</p></div><WeaknessHeatmap problems={state.problems} /><div><h2 className="text-sm font-bold text-[var(--c-text)] mb-3">Coverage Progress</h2><PatternGrid problems={state.problems} /></div></div>);
};
