import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface WeakTopicProps { topic: string; score: number; }
export const WeakTopicBanner: React.FC<{ weakness: WeakTopicProps | null }> = ({ weakness }) => {
  const navigate = useNavigate();
  if (!weakness || weakness.score > 70) return null;
  return (
    <div className="ln-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ borderColor: 'var(--c-danger)' }}>
      <div className="flex items-center space-x-3">
        <AlertTriangle className="text-[var(--c-danger)] w-5 h-5 shrink-0" />
        <div><h4 className="text-[var(--c-text)] font-medium text-sm">Focus Area: {weakness.topic}</h4><p className="text-xs text-[var(--c-text-3)]">Readiness score is {weakness.score}%. Practice to improve.</p></div>
      </div>
      <button onClick={() => navigate('/daily-plan')} className="shrink-0 flex items-center space-x-1.5 bg-[var(--c-danger)] hover:opacity-80 text-white px-3 py-1.5 rounded text-xs font-medium transition-opacity"><span>Practice Now</span><ArrowRight className="w-3.5 h-3.5" /></button>
    </div>
  );
};
