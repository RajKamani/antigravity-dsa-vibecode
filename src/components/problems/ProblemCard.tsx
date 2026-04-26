import React from 'react';
import { Problem } from '../../types';
import { getPlatformDisplay } from '../../data/platforms';
import { PATTERNS } from '../../data/patterns';
import { Badge } from '../common/Badge';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';

export const ProblemCard: React.FC<{ problem: Problem }> = ({ problem }) => {
  const platform = getPlatformDisplay(problem.platform);
  const navigate = useNavigate();
  const patternName = PATTERNS.find((p) => p.id === problem.pattern)?.name || 'Unknown';
  const isOverdue = new Date(problem.nextReview) < new Date(new Date().setHours(0,0,0,0));
  return (
    <div onClick={() => navigate(`/problems/${problem.id}`)} className="ln-card p-4 cursor-pointer flex flex-col justify-between h-full group">
      <div>
        <div className="flex justify-between items-start mb-2"><span className={`text-[10px] font-semibold ${platform.color}`}>{platform.name}</span><div className="flex space-x-1.5">{isOverdue && problem.status !== 'mastered' && <Badge variant="danger">Overdue</Badge>}<Badge variant={problem.difficulty === 'easy' ? 'easy' : problem.difficulty === 'medium' ? 'medium' : 'hard'}>{problem.difficulty}</Badge></div></div>
        <h3 className="text-sm font-medium text-[var(--c-text)] mb-2 group-hover:text-[var(--c-accent)] transition-colors line-clamp-1">{problem.title}</h3>
        <div className="flex flex-wrap gap-1.5 mb-3"><Badge variant="muted">{patternName}</Badge>{problem.topics.slice(0, 2).map((topic: string, i: number) => <Badge key={i} variant="muted">{topic}</Badge>)}</div>
      </div>
      <div className="mt-3 pt-3 border-t border-[var(--c-border)] flex justify-between items-center text-[10px] text-[var(--c-text-3)]">
        <div className="flex items-center space-x-1"><Calendar className="w-3 h-3" /><span>{problem.status === 'mastered' ? 'Mastered' : `Review ${formatDistanceToNow(new Date(problem.nextReview), { addSuffix: true })}`}</span></div>
        <div className="flex items-center space-x-1"><div className={`w-1.5 h-1.5 rounded-full ${problem.confidence === 'high' ? 'bg-[var(--c-success)]' : problem.confidence === 'medium' ? 'bg-[var(--c-warning)]' : 'bg-[var(--c-danger)]'}`} /><span className="capitalize">{problem.confidence}</span></div>
      </div>
    </div>
  );
};
