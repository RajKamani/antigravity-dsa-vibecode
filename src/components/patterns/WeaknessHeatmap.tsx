import React, { useMemo, useState } from 'react';
import { Problem } from '../../types';
import { PATTERNS } from '../../data/patterns';
import { getTopicScores } from '../../engine/readinessScore';
import { Badge } from '../common/Badge';
import { X, PlayCircle, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export const WeaknessHeatmap: React.FC<{ problems: Problem[] }> = ({ problems }) => {
  const navigate = useNavigate();
  const scores = useMemo(() => getTopicScores(problems), [problems]);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

  // Get problems for the selected pattern
  const drillDownData = useMemo(() => {
    if (!selectedPattern) return null;
    const pattern = PATTERNS.find(p => p.id === selectedPattern);
    if (!pattern) return null;

    const patternProblems = problems.filter(p => p.pattern === selectedPattern);
    const score = scores[selectedPattern] ?? 0;

    // Top 3 suggested: prioritize low confidence, then overdue, then least-practiced
    const suggested = [...patternProblems]
      .filter(p => p.status !== 'mastered')
      .sort((a, b) => {
        // 1. Low confidence first
        const confMap: Record<string, number> = { low: 0, medium: 1, high: 2 };
        const confDiff = confMap[a.confidence] - confMap[b.confidence];
        if (confDiff !== 0) return confDiff;

        // 2. Overdue first
        const aOverdue = new Date(a.nextReview) < new Date() ? 1 : 0;
        const bOverdue = new Date(b.nextReview) < new Date() ? 1 : 0;
        if (aOverdue !== bOverdue) return bOverdue - aOverdue;

        // 3. Fewer submits first
        return a.submits.length - b.submits.length;
      })
      .slice(0, 3);

    return { pattern, patternProblems, score, suggested };
  }, [selectedPattern, problems, scores]);

  const handleCellClick = (patternId: string) => {
    setSelectedPattern(prev => prev === patternId ? null : patternId);
  };

  return (
    <div className="space-y-4">
      <div className="ln-panel p-5">
        <h3 className="text-sm font-semibold text-[var(--c-text)] mb-5">Topic Mastery Heatmap</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {PATTERNS.map((pattern) => {
            const score = scores[pattern.id] ?? 0;
            const attempted = problems.some(p => p.pattern === pattern.id);
            const isSelected = selectedPattern === pattern.id;
            let bgColor = 'bg-[var(--c-surface)] border-[var(--c-border)]';
            let textColor = 'text-[var(--c-text-3)]';
            if (attempted) {
              textColor = 'text-[var(--c-text)]';
              if (score >= 70) bgColor = 'bg-[var(--c-success-soft)] border-[var(--c-success)]';
              else if (score >= 40) bgColor = 'bg-[var(--c-warning-soft)] border-[var(--c-warning)]';
              else bgColor = 'bg-[var(--c-danger-soft)] border-[var(--c-danger)]';
            }
            return (
              <button
                key={pattern.id}
                onClick={() => handleCellClick(pattern.id)}
                className={`aspect-square rounded border p-2.5 flex flex-col justify-between items-start transition-all hover:opacity-80 ${bgColor} ${isSelected ? 'ring-2 ring-[var(--c-accent)] ring-offset-2 ring-offset-[var(--c-bg)] scale-[1.02]' : ''}`}
              >
                <span className={`text-[10px] font-medium text-left ${textColor} line-clamp-2`}>{pattern.name}</span>
                <span className={`text-base font-bold ${attempted ? 'text-[var(--c-text)]' : 'text-[var(--c-text-3)]'}`}>{attempted ? `${score}%` : '-'}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center space-x-4 mt-5 text-[10px] text-[var(--c-text-3)]">
          <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-sm bg-[var(--c-success-soft)] border border-[var(--c-success)] mr-1.5"/> &gt; 70%</span>
          <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-sm bg-[var(--c-warning-soft)] border border-[var(--c-warning)] mr-1.5"/> 40-70%</span>
          <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-sm bg-[var(--c-danger-soft)] border border-[var(--c-danger)] mr-1.5"/> &lt; 40%</span>
          <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-sm bg-[var(--c-surface)] border border-[var(--c-border)] mr-1.5"/> N/A</span>
          <span className="ml-auto text-[var(--c-text-3)]">Click any topic to drill down</span>
        </div>
      </div>

      {/* Drill-Down Panel */}
      {drillDownData && (
        <div className="ln-panel overflow-hidden animate-in slide-in-from-top-2">
          {/* Header */}
          <div className="px-5 py-4 border-b border-[var(--c-border)] flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${drillDownData.score >= 70 ? 'bg-[var(--c-success)]' : drillDownData.score >= 40 ? 'bg-[var(--c-warning)]' : 'bg-[var(--c-danger)]'}`} />
              <div>
                <h3 className="text-sm font-semibold text-[var(--c-text)]">{drillDownData.pattern.name}</h3>
                <p className="text-[10px] text-[var(--c-text-3)]">
                  {drillDownData.patternProblems.length} problem{drillDownData.patternProblems.length !== 1 ? 's' : ''} tracked · Readiness: {drillDownData.score}%
                </p>
              </div>
            </div>
            <button onClick={() => setSelectedPattern(null)} className="p-1.5 text-[var(--c-text-3)] hover:text-[var(--c-text)] bg-[var(--c-surface)] hover:bg-[var(--c-border)] rounded transition-colors">
              <X size={14} />
            </button>
          </div>

          {/* Suggested Next Problems */}
          {drillDownData.suggested.length > 0 && (
            <div className="px-5 py-4 border-b border-[var(--c-border)] bg-[var(--c-accent-soft)]">
              <h4 className="text-xs font-semibold text-[var(--c-accent)] mb-3 flex items-center space-x-1.5">
                <ArrowRight size={12} />
                <span>Suggested Next — Practice These</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {drillDownData.suggested.map(problem => {
                  const isOverdue = new Date(problem.nextReview) < new Date();
                  return (
                    <div key={problem.id} className="flex items-center justify-between p-3 bg-[var(--c-panel)] rounded border border-[var(--c-border)] group hover:border-[var(--c-border-hover)] transition-colors">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <Badge variant={problem.difficulty === 'easy' ? 'easy' : problem.difficulty === 'medium' ? 'medium' : 'hard'}>{problem.difficulty}</Badge>
                          {isOverdue && <Badge variant="danger">Overdue</Badge>}
                        </div>
                        <h5 className="text-xs font-medium text-[var(--c-text)] truncate group-hover:text-[var(--c-accent)] transition-colors cursor-pointer" onClick={() => navigate(`/problems/${problem.id}`)}>
                          {problem.title}
                        </h5>
                        <p className="text-[10px] text-[var(--c-text-3)] mt-0.5 capitalize">
                          Confidence: {problem.confidence}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/resolve/${problem.id}`)}
                        className="shrink-0 ml-2 p-2 bg-[var(--c-accent)] hover:bg-[var(--c-accent-h)] text-white rounded transition-colors"
                        title="Start revision"
                      >
                        <PlayCircle size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Problems in This Pattern */}
          <div className="max-h-[300px] overflow-y-auto">
            {drillDownData.patternProblems.length === 0 ? (
              <div className="p-8 text-center text-[var(--c-text-3)] text-xs">
                No problems tracked for this pattern yet.
                <button onClick={() => navigate('/add')} className="block mx-auto mt-2 text-[var(--c-accent)] font-medium hover:text-[var(--c-accent-h)]">+ Add one</button>
              </div>
            ) : (
              drillDownData.patternProblems.map((problem, i) => {
                const isOverdue = new Date(problem.nextReview) < new Date() && problem.status !== 'mastered';
                const lastSubmit = problem.submits.length > 0 ? problem.submits[problem.submits.length - 1] : null;
                return (
                  <div
                    key={problem.id}
                    className={`px-5 py-3 flex items-center justify-between hover:bg-[var(--c-surface)] transition-colors cursor-pointer group ${i < drillDownData.patternProblems.length - 1 ? 'border-b border-[var(--c-border)]' : ''}`}
                    onClick={() => navigate(`/problems/${problem.id}`)}
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${problem.status === 'mastered' ? 'bg-[var(--c-success)]' : problem.confidence === 'high' ? 'bg-[var(--c-success)]' : problem.confidence === 'medium' ? 'bg-[var(--c-warning)]' : 'bg-[var(--c-danger)]'}`} />
                      <div className="min-w-0">
                        <h5 className="text-xs font-medium text-[var(--c-text)] truncate group-hover:text-[var(--c-accent)] transition-colors">{problem.title}</h5>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant={problem.difficulty === 'easy' ? 'easy' : problem.difficulty === 'medium' ? 'medium' : 'hard'}>{problem.difficulty}</Badge>
                          <Badge variant={problem.status === 'mastered' ? 'success' : 'muted'}>{problem.status}</Badge>
                          {isOverdue && <Badge variant="danger">Overdue</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] text-[var(--c-text-3)]">
                          {lastSubmit ? `Last: ${formatDistanceToNow(new Date(lastSubmit.date), { addSuffix: true })}` : 'No attempts'}
                        </p>
                        <p className="text-[10px] text-[var(--c-text-3)] flex items-center justify-end space-x-1">
                          <Calendar size={9} />
                          <span>{problem.status === 'mastered' ? 'Mastered' : `Due ${formatDistanceToNow(new Date(problem.nextReview), { addSuffix: true })}`}</span>
                        </p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/resolve/${problem.id}`); }}
                        className="p-1.5 bg-[var(--c-surface)] hover:bg-[var(--c-accent)] text-[var(--c-text-2)] hover:text-white rounded transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <PlayCircle size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
