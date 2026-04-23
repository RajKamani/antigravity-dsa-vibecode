import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Play, Square, Settings, Clock, Shuffle, History, CheckCircle, XCircle, SkipForward, ExternalLink } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import { Problem, MockSession } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { format, formatDistanceToNow } from 'date-fns';

export const MockInterviewPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [duration, setDuration] = useState(45);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [showHistory, setShowHistory] = useState(false);

  // Mock interview session tracking
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [sessionProblems, setSessionProblems] = useState<{ id: string; title: string; outcome: 'solved' | 'skipped'; timeTaken: number }[]>([]);
  const [problemStartTime, setProblemStartTime] = useState<number>(0);

  // Pool of problems for random picking (exclude mastered, prioritize medium first)
  const problemPool = useMemo(() => {
    const pool = state.problems.filter(p => p.status !== 'mastered');
    // Weighted: medium first (interview-realistic), then hard, then easy
    return pool.sort((a, b) => {
      const order: Record<string, number> = { medium: 0, hard: 1, easy: 2 };
      return (order[a.difficulty] ?? 2) - (order[b.difficulty] ?? 2);
    });
  }, [state.problems]);

  useEffect(() => { if (!isRunning) setTimeLeft(duration * 60); }, [duration, isRunning]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => { setTimeLeft(t => t - 1); }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Session complete
      finishSession();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
  };

  const pickRandomProblem = useCallback(() => {
    if (problemPool.length === 0) return;
    const usedIds = new Set(sessionProblems.map(p => p.id));
    const available = problemPool.filter(p => !usedIds.has(p.id));
    if (available.length === 0) {
      setCurrentProblem(null);
      return;
    }
    // Pick a random one from top half (weighted toward medium/hard)
    const idx = Math.floor(Math.random() * Math.min(available.length, Math.max(5, available.length)));
    setCurrentProblem(available[idx]);
    setProblemStartTime(Date.now());
  }, [problemPool, sessionProblems]);

  const handleStart = () => {
    if (!isRunning && timeLeft === 0) {
      // Restart
      setTimeLeft(duration * 60);
      setSessionProblems([]);
      setCurrentProblem(null);
    }
    setIsRunning(true);
    if (!currentProblem) pickRandomProblem();
  };

  const handleStop = () => {
    setIsRunning(false);
    finishSession();
  };

  const handleSolved = () => {
    if (!currentProblem) return;
    const elapsed = Math.round((Date.now() - problemStartTime) / 1000);
    setSessionProblems(prev => [...prev, { id: currentProblem.id, title: currentProblem.title, outcome: 'solved', timeTaken: elapsed }]);
    pickRandomProblem();
  };

  const handleSkip = () => {
    if (!currentProblem) return;
    const elapsed = Math.round((Date.now() - problemStartTime) / 1000);
    setSessionProblems(prev => [...prev, { id: currentProblem.id, title: currentProblem.title, outcome: 'skipped', timeTaken: elapsed }]);
    pickRandomProblem();
  };

  const finishSession = () => {
    setIsRunning(false);
    if (sessionProblems.length > 0) {
      const session: MockSession = {
        id: uuidv4(),
        date: new Date().toISOString(),
        problemsAttempted: sessionProblems.length,
        problemsSolved: sessionProblems.filter(p => p.outcome === 'solved').length,
        problemsSkipped: sessionProblems.filter(p => p.outcome === 'skipped').length,
        duration: duration * 60 - timeLeft,
        problems: sessionProblems.map(p => p.id)
      };
      dispatch({ type: 'ADD_MOCK_SESSION', payload: session });
      dispatch({ type: 'RECORD_ACTIVITY' });
    }
    setCurrentProblem(null);
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;
  const solvedCount = sessionProblems.filter(p => p.outcome === 'solved').length;
  const skippedCount = sessionProblems.filter(p => p.outcome === 'skipped').length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-[var(--c-text)]">Mock Interview</h1>
          <p className="text-xs text-[var(--c-text-3)]">Simulate real interview conditions with timed random problems.</p>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${showHistory ? 'bg-[var(--c-accent-soft)] text-[var(--c-accent)]' : 'bg-[var(--c-surface)] text-[var(--c-text-2)] hover:text-[var(--c-text)]'}`}
        >
          <History size={14} /><span>History</span>
        </button>
      </div>

      {/* Timer + Current Problem */}
      <div className="ln-panel p-6 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 bg-[var(--c-accent-soft)] transition-all duration-1000" style={{ height: `${progress}%` }} />
        <div className="relative z-10">
          {/* Timer */}
          <div className="text-center mb-6">
            <div className="text-[4rem] font-mono tracking-wider font-bold text-[var(--c-text)] leading-none tabular-nums">{formatTime(timeLeft)}</div>
            {isRunning && (
              <div className="flex items-center justify-center space-x-4 mt-2 text-xs text-[var(--c-text-3)]">
                <span className="flex items-center space-x-1"><CheckCircle size={12} className="text-[var(--c-success)]" /><span>{solvedCount} solved</span></span>
                <span className="flex items-center space-x-1"><SkipForward size={12} className="text-[var(--c-warning)]" /><span>{skippedCount} skipped</span></span>
              </div>
            )}
          </div>

          {/* Current Problem Card */}
          {isRunning && currentProblem && (
            <div className="ln-card p-4 mb-6 mx-auto max-w-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Badge variant={currentProblem.difficulty === 'easy' ? 'easy' : currentProblem.difficulty === 'medium' ? 'medium' : 'hard'}>{currentProblem.difficulty}</Badge>
                    <Badge variant="muted">{currentProblem.topics[0] || 'N/A'}</Badge>
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--c-text)]">{currentProblem.title}</h3>
                </div>
                {currentProblem.url && (
                  <a href={currentProblem.url} target="_blank" rel="noopener noreferrer" className="shrink-0 p-2 bg-[var(--c-accent)] hover:bg-[var(--c-accent-h)] text-white rounded transition-colors" title="Open problem">
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
              <div className="flex space-x-2 mt-3">
                <button onClick={handleSolved} className="flex-1 py-2 bg-[var(--c-success)] hover:opacity-80 text-white rounded text-xs font-semibold transition-opacity flex items-center justify-center space-x-1.5">
                  <CheckCircle size={14} /><span>Solved</span>
                </button>
                <button onClick={handleSkip} className="flex-1 py-2 bg-[var(--c-surface)] hover:bg-[var(--c-border)] text-[var(--c-text-2)] rounded text-xs font-medium transition-colors flex items-center justify-center space-x-1.5">
                  <SkipForward size={14} /><span>Skip</span>
                </button>
              </div>
            </div>
          )}

          {isRunning && !currentProblem && problemPool.length > 0 && (
            <div className="text-center text-[var(--c-text-3)] text-sm mb-6 p-4">
              No more unique problems available. <button onClick={finishSession} className="text-[var(--c-accent)] font-medium">End session</button>
            </div>
          )}

          {!isRunning && problemPool.length === 0 && (
            <div className="text-center text-[var(--c-text-3)] text-xs mb-6">
              Add some problems first to use Mock Interview mode.
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-col items-center space-y-4 max-w-sm mx-auto">
            <button
              onClick={isRunning ? handleStop : handleStart}
              disabled={problemPool.length === 0}
              className={`w-full py-3.5 rounded font-semibold text-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-40 ${isRunning ? 'bg-[var(--c-danger-soft)] text-[var(--c-danger)] border border-[var(--c-danger)]' : 'bg-[var(--c-success)] text-white hover:opacity-80'}`}
            >
              {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRunning ? 'End Session' : timeLeft === 0 ? 'New Session' : 'Start Interview'}</span>
            </button>

            {!isRunning && (
              <div className="pt-4 border-t border-[var(--c-border)] w-full flex flex-col items-center space-y-3">
                <div className="flex items-center space-x-1.5 text-[var(--c-text-3)] text-xs"><Settings className="w-3.5 h-3.5" /><span>Duration</span></div>
                <div className="flex items-center space-x-1 bg-[var(--c-bg)] rounded p-1 border border-[var(--c-border)]">
                  {[30, 45, 60, 90].map(mins => (
                    <button key={mins} onClick={() => setDuration(mins)}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${duration === mins ? 'bg-[var(--c-accent-soft)] text-[var(--c-accent)]' : 'text-[var(--c-text-3)] hover:text-[var(--c-text)]'}`}
                    >{mins}m</button>
                  ))}
                </div>
                <p className="text-[10px] text-[var(--c-text-3)] flex items-center space-x-1">
                  <Shuffle size={10} /><span>{problemPool.length} problems in pool (medium-first queue)</span>
                </p>
              </div>
            )}
          </div>

          {/* Current Session Results (inline when stopped after session) */}
          {!isRunning && sessionProblems.length > 0 && (
            <div className="mt-6 pt-4 border-t border-[var(--c-border)]">
              <h4 className="text-xs font-semibold text-[var(--c-text)] mb-3">Session Results</h4>
              <div className="space-y-1.5">
                {sessionProblems.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-[var(--c-bg)] border border-[var(--c-border)] rounded text-xs">
                    <div className="flex items-center space-x-2">
                      {p.outcome === 'solved' ? <CheckCircle size={12} className="text-[var(--c-success)]" /> : <XCircle size={12} className="text-[var(--c-warning)]" />}
                      <span className="text-[var(--c-text)]">{p.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[var(--c-text-3)]">{formatTime(p.timeTaken)}</span>
                      <Badge variant={p.outcome === 'solved' ? 'success' : 'warning'}>{p.outcome}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Session History */}
      {showHistory && (
        <div className="ln-panel overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--c-border)]">
            <h3 className="text-sm font-semibold text-[var(--c-text)]">Session History</h3>
            <p className="text-[10px] text-[var(--c-text-3)]">{state.mockSessions.length} session{state.mockSessions.length !== 1 ? 's' : ''} recorded</p>
          </div>
          {state.mockSessions.length === 0 ? (
            <div className="p-8 text-center text-[var(--c-text-3)] text-xs">No sessions yet. Complete a mock interview to track your history.</div>
          ) : (
            <div className="max-h-[360px] overflow-y-auto">
              {[...state.mockSessions].reverse().map((session) => (
                <div key={session.id} className="px-5 py-3.5 border-b border-[var(--c-border)] flex items-center justify-between hover:bg-[var(--c-surface)] transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-md bg-[var(--c-accent-soft)] flex items-center justify-center text-[var(--c-accent)]">
                      <Clock size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[var(--c-text)]">{format(new Date(session.date), 'MMM dd, yyyy · h:mm a')}</p>
                      <p className="text-[10px] text-[var(--c-text-3)]">
                        Duration: {formatTime(session.duration)} · {formatDistanceToNow(new Date(session.date), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    <div className="text-center">
                      <p className="text-[var(--c-success)] font-bold">{session.problemsSolved}</p>
                      <p className="text-[10px] text-[var(--c-text-3)]">solved</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[var(--c-warning)] font-bold">{session.problemsSkipped}</p>
                      <p className="text-[10px] text-[var(--c-text-3)]">skipped</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[var(--c-text)] font-bold">{session.problemsAttempted}</p>
                      <p className="text-[10px] text-[var(--c-text-3)]">total</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="ln-panel p-5">
        <h3 className="text-sm font-semibold text-[var(--c-text)] mb-3">Interview Tips</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[var(--c-text-3)]">
          <li className="flex items-start space-x-2"><Clock className="w-4 h-4 text-[var(--c-accent)] mt-0.5 shrink-0" /><span>Spend the first 5 minutes understanding the problem and edge cases before coding.</span></li>
          <li className="flex items-start space-x-2"><Clock className="w-4 h-4 text-[var(--c-accent)] mt-0.5 shrink-0" /><span>Think out loud — the interviewer wants to see your thought process, not just the answer.</span></li>
          <li className="flex items-start space-x-2"><Clock className="w-4 h-4 text-[var(--c-accent)] mt-0.5 shrink-0" /><span>Start with brute force, then optimize. Communicate trade-offs clearly.</span></li>
          <li className="flex items-start space-x-2"><Clock className="w-4 h-4 text-[var(--c-accent)] mt-0.5 shrink-0" /><span>If stuck for 2+ minutes, move on. Better to show breadth than perfection.</span></li>
        </ul>
      </div>
    </div>
  );
};
