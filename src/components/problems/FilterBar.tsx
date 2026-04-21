import React from 'react';
import { Search, X } from 'lucide-react';
import { PLATFORMS } from '../../data/platforms';
import { PATTERNS } from '../../data/patterns';
export interface FilterState { search: string; platform: string; difficulty: string; pattern: string; status: string; }
interface FilterBarProps { filters: FilterState; setFilters: React.Dispatch<React.SetStateAction<FilterState>>; }
const selectClass = "bg-[var(--c-bg)] border border-[var(--c-border)] rounded text-xs text-[var(--c-text)] px-2.5 py-2 focus:outline-none focus:border-[var(--c-accent)] appearance-none min-w-[120px] transition-colors";
export const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters }) => {
  const handleReset = () => setFilters({ search: '', platform: '', difficulty: '', pattern: '', status: '' });
  const hasFilters = filters.platform || filters.difficulty || filters.pattern || filters.status || filters.search;
  return (
    <div className="ln-panel p-3 mb-5">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1"><span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-[var(--c-text-3)]"><Search size={14} /></span><input type="text" placeholder="Search problems..." value={filters.search} onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))} className="w-full pl-8 pr-3 py-2 bg-[var(--c-bg)] border border-[var(--c-border)] rounded text-xs text-[var(--c-text)] placeholder-[var(--c-text-3)] focus:outline-none focus:border-[var(--c-accent)] transition-colors" /></div>
        <div className="flex flex-wrap lg:flex-nowrap gap-2">
          <select value={filters.platform} onChange={(e) => setFilters(prev => ({ ...prev, platform: e.target.value }))} className={selectClass}><option value="">All Platforms</option>{PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          <select value={filters.difficulty} onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))} className={selectClass}><option value="">All Difficulties</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select>
          <select value={filters.pattern} onChange={(e) => setFilters(prev => ({ ...prev, pattern: e.target.value }))} className={selectClass}><option value="">All Patterns</option>{PATTERNS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          {hasFilters && <button onClick={handleReset} className="flex items-center bg-[var(--c-surface)] hover:bg-[var(--c-border)] text-[var(--c-text-2)] px-3 py-2 rounded text-xs transition-colors"><X size={14} className="mr-1" /> Reset</button>}
        </div>
      </div>
    </div>
  );
};
