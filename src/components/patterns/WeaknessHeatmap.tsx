import React, { useMemo } from 'react';
import { Problem } from '../../types';
import { PATTERNS } from '../../data/patterns';
import { getTopicScores } from '../../engine/readinessScore';
import { useNavigate } from 'react-router-dom';

export const WeaknessHeatmap: React.FC<{ problems: Problem[] }> = ({ problems }) => {
  const navigate = useNavigate();
  const scores = useMemo(() => getTopicScores(problems), [problems]);
  return (
    <div className="ln-panel p-5">
      <h3 className="text-sm font-semibold text-[var(--c-text)] mb-5">Topic Mastery Heatmap</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {PATTERNS.map((pattern) => {
          const score = scores[pattern.id] ?? 0;
          const attempted = problems.some(p => p.pattern === pattern.id);
          let bgColor = 'bg-[var(--c-surface)] border-[var(--c-border)]';
          let textColor = 'text-[var(--c-text-3)]';
          if (attempted) {
            textColor = 'text-[var(--c-text)]';
            if (score >= 70) bgColor = 'bg-[var(--c-success-soft)] border-[var(--c-success)]';
            else if (score >= 40) bgColor = 'bg-[var(--c-warning-soft)] border-[var(--c-warning)]';
            else bgColor = 'bg-[var(--c-danger-soft)] border-[var(--c-danger)]';
          }
          return (<button key={pattern.id} onClick={() => navigate('/daily-plan')} className={`aspect-square rounded border p-2.5 flex flex-col justify-between items-start transition-colors hover:opacity-80 ${bgColor}`}><span className={`text-[10px] font-medium text-left ${textColor} line-clamp-2`}>{pattern.name}</span><span className={`text-base font-bold ${attempted ? 'text-[var(--c-text)]' : 'text-[var(--c-text-3)]'}`}>{attempted ? `${score}%` : '-'}</span></button>);
        })}
      </div>
      <div className="flex items-center space-x-4 mt-5 text-[10px] text-[var(--c-text-3)]">
        <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-sm bg-[var(--c-success-soft)] border border-[var(--c-success)] mr-1.5"/> &gt; 70%</span>
        <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-sm bg-[var(--c-warning-soft)] border border-[var(--c-warning)] mr-1.5"/> 40-70%</span>
        <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-sm bg-[var(--c-danger-soft)] border border-[var(--c-danger)] mr-1.5"/> &lt; 40%</span>
        <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-sm bg-[var(--c-surface)] border border-[var(--c-border)] mr-1.5"/> N/A</span>
      </div>
    </div>
  );
};
