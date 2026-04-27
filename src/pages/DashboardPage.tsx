import React, { useMemo, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { StatsBar } from '../components/dashboard/StatsBar';
import { StreakTracker } from '../components/dashboard/StreakTracker';
import { RevisionQueue } from '../components/dashboard/RevisionQueue';
import { WeakTopicBanner } from '../components/dashboard/WeakTopicBanner';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { getDueProblems, getDueThisWeek } from '../engine/spacedRepetition';
import { getStrengthsAndWeaknesses } from '../engine/readinessScore';
import { checkAndNotifyDue, requestNotificationPermission } from '../services/notifications';

export const DashboardPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  
  const stats = useMemo(() => ({ 
    total: state.problems.length, 
    dueToday: getDueProblems(state.problems, new Date()).length, 
    dueWeek: getDueThisWeek(state.problems, new Date()).length, 
    mastered: state.problems.filter((p) => p.status === 'mastered').length 
  }), [state.problems]);

  const dueQueue = useMemo(() => 
    getDueProblems(state.problems, new Date())
      .sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime()), 
  [state.problems]);

  const weakestTopic = useMemo(() => { 
    const { weaknesses } = getStrengthsAndWeaknesses(state.problems); 
    return weaknesses.length > 0 ? weaknesses[0] : null; 
  }, [state.problems]);

  useEffect(() => {
    if (state.problems.length > 0) {
      checkAndNotifyDue(state.problems);
    }
  }, [state.problems]);

  const toggleNotifications = async () => {
    const enabled = !state.settings.notificationsEnabled;
    if (enabled) {
      const granted = await requestNotificationPermission();
      if (!granted) return;
    }
    dispatch({ type: 'UPDATE_SETTINGS', payload: { notificationsEnabled: enabled } });
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-bold text-[var(--c-text)] mb-1">Dashboard</h1>
          <p className="text-xs text-[var(--c-text-3)]">Your progress and practice plan for today.</p>
        </div>
        
        <button 
          onClick={toggleNotifications}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${state.settings.notificationsEnabled ? 'bg-[var(--c-accent)]/10 text-[var(--c-accent)] border-[var(--c-accent)]/20' : 'bg-[var(--c-surface)] text-[var(--c-text-3)] border-[var(--c-border)]'}`}
        >
          {state.settings.notificationsEnabled ? <Bell size={14} /> : <BellOff size={14} />}
          <span>Notifications: {state.settings.notificationsEnabled ? 'On' : 'Off'}</span>
        </button>
      </div>

      {weakestTopic && <WeakTopicBanner weakness={weakestTopic} />}
      
      <StatsBar {...stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 h-[460px]">
          <RevisionQueue problems={dueQueue} />
        </div>
        <div className="flex flex-col gap-5 h-[460px]">
          <div className="h-44 shrink-0">
            <StreakTracker currentStreak={state.streaks.current} bestStreak={state.streaks.best} />
          </div>
          <div className="flex-1 min-h-0">
            <RecentActivity problems={state.problems} />
          </div>
        </div>
      </div>
    </div>
  );
};

