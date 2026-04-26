import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { PLATFORMS } from '../../data/platforms';
import { PATTERNS } from '../../data/patterns';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/api';
import { Problem, Platform, Difficulty, Confidence } from '../../types';
import { showToast } from '../common/Toast';
import { ArrowLeft, Save, ChevronDown, ChevronUp, Download } from 'lucide-react';

const inputClass = "w-full px-3 py-2 bg-[var(--c-bg)] border border-[var(--c-border)] rounded text-sm text-[var(--c-text)] focus:outline-none focus:border-[var(--c-accent)] transition-colors";
const labelClass = "block text-xs font-medium text-[var(--c-text-2)] mb-1.5";

export const ProblemForm: React.FC<{ initialData?: Problem }> = ({ initialData }) => {
  const navigate = useNavigate();
  const { dispatch } = useAppContext();
  const { isAuthenticated } = useAuth();
  const [showAdvanced, setShowAdvanced] = useState(!!initialData?.bruteForce || !!initialData?.optimalApproach || !!initialData?.timeComplexity);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    platform: initialData?.platform || 'leetcode' as Platform,
    difficulty: initialData?.difficulty || 'easy' as Difficulty,
    pattern: initialData?.pattern || PATTERNS[0].id,
    topics: initialData?.topics ? initialData.topics.join(', ') : '',
    url: initialData?.url || '',
    youtubeLink: initialData?.youtubeLinks?.[0] || '',
    solutionSummary: initialData?.solutionSummary || '',
    notes: initialData?.notes || '',
    timeTaken: initialData?.timeTaken?.toString() || '',
    confidence: initialData?.confidence || 'medium' as Confidence,
    // Best Solution Mapping fields
    bruteForce: initialData?.bruteForce || '',
    optimalApproach: initialData?.optimalApproach || '',
    timeComplexity: initialData?.timeComplexity || '',
    spaceComplexity: initialData?.spaceComplexity || '',
    editorialLink: initialData?.editorialLink || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImportFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const data = JSON.parse(text);
      if (data && (data.title || data.url || data.code)) {
        setFormData(prev => ({
          ...prev,
          title: data.title || prev.title,
          platform: data.platform || prev.platform,
          difficulty: data.difficulty || prev.difficulty,
          url: data.url || prev.url,
          topics: data.topics ? data.topics.join(', ') : prev.topics,
          pattern: data.pattern || prev.pattern,
          solutionSummary: data.code ? `Submitted Code:\n\`\`\`\n${data.code}\n\`\`\`\n\n` + prev.solutionSummary : prev.solutionSummary
        }));
        showToast('Problem details imported!', 'success');
      } else {
        showToast('Invalid JSON format', 'error');
      }
    } catch (err) {
      showToast('Could not read clipboard or invalid JSON', 'error');
      console.error("Import error:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { showToast('Title is required', 'error'); return; }
    if (!isAuthenticated) { showToast('Please login to save', 'error'); return; }

    const topicsArray = formData.topics.split(',').map(t => t.trim()).filter(Boolean);
    const timeTakenNum = parseInt(formData.timeTaken, 10);
    const now = new Date().toISOString();
    const problemRecord: Problem = {
      id: initialData?.id || uuidv4(),
      title: formData.title,
      platform: formData.platform as Platform,
      difficulty: formData.difficulty as Difficulty,
      pattern: formData.pattern,
      topics: topicsArray,
      url: formData.url,
      youtubeLinks: formData.youtubeLink ? [formData.youtubeLink] : [],
      solutionSummary: formData.solutionSummary,
      notes: formData.notes,
      timeTaken: isNaN(timeTakenNum) ? undefined : timeTakenNum,
      confidence: formData.confidence,
      status: initialData ? initialData.status : 'learning',
      submits: initialData ? initialData.submits : [],
      nextReview: initialData ? initialData.nextReview : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'dsa',
      createdAt: initialData ? initialData.createdAt : now,
      // Solution Mapping
      bruteForce: formData.bruteForce || undefined,
      optimalApproach: formData.optimalApproach || undefined,
      timeComplexity: formData.timeComplexity || undefined,
      spaceComplexity: formData.spaceComplexity || undefined,
      editorialLink: formData.editorialLink || undefined,
    };
    
    try {
      const url = initialData ? `/api/problems/${problemRecord.id}` : '/api/problems';
      const response = initialData 
        ? await apiClient.put(url, problemRecord)
        : await apiClient.post(url, problemRecord);
      const savedData = response.data;

      if (initialData) {
        dispatch({ type: 'UPDATE_PROBLEM', payload: savedData });
        showToast('Problem updated', 'success');
      } else {
        dispatch({ type: 'ADD_PROBLEM', payload: savedData });
        showToast('Problem added', 'success');
      }
      navigate(-1);
    } catch (err) {
      showToast('Error saving to server', 'error');
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center space-x-3 mb-5">
        <button onClick={() => navigate(-1)} className="p-1.5 text-[var(--c-text-3)] hover:text-[var(--c-text)] bg-[var(--c-surface)] hover:bg-[var(--c-border)] rounded transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-[var(--c-text)]">{initialData ? 'Edit Problem' : 'Add New Problem'}</h1>
          <p className="text-xs text-[var(--c-text-3)]">Track your progress and schedule revisions</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="ln-panel p-5 space-y-5">
        {/* Import Button */}
        {!initialData && (
          <div className="flex justify-end -mt-2">
            <button
              type="button"
              onClick={handleImportFromClipboard}
              className="flex items-center space-x-1.5 text-[var(--c-accent)] hover:text-[var(--c-accent-h)] text-xs font-medium px-2.5 py-1.5 bg-[var(--c-accent)]/10 rounded border border-[var(--c-accent)]/20 hover:border-[var(--c-accent)] transition-colors"
            >
              <Download size={14} /><span>Import from Clipboard</span>
            </button>
          </div>
        )}

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2">
            <label className={labelClass}>Problem Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Two Sum" className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Platform</label>
            <select name="platform" value={formData.platform} onChange={handleChange} className={inputClass + ' appearance-none'}>{PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          </div>
          <div>
            <label className={labelClass}>Difficulty</label>
            <select name="difficulty" value={formData.difficulty} onChange={handleChange} className={inputClass + ' appearance-none'}>
              <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>DSA Pattern</label>
            <select name="pattern" value={formData.pattern} onChange={handleChange} className={inputClass + ' appearance-none'}>{PATTERNS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          </div>
          <div>
            <label className={labelClass}>Topics (comma separated)</label>
            <input type="text" name="topics" value={formData.topics} onChange={handleChange} placeholder="Arrays, Hash Map" className={inputClass} />
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[var(--c-border)]">
          <div>
            <label className={labelClass}>Problem URL</label>
            <input type="url" name="url" value={formData.url} onChange={handleChange} placeholder="https://leetcode.com/problems/..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>YouTube Solution</label>
            <input type="url" name="youtubeLink" value={formData.youtubeLink} onChange={handleChange} placeholder="https://youtu.be/..." className={inputClass} />
          </div>
        </div>

        {/* Solution Summary */}
        <div className="space-y-4 pt-4 border-t border-[var(--c-border)]">
          <div>
            <label className={labelClass}>Solution Summary</label>
            <textarea name="solutionSummary" value={formData.solutionSummary} onChange={handleChange} rows={3} placeholder="Key insights, approach, tricks..." className={inputClass + ' resize-none'} />
          </div>
          <div>
            <label className={labelClass}>Personal Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} placeholder="Gotchas, mistakes to avoid..." className={inputClass + ' resize-none'} />
          </div>
        </div>

        {/* Best Solution Mapping (collapsible) */}
        <div className="pt-4 border-t border-[var(--c-border)]">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full text-xs font-semibold text-[var(--c-text-2)] hover:text-[var(--c-text)] transition-colors"
          >
            <span>Solution Approaches & Complexity</span>
            {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Time Complexity</label>
                  <input type="text" name="timeComplexity" value={formData.timeComplexity} onChange={handleChange} placeholder="e.g. O(n log n)" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Space Complexity</label>
                  <input type="text" name="spaceComplexity" value={formData.spaceComplexity} onChange={handleChange} placeholder="e.g. O(n)" className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Brute Force Approach</label>
                <textarea name="bruteForce" value={formData.bruteForce} onChange={handleChange} rows={2} placeholder="Describe the brute force / naive solution..." className={inputClass + ' resize-none'} />
              </div>
              <div>
                <label className={labelClass}>Optimal Approach</label>
                <textarea name="optimalApproach" value={formData.optimalApproach} onChange={handleChange} rows={2} placeholder="Describe the optimal pattern-based solution..." className={inputClass + ' resize-none'} />
              </div>
              <div>
                <label className={labelClass}>Editorial Link</label>
                <input type="url" name="editorialLink" value={formData.editorialLink} onChange={handleChange} placeholder="https://..." className={inputClass} />
              </div>
            </div>
          )}
        </div>

        {/* First-time fields */}
        {!initialData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[var(--c-border)]">
            <div>
              <label className={labelClass}>Time Taken (minutes)</label>
              <input type="number" name="timeTaken" value={formData.timeTaken} onChange={handleChange} min="0" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Confidence</label>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'medium', 'high'] as Confidence[]).map((level) => (
                  <button key={level} type="button" onClick={() => setFormData(prev => ({ ...prev, confidence: level }))}
                    className={`px-3 py-2 rounded text-xs font-medium capitalize border transition-colors ${formData.confidence === level ? 'bg-[var(--c-accent-soft)] border-[var(--c-accent)] text-[var(--c-accent)]' : 'bg-[var(--c-bg)] border-[var(--c-border)] text-[var(--c-text-3)] hover:border-[var(--c-border-hover)]'}`}
                  >{level}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="pt-5 border-t border-[var(--c-border)] flex justify-end">
          <button type="submit" className="flex items-center space-x-1.5 bg-[var(--c-accent)] hover:bg-[var(--c-accent-h)] text-white px-5 py-2 rounded text-sm font-semibold transition-colors">
            <Save size={14} /><span>{initialData ? 'Save Changes' : 'Save Problem'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
