import React from 'react';
import { Problem } from '../../types';
import { getPlatformDisplay } from '../../data/platforms';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { Inbox, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RevisionQueue: React.FC<{ problems: Problem[] }> = ({ problems }) => {
  const navigate = useNavigate();
  if (problems.length === 0) {
    return (<div className="ln-panel p-5 flex flex-col h-full"><h3 className="text-sm font-semibold text-[var(--c-text)] mb-4">Today's Queue</h3><div className="flex-1 flex items-center justify-center"><EmptyState icon={<Inbox />} title="All caught up!" description="No problems due for revision today." /></div></div>);
  }
  return (
    <div className="ln-panel flex flex-col h-full overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--c-border)] flex justify-between items-center">
        <div><h3 className="text-sm font-semibold text-[var(--c-text)]">Today's Queue</h3><p className="text-xs text-[var(--c-text-3)]">{problems.length} problem{problems.length !== 1 ? 's' : ''} due</p></div>
        <button onClick={() => navigate('/daily-plan')} className="text-[var(--c-accent)] hover:text-[var(--c-accent-h)] text-xs font-medium transition-colors">View Plan →</button>
      </div>
      <div className="overflow-y-auto flex-1">
        {problems.map((problem) => {
          const platform = getPlatformDisplay(problem.platform);
          const isOverdue = new Date(problem.nextReview) < new Date(new Date().setHours(0,0,0,0));
          return (
            <div key={problem.id} className="px-5 py-3.5 border-b border-[var(--c-border)] flex items-center justify-between hover:bg-[var(--c-surface)] transition-colors group" style={{ borderBottomColor: 'var(--c-border)' }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1"><span className={`text-[10px] font-medium ${platform.color}`}>{platform.name}</span>{isOverdue && <Badge variant="danger">Overdue</Badge>}</div>
                <h4 className="text-sm text-[var(--c-text)] font-medium truncate group-hover:text-[var(--c-accent)] transition-colors">{problem.title}</h4>
                <div className="flex gap-1.5 mt-1"><Badge variant={problem.difficulty === 'easy' ? 'easy' : problem.difficulty === 'medium' ? 'medium' : 'hard'}>{problem.difficulty}</Badge><Badge variant="muted">{problem.topics[0] || 'Uncategorized'}</Badge></div>
              </div>
              <button onClick={() => navigate(`/resolve/${problem.id}`)} className="shrink-0 ml-4 flex items-center space-x-1.5 bg-[var(--c-surface)] hover:bg-[var(--c-accent)] text-[var(--c-text-2)] hover:text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"><PlayCircle className="w-3.5 h-3.5" /><span>Review</span></button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
