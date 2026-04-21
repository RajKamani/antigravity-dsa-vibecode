import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { StatsBar } from '../components/dashboard/StatsBar';
import { StreakTracker } from '../components/dashboard/StreakTracker';
import { RevisionQueue } from '../components/dashboard/RevisionQueue';
import { WeakTopicBanner } from '../components/dashboard/WeakTopicBanner';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { getDueProblems, getDueThisWeek } from '../engine/spacedRepetition';
import { getStrengthsAndWeaknesses } from '../engine/readinessScore';
export const DashboardPage: React.FC = () => {
  const { state } = useAppContext();
  const stats = useMemo(() => ({ total: state.problems.length, dueToday: getDueProblems(state.problems, new Date()).length, dueWeek: getDueThisWeek(state.problems, new Date()).length, mastered: state.problems.filter((p: any) => p.status === 'mastered').length }), [state.problems]);
  const dueQueue = useMemo(() => getDueProblems(state.problems, new Date()).sort((a: any, b: any) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime()), [state.problems]);
  const weakestTopic = useMemo(() => { const { weaknesses } = getStrengthsAndWeaknesses(state.problems); return weaknesses.length > 0 ? weaknesses[0] : null; }, [state.problems]);
  return (
    <div className="space-y-5">
      <div className="mb-6"><h1 className="text-xl font-bold text-[var(--c-text)] mb-1">Dashboard</h1><p className="text-xs text-[var(--c-text-3)]">Your progress and practice plan for today.</p></div>
      {weakestTopic && <WeakTopicBanner weakness={weakestTopic} />}
      <StatsBar {...stats} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 h-[460px]"><RevisionQueue problems={dueQueue} /></div>
        <div className="flex flex-col gap-5 h-[460px]"><div className="h-44 shrink-0"><StreakTracker currentStreak={state.streaks.current} bestStreak={state.streaks.best} /></div><div className="flex-1 min-h-0"><RecentActivity problems={state.problems} /></div></div>
      </div>
    </div>
  );
};
