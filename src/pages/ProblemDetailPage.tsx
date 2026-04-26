import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/api';
import { ArrowLeft, Edit, Trash2, ExternalLink, PlaySquare, Calendar, Clock, Activity, FileText, Zap, BookOpen } from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { getPlatformDisplay } from '../data/platforms';
import { PATTERNS } from '../data/patterns';
import { ProblemForm } from '../components/problems/ProblemForm';
import { showToast } from '../components/common/Toast';
import { format } from 'date-fns';

export const ProblemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const { isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const problem = state.problems.find((p) => p.id === id);

  if (!problem) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-lg font-bold text-[var(--c-text)] mb-2">Problem Not Found</h2>
        <p className="text-[var(--c-text-3)] text-sm mb-4">This problem doesn't exist or was deleted.</p>
        <button onClick={() => navigate('/problems')} className="bg-[var(--c-surface)] hover:bg-[var(--c-border)] text-[var(--c-text)] px-4 py-2 rounded text-sm transition-colors">Back to Problems</button>
      </div>
    );
  }

  if (isEditing) return <ProblemForm initialData={problem} />;

  const platform = getPlatformDisplay(problem.platform);
  const patternName = PATTERNS.find((p) => p.id === problem.pattern)?.name || 'Unknown';
  const handleDelete = async () => {
    if (window.confirm('Delete this problem?')) {
      if (!isAuthenticated) return;
      try {
        const response = await apiClient.delete(`/api/problems/${problem.id}`);
        if (response.status !== 204 && response.status !== 200) throw new Error('API Error');
        dispatch({ type: 'DELETE_PROBLEM', payload: problem.id });
        showToast('Problem deleted', 'success');
        navigate('/problems');
      } catch (err) {
        showToast('Error deleting problem', 'error');
        console.error(err);
      }
    }
  };

  const hasSolutionMapping = problem.bruteForce || problem.optimalApproach || problem.timeComplexity || problem.spaceComplexity;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/problems')} className="flex items-center space-x-1.5 text-[var(--c-text-3)] hover:text-[var(--c-text)] text-sm transition-colors">
          <ArrowLeft size={16} /><span>Back</span>
        </button>
        <div className="flex space-x-2">
          <button onClick={() => setIsEditing(true)} className="flex items-center space-x-1.5 px-3 py-1.5 bg-[var(--c-surface)] hover:bg-[var(--c-border)] text-[var(--c-text-2)] rounded text-xs transition-colors">
            <Edit size={13} /><span>Edit</span>
          </button>
          <button onClick={handleDelete} className="flex items-center space-x-1.5 px-3 py-1.5 bg-[var(--c-danger-soft)] hover:opacity-80 text-[var(--c-danger)] rounded text-xs transition-opacity">
            <Trash2 size={13} /><span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main info */}
      <div className="ln-panel p-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className={`text-[10px] font-semibold ${platform.color}`}>{platform.name}</span>
              <Badge variant={problem.difficulty === 'easy' ? 'easy' : problem.difficulty === 'medium' ? 'medium' : 'hard'}>{problem.difficulty}</Badge>
              <Badge variant="muted">{problem.status}</Badge>
            </div>
            <h1 className="text-xl font-bold text-[var(--c-text)] mb-2">{problem.title}</h1>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="accent">{patternName}</Badge>
              {problem.topics.map((topic: string, i: number) => <Badge key={i} variant="muted">{topic}</Badge>)}
            </div>
          </div>
          <div className="flex flex-col space-y-2 shrink-0">
            {problem.url && (
              <a href={problem.url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1.5 text-[var(--c-accent)] hover:text-[var(--c-accent-h)] text-xs bg-[var(--c-accent-soft)] px-3 py-2 rounded transition-colors">
                <ExternalLink size={13} /><span>Solve on {platform.name}</span>
              </a>
            )}
            {problem.youtubeLinks?.[0] && (
              <a href={problem.youtubeLinks[0]} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1.5 text-[var(--c-danger)] hover:opacity-80 text-xs bg-[var(--c-danger-soft)] px-3 py-2 rounded transition-opacity">
                <PlaySquare size={13} /><span>Video Solution</span>
              </a>
            )}
            {problem.editorialLink && (
              <a href={problem.editorialLink} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1.5 text-[var(--c-success)] hover:opacity-80 text-xs bg-[var(--c-success-soft)] px-3 py-2 rounded transition-opacity">
                <BookOpen size={13} /><span>Editorial</span>
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5 border-t border-[var(--c-border)]">
          {/* Left: Solution info */}
          <div className="md:col-span-2 space-y-4">
            {/* Complexity badges (if available) */}
            {(problem.timeComplexity || problem.spaceComplexity) && (
              <div className="flex flex-wrap gap-2">
                {problem.timeComplexity && (
                  <div className="flex items-center space-x-1.5 bg-[var(--c-accent-soft)] px-3 py-1.5 rounded text-xs">
                    <Zap size={11} className="text-[var(--c-accent)]" />
                    <span className="text-[var(--c-text-2)]">Time:</span>
                    <span className="font-mono font-semibold text-[var(--c-accent)]">{problem.timeComplexity}</span>
                  </div>
                )}
                {problem.spaceComplexity && (
                  <div className="flex items-center space-x-1.5 bg-[var(--c-surface)] px-3 py-1.5 rounded text-xs">
                    <FileText size={11} className="text-[var(--c-text-2)]" />
                    <span className="text-[var(--c-text-2)]">Space:</span>
                    <span className="font-mono font-semibold text-[var(--c-text)]">{problem.spaceComplexity}</span>
                  </div>
                )}
              </div>
            )}

            {/* Solution Summary */}
            <div>
              <h3 className="text-[10px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-1.5">Solution Summary</h3>
              <div className="bg-[var(--c-bg)] rounded p-3 border border-[var(--c-border)] text-sm text-[var(--c-text)] whitespace-pre-wrap">
                {problem.solutionSummary || <span className="text-[var(--c-text-3)] italic">No summary provided.</span>}
              </div>
            </div>

            {/* Approaches (Best Solution Mapping) */}
            {hasSolutionMapping && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {problem.bruteForce && (
                  <div>
                    <h3 className="text-[10px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-[var(--c-warning)]" />
                      <span>Brute Force</span>
                    </h3>
                    <div className="bg-[var(--c-bg)] rounded p-3 border border-[var(--c-border)] text-xs text-[var(--c-text)] whitespace-pre-wrap">{problem.bruteForce}</div>
                  </div>
                )}
                {problem.optimalApproach && (
                  <div>
                    <h3 className="text-[10px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-[var(--c-success)]" />
                      <span>Optimal Approach</span>
                    </h3>
                    <div className="bg-[var(--c-bg)] rounded p-3 border border-[var(--c-border)] text-xs text-[var(--c-text)] whitespace-pre-wrap">{problem.optimalApproach}</div>
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            {problem.notes && (
              <div>
                <h3 className="text-[10px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-1.5">Notes</h3>
                <div className="bg-[var(--c-bg)] rounded p-3 border border-[var(--c-border)] text-sm text-[var(--c-text)] whitespace-pre-wrap">{problem.notes}</div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <div className="bg-[var(--c-bg)] rounded p-4 border border-[var(--c-border)]">
              <h3 className="text-[10px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-3">Revision</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2.5 text-[var(--c-text)]">
                  <Calendar size={14} className="text-[var(--c-accent)]" />
                  <div>
                    <p className="text-[10px] text-[var(--c-text-3)]">Next Review</p>
                    <p className="text-xs font-medium">{format(new Date(problem.nextReview), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2.5 text-[var(--c-text)]">
                  <Activity size={14} className="text-[var(--c-success)]" />
                  <div>
                    <p className="text-[10px] text-[var(--c-text-3)]">Confidence</p>
                    <p className="text-xs font-medium capitalize">{problem.confidence}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2.5 text-[var(--c-text)]">
                  <Clock size={14} className="text-[var(--c-warning)]" />
                  <div>
                    <p className="text-[10px] text-[var(--c-text-3)]">Time Taken</p>
                    <p className="text-xs font-medium">{problem.timeTaken ? `${problem.timeTaken} mins` : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={() => navigate(`/resolve/${problem.id}`)} className="w-full py-2.5 bg-[var(--c-accent)] hover:bg-[var(--c-accent-h)] text-white rounded text-sm font-semibold transition-colors">
              Start Revision
            </button>
          </div>
        </div>
      </div>

      {/* Revision History */}
      <div className="ln-panel p-5">
        <h3 className="text-sm font-semibold text-[var(--c-text)] mb-3">Revision History</h3>
        {problem.submits.length === 0 ? (
          <p className="text-[var(--c-text-3)] text-xs py-3">No revision history yet.</p>
        ) : (
          <div className="space-y-2">
            {[...problem.submits].reverse().map((sub, i) => (
              <div key={sub.id} className="flex items-center justify-between p-2.5 bg-[var(--c-bg)] border border-[var(--c-border)] rounded">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${sub.outcome === 'solved' ? 'bg-[var(--c-success)]' : 'bg-[var(--c-danger)]'}`} />
                  <div>
                    <p className="text-xs font-medium text-[var(--c-text)]">Attempt {problem.submits.length - i}</p>
                    <p className="text-[10px] text-[var(--c-text-3)]">{format(new Date(sub.date), 'MMM dd, yyyy h:mm a')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-[var(--c-text-3)]">{sub.timeTaken}m</span>
                  <Badge variant={sub.outcome === 'solved' ? 'success' : 'danger'}>{sub.outcome}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
