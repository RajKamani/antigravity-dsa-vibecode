import React from 'react';
import { Target, Calendar, CalendarClock, Trophy } from 'lucide-react';
interface StatsProps { total: number; dueToday: number; dueWeek: number; mastered: number; }
export const StatsBar: React.FC<StatsProps> = ({ total, dueToday, dueWeek, mastered }) => {
  const stats = [
    { label: 'Total Tracked', value: total, icon: <Target size={18} />, color: 'text-[var(--c-accent)]' },
    { label: 'Due Today', value: dueToday, icon: <Calendar size={18} />, color: 'text-[var(--c-danger)]' },
    { label: 'Due This Week', value: dueWeek, icon: <CalendarClock size={18} />, color: 'text-[var(--c-warning)]' },
    { label: 'Mastered', value: mastered, icon: <Trophy size={18} />, color: 'text-[var(--c-success)]' },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="ln-card p-4 flex items-center space-x-3">
          <div className={stat.color}>{stat.icon}</div>
          <div><p className="text-xs text-[var(--c-text-3)]">{stat.label}</p><p className="text-xl font-bold text-[var(--c-text)]">{stat.value}</p></div>
        </div>
      ))}
    </div>
  );
};
