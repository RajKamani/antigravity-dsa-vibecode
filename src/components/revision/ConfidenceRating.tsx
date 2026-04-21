import React, { useState } from 'react';
import { Problem, Confidence, Outcome } from '../../types';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
interface ConfidenceRatingProps { problem: Problem; timeTaken: number; onSubmit: (confidence: Confidence, outcome: Outcome) => void; }
export const ConfidenceRating: React.FC<ConfidenceRatingProps> = ({ onSubmit }) => {
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  if (!outcome) {
    return (
      <div className="w-full text-center space-y-5 max-w-lg mx-auto">
        <h2 className="text-lg font-bold text-[var(--c-text)]">How did it go?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button onClick={() => setOutcome('solved')} className="flex flex-col items-center p-4 ln-card hover:!border-[var(--c-success)] transition-colors group"><CheckCircle2 className="w-7 h-7 text-[var(--c-text-3)] group-hover:text-[var(--c-success)] mb-2 transition-colors" /><span className="font-medium text-sm text-[var(--c-text)]">Solved it</span><span className="text-[10px] text-[var(--c-text-3)] mt-0.5">Found optimal solution</span></button>
          <button onClick={() => setOutcome('struggled')} className="flex flex-col items-center p-4 ln-card hover:!border-[var(--c-warning)] transition-colors group"><AlertTriangle className="w-7 h-7 text-[var(--c-text-3)] group-hover:text-[var(--c-warning)] mb-2 transition-colors" /><span className="font-medium text-sm text-[var(--c-text)]">Struggled</span><span className="text-[10px] text-[var(--c-text-3)] mt-0.5">Needed hints</span></button>
          <button onClick={() => setOutcome('failed')} className="flex flex-col items-center p-4 ln-card hover:!border-[var(--c-danger)] transition-colors group"><XCircle className="w-7 h-7 text-[var(--c-text-3)] group-hover:text-[var(--c-danger)] mb-2 transition-colors" /><span className="font-medium text-sm text-[var(--c-text)]">Failed</span><span className="text-[10px] text-[var(--c-text-3)] mt-0.5">Couldn't solve</span></button>
        </div>
      </div>
    );
  }
  if (outcome === 'failed') { onSubmit('low', 'failed'); return null; }
  return (
    <div className="w-full text-center space-y-5 max-w-lg mx-auto">
      <h2 className="text-lg font-bold text-[var(--c-text)]">Rate your confidence</h2><p className="text-[var(--c-text-3)] text-xs">This helps schedule your next revision.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[{ level: 'high' as Confidence, label: 'Nailed it', desc: 'Can do it easily' },{ level: 'medium' as Confidence, label: 'Okay', desc: 'A bit rusty' },{ level: 'low' as Confidence, label: 'Low', desc: 'Barely scraped by' }].map(opt => (
          <button key={opt.level} onClick={() => onSubmit(opt.level, outcome)} className="flex flex-col items-center p-4 ln-card hover:!border-[var(--c-accent)] transition-colors"><span className="font-medium text-sm text-[var(--c-text)] mb-0.5">{opt.label}</span><span className="text-[10px] text-[var(--c-text-3)]">{opt.desc}</span></button>
        ))}
      </div>
    </div>
  );
};
