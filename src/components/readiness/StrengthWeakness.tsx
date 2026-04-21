import React from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { PATTERNS } from '../../data/patterns';
interface TopicScore { topic: string; score: number; }
interface SWProps { strengths: TopicScore[]; weaknesses: TopicScore[]; }
export const StrengthWeakness: React.FC<SWProps> = ({ strengths, weaknesses }) => {
  const getPatternName = (id: string) => PATTERNS.find(p => p.id === id)?.name || id;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="ln-panel p-5"><div className="flex items-center space-x-2 mb-4"><ArrowUpCircle className="text-[var(--c-success)] w-4 h-4" /><h3 className="text-sm font-semibold text-[var(--c-text)]">Top Strengths</h3></div>{strengths.length === 0 ? <p className="text-xs text-[var(--c-text-3)]">Not enough data.</p> : <div className="space-y-3">{strengths.map((s, i) => <div key={i} className="flex justify-between items-center text-xs"><span className="text-[var(--c-text)]">{getPatternName(s.topic)}</span><span className="text-[var(--c-success)] font-bold">{s.score}%</span></div>)}</div>}</div>
      <div className="ln-panel p-5"><div className="flex items-center space-x-2 mb-4"><ArrowDownCircle className="text-[var(--c-danger)] w-4 h-4" /><h3 className="text-sm font-semibold text-[var(--c-text)]">Needs Work</h3></div>{weaknesses.length === 0 ? <p className="text-xs text-[var(--c-text-3)]">Not enough data.</p> : <div className="space-y-3">{weaknesses.map((s, i) => <div key={i} className="flex justify-between items-center text-xs"><span className="text-[var(--c-text)]">{getPatternName(s.topic)}</span><span className="text-[var(--c-danger)] font-bold">{s.score}%</span></div>)}</div>}</div>
    </div>
  );
};
