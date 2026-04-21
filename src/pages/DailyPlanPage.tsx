import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateDailyPlan } from '../engine/dailyPlan';
import { RevisionQueue } from '../components/dashboard/RevisionQueue';
import { ShieldAlert, BookOpen, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export const DailyPlanPage: React.FC = () => {
  const { state } = useAppContext(); const navigate = useNavigate();
  const plan = useMemo(() => generateDailyPlan(state.problems), [state.problems]);
  const planItems = useMemo(() => [...plan.mandatory, ...plan.warmUps, ...plan.focus, ...plan.challenge], [plan]);
  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <div><h1 className="text-xl font-bold text-[var(--c-text)] mb-1">Smart Daily Plan</h1><p className="text-xs text-[var(--c-text-3)]">Prioritized by weak spots and overdue revisions.</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 h-[460px]"><RevisionQueue problems={planItems} /></div>
        <div className="space-y-4"><div className="ln-panel p-5"><h3 className="text-sm font-semibold text-[var(--c-text)] mb-4">Breakdown</h3><ul className="space-y-3"><li className="flex items-start space-x-2.5 text-xs"><Clock className="w-4 h-4 text-[var(--c-warning)] mt-0.5 shrink-0" /><div><span className="text-[var(--c-text)] font-medium block">Overdue ({plan.mandatory.length})</span><span className="text-[var(--c-text-3)] text-[10px]">Past spaced-repetition interval</span></div></li><li className="flex items-start space-x-2.5 text-xs"><ShieldAlert className="w-4 h-4 text-[var(--c-danger)] mt-0.5 shrink-0" /><div><span className="text-[var(--c-text)] font-medium block">Weak Spots ({plan.focus.length + plan.challenge.length})</span><span className="text-[var(--c-text-3)] text-[10px]">Lowest scoring patterns</span></div></li><li className="flex items-start space-x-2.5 text-xs"><BookOpen className="w-4 h-4 text-[var(--c-success)] mt-0.5 shrink-0" /><div><span className="text-[var(--c-text)] font-medium block">Warm-ups ({plan.warmUps.length})</span><span className="text-[var(--c-text-3)] text-[10px]">Easy problems to build momentum</span></div></li></ul><div className="mt-5 pt-4 border-t border-[var(--c-border)]"><button onClick={() => planItems.length > 0 && navigate(`/resolve/${planItems[0].id}`)} disabled={planItems.length === 0} className="w-full bg-[var(--c-accent)] disabled:opacity-40 hover:bg-[var(--c-accent-h)] text-white py-2.5 rounded text-sm font-semibold transition-colors">Start First Problem</button></div></div></div>
      </div>
    </div>
  );
};
