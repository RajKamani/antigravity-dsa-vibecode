import React from 'react';
import { PATTERNS } from '../../data/patterns';
import { Problem } from '../../types';
export const PatternGrid: React.FC<{ problems: Problem[] }> = ({ problems }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
    {PATTERNS.map(pattern => {
      const count = problems.filter(p => p.pattern === pattern.id).length;
      const target = 15; const percent = Math.min(100, Math.round((count / target) * 100));
      let barColor = 'bg-[var(--c-danger)]'; if (percent >= 70) barColor = 'bg-[var(--c-success)]'; else if (percent >= 40) barColor = 'bg-[var(--c-warning)]';
      return (<div key={pattern.id} className="ln-card p-4"><div className="flex justify-between items-start mb-1.5"><h3 className="text-sm text-[var(--c-text)] font-medium">{pattern.name}</h3><span className="text-[10px] font-semibold text-[var(--c-text-3)] bg-[var(--c-surface)] px-1.5 py-0.5 rounded">{count}/{target}</span></div><p className="text-[10px] text-[var(--c-text-3)] mb-3 line-clamp-1">{pattern.description}</p><div className="w-full bg-[var(--c-surface)] rounded-full h-1 overflow-hidden"><div className={`h-1 ${barColor} rounded-full transition-all duration-700`} style={{ width: `${percent}%` }} /></div><div className="text-right text-[9px] text-[var(--c-text-3)] mt-1">{percent}%</div></div>);
    })}
  </div>
);
