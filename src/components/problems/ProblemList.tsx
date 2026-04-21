import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ProblemCard } from './ProblemCard';
import { FilterBar, FilterState } from './FilterBar';
import { EmptyState } from '../common/EmptyState';
import { SearchX, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProblemList: React.FC = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>({ search: '', platform: '', difficulty: '', pattern: '', status: '' });
  const filteredProblems = useMemo(() => state.problems.filter((p: any) => {
    return (filters.search === '' || p.title.toLowerCase().includes(filters.search.toLowerCase())) && (filters.platform === '' || p.platform === filters.platform) && (filters.difficulty === '' || p.difficulty === filters.difficulty) && (filters.pattern === '' || p.pattern === filters.pattern) && (filters.status === '' || p.status === filters.status);
  }).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [state.problems, filters]);

  return (
    <div>
      <div className="flex justify-between items-end mb-5">
        <div><h1 className="text-xl font-bold text-[var(--c-text)] mb-1">Problem Library</h1><p className="text-xs text-[var(--c-text-3)]">{state.problems.length} problems tracked</p></div>
        <button onClick={() => navigate('/add')} className="flex items-center space-x-1.5 bg-[var(--c-accent)] hover:bg-[var(--c-accent-h)] text-white px-3 py-2 rounded text-xs font-semibold transition-colors"><PlusCircle size={14} /><span>Add Problem</span></button>
      </div>
      <FilterBar filters={filters} setFilters={setFilters} />
      {filteredProblems.length === 0 ? (<div className="pt-8"><EmptyState icon={<SearchX size={28} />} title="No problems found" description="No problems match your current filters." action={<button onClick={() => setFilters({ search: '', platform: '', difficulty: '', pattern: '', status: '' })} className="text-[var(--c-accent)] hover:text-[var(--c-accent-h)] text-xs font-medium">Clear filters</button>} /></div>) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{filteredProblems.map((problem: any) => <ProblemCard key={problem.id} problem={problem} />)}</div>
      )}
    </div>
  );
};
