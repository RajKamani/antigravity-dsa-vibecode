import React from 'react';
import { Flame, Search, Sun, Moon } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

export const Header: React.FC = () => {
  const { state } = useAppContext();
  const { theme, toggleTheme } = useTheme();
  const streak = state.streaks.current;

  return (
    <header className="h-14 flex items-center justify-between px-6 bg-[var(--c-panel)] border-b border-[var(--c-border)] sticky top-0 z-30 transition-colors">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--c-text-3)]">
            <Search size={16} />
          </span>
          <input 
            type="text" 
            placeholder="Search problems..." 
            className="w-full pl-9 pr-4 py-1.5 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-md text-sm text-[var(--c-text)] placeholder-[var(--c-text-3)] focus:outline-none focus:border-[var(--c-accent)] transition-colors"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-3 ml-4">
        <div className="flex items-center space-x-1.5 text-[var(--c-accent)] text-sm">
          <Flame size={16} className={streak > 0 ? 'animate-pulse' : ''} />
          <span className="font-semibold text-[var(--c-text)]">{streak}</span>
          <span className="text-[var(--c-text-3)] text-xs">day{streak !== 1 ? 's' : ''}</span>
        </div>

        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-md flex items-center justify-center bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-border-hover)] text-[var(--c-text-2)] hover:text-[var(--c-text)] transition-all"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        
        <div className="w-7 h-7 rounded-full bg-[var(--c-surface)] border border-[var(--c-border)] flex items-center justify-center cursor-pointer hover:border-[var(--c-border-hover)] transition-colors">
          <span className="text-xs font-medium text-[var(--c-text-2)]">U</span>
        </div>
      </div>
    </header>
  );
};
