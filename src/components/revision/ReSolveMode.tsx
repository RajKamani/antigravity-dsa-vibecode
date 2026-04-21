import React from 'react';
import { ConfidenceRating } from './ConfidenceRating';
import { Problem } from '../../types';
import { ArrowUpRight, Play, Square } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ReSolveModeProps { problem: Problem; onComplete: (confidence: 'low' | 'medium' | 'high', outcome: 'solved' | 'struggled' | 'failed', timeTaken: number) => void; onCancel: () => void; }

export const ReSolveMode: React.FC<ReSolveModeProps> = ({ problem, onComplete, onCancel }) => {
  const [isRunning, setIsRunning] = React.useState(true);
  const [time, setTime] = React.useState(0);
  const [showConfidence, setShowConfidence] = React.useState(false);

  React.useEffect(() => { let interval: NodeJS.Timeout; if (isRunning) interval = setInterval(() => { setTime(t => t + 1); }, 1000); return () => clearInterval(interval); }, [isRunning]);
  const formatTime = (seconds: number) => { const m = Math.floor(seconds / 60).toString().padStart(2, '0'); const s = (seconds % 60).toString().padStart(2, '0'); return `${m}:${s}`; };
  const handleDone = () => { setIsRunning(false); setShowConfidence(true); };
  if (showConfidence) return <ConfidenceRating problem={problem} timeTaken={Math.ceil(time / 60)} onSubmit={(conf, outcome) => onComplete(conf, outcome, Math.ceil(time / 60))} />;
  let deltaText = null;
  if (problem.submits.length > 0) { const lastSolve = problem.submits[problem.submits.length - 1]; deltaText = `Last attempt was ${formatDistanceToNow(new Date(lastSolve.date))} ago (${lastSolve.timeTaken} mins).`; }
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-lg mx-auto space-y-6 ln-panel">
      <div className="text-center space-y-1"><h2 className="text-xl font-bold text-[var(--c-text)]">{problem.title}</h2>{deltaText && <p className="text-[var(--c-text-3)] text-xs">{deltaText}</p>}</div>
      <a href={problem.url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 bg-[var(--c-accent)] hover:bg-[var(--c-accent-h)] text-white px-6 py-3 rounded font-semibold text-sm transition-colors group"><span>Open Problem</span><ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" /></a>
      <div className="w-40 h-40 rounded-full border border-[var(--c-border)] flex items-center justify-center bg-[var(--c-surface)]"><span className="text-4xl font-mono tracking-wider font-bold text-[var(--c-text)]">{formatTime(time)}</span></div>
      <div className="flex items-center space-x-2"><button onClick={() => setIsRunning(!isRunning)} className="p-2 bg-[var(--c-surface)] hover:bg-[var(--c-border)] rounded transition-colors text-[var(--c-text)]">{isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button></div>
      <div className="flex space-x-3 pt-2 w-full">
        <button onClick={onCancel} className="flex-1 py-2.5 bg-[var(--c-surface)] hover:bg-[var(--c-border)] text-[var(--c-text-2)] rounded text-sm font-medium transition-colors">Cancel</button>
        <button onClick={handleDone} className="flex-1 py-2.5 bg-[var(--c-success)] hover:opacity-80 text-white rounded text-sm font-medium transition-opacity">I'm Done</button>
      </div>
    </div>
  );
};
