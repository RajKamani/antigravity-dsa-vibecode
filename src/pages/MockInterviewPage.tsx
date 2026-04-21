import React, { useState, useEffect } from 'react';
import { Play, Square, Settings, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
export const MockInterviewPage: React.FC = () => {
  const { dispatch } = useAppContext();
  const [duration, setDuration] = useState(45); const [isRunning, setIsRunning] = useState(false); const [timeLeft, setTimeLeft] = useState(duration * 60);
  useEffect(() => { setTimeLeft(duration * 60); }, [duration]);
  useEffect(() => { let interval: NodeJS.Timeout; if (isRunning && timeLeft > 0) interval = setInterval(() => { setTimeLeft(t => t - 1); }, 1000); else if (timeLeft === 0 && isRunning) { setIsRunning(false); dispatch({ type: 'RECORD_ACTIVITY' }); } return () => clearInterval(interval); }, [isRunning, timeLeft, dispatch]);
  const formatTime = (seconds: number) => { const h = Math.floor(seconds / 3600); const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0'); const s = (seconds % 60).toString().padStart(2, '0'); return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`; };
  const handleStartStop = () => { if (!isRunning && timeLeft === 0) setTimeLeft(duration * 60); setIsRunning(!isRunning); };
  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8"><h1 className="text-xl font-bold text-[var(--c-text)]">Mock Interview</h1><p className="text-xs text-[var(--c-text-3)]">Simulate real interview conditions.</p></div>
      <div className="ln-panel p-8 flex flex-col items-center justify-center text-center relative overflow-hidden"><div className="absolute bottom-0 left-0 right-0 bg-[var(--c-accent-soft)] transition-all duration-1000" style={{ height: `${progress}%` }} /><div className="relative z-10 w-full max-w-sm mx-auto space-y-8"><div className="text-[5rem] font-mono tracking-wider font-bold text-[var(--c-text)] leading-none tabular-nums">{formatTime(timeLeft)}</div><button onClick={handleStartStop} className={`w-full py-3.5 rounded font-semibold text-sm transition-colors flex items-center justify-center space-x-2 ${isRunning ? 'bg-[var(--c-danger-soft)] text-[var(--c-danger)] border border-[var(--c-danger)]' : 'bg-[var(--c-success)] text-white hover:opacity-80'}`}>{isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}<span>{isRunning ? 'Stop' : timeLeft === 0 ? 'Restart' : 'Start'}</span></button><div className="pt-6 border-t border-[var(--c-border)] flex flex-col items-center space-y-3"><div className="flex items-center space-x-1.5 text-[var(--c-text-3)] text-xs"><Settings className="w-3.5 h-3.5" /><span>Duration</span></div><div className="flex items-center space-x-1 bg-[var(--c-bg)] rounded p-1 border border-[var(--c-border)]">{[30, 45, 60, 90].map(mins => (<button key={mins} disabled={isRunning} onClick={() => setDuration(mins)} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${duration === mins ? 'bg-[var(--c-accent-soft)] text-[var(--c-accent)]' : 'text-[var(--c-text-3)] hover:text-[var(--c-text)] disabled:opacity-40'}`}>{mins}m</button>))}</div></div></div></div>
      <div className="ln-panel p-5"><h3 className="text-sm font-semibold text-[var(--c-text)] mb-3">Tips</h3><ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[var(--c-text-3)]"><li className="flex items-start space-x-2"><Clock className="w-4 h-4 text-[var(--c-accent)] mt-0.5 shrink-0" /><span>Spend the first 5 minutes understanding the problem and edge cases.</span></li><li className="flex items-start space-x-2"><Clock className="w-4 h-4 text-[var(--c-accent)] mt-0.5 shrink-0" /><span>Think out loud. The interviewer wants to see your process.</span></li></ul></div>
    </div>
  );
};
