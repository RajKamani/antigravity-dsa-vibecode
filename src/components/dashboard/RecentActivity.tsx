import React from 'react';
import { Problem } from '../../types';
import { Activity, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const RecentActivity: React.FC<{ problems: Problem[] }> = ({ problems }) => {
  const activeProblems = problems.filter(p => p.submits.length > 0).sort((a, b) => new Date(b.submits[b.submits.length - 1].date).getTime() - new Date(a.submits[a.submits.length - 1].date).getTime()).slice(0, 5);
  return (
    <div className="ln-panel p-5 flex flex-col h-full">
      <div className="flex items-center space-x-2 mb-4"><Activity className="text-[var(--c-accent)] w-4 h-4" /><h3 className="text-sm font-semibold text-[var(--c-text)]">Recent Activity</h3></div>
      {activeProblems.length === 0 ? <div className="flex-1 flex items-center justify-center text-[var(--c-text-3)] text-xs">No recent activity</div> : (
        <div className="space-y-0">
          {activeProblems.map((problem) => {
            const latestSubmit = problem.submits[problem.submits.length - 1];
            const isSuccess = latestSubmit.outcome === 'solved';
            return (
              <div key={problem.id} className="flex items-start space-x-3 py-2.5 border-b border-[var(--c-border)] last:border-0" style={{ borderBottomColor: 'var(--c-border)' }}>
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${isSuccess ? 'bg-[var(--c-success)]' : 'bg-[var(--c-danger)]'}`} />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-medium text-[var(--c-text)] truncate">{problem.title}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-[var(--c-text-3)] mt-0.5">
                    <span className="flex items-center"><Clock className="w-2.5 h-2.5 mr-0.5" />{formatDistanceToNow(new Date(latestSubmit.date), { addSuffix: true })}</span>
                    <span className={isSuccess ? 'text-[var(--c-success)]' : 'text-[var(--c-danger)]'}>{isSuccess ? 'Solved' : 'Struggled'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
