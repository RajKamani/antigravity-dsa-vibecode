import React from 'react';
import { Flame, Search, Sun, Moon, HelpCircle, Menu } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

export const Header: React.FC<{ onOpenHelp: () => void; onToggleMenu?: () => void }> = ({ onOpenHelp, onToggleMenu }) => {
  const { state } = useAppContext();
  const { theme, toggleTheme } = useTheme();
  const streak = state.streaks.current;

  return (
    <header className="h-14 flex items-center justify-between px-4 md:px-6 bg-[var(--c-panel)] border-b border-[var(--c-border)] sticky top-0 z-30 transition-colors" role="banner">
      <div className="flex items-center flex-1">
        <button
          onClick={onToggleMenu}
          className="mr-3 p-1.5 rounded-md hover:bg-[var(--c-surface)] text-[var(--c-text-2)] md:hidden transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--c-text-3)]" aria-hidden="true">
            <Search size={16} />
          </span>
          <input 
            type="search" 
            placeholder="Search problems..." 
            aria-label="Search problems"
            className="w-full pl-9 pr-4 py-1.5 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-md text-sm text-[var(--c-text)] placeholder-[var(--c-text-3)] focus:outline-none focus:border-[var(--c-accent)] transition-colors"
          />
        </div>
      </div>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-3 ml-auto">
        <div className="flex items-center space-x-1.5 text-[var(--c-accent)] text-sm" aria-label={`Current streak: ${streak} days`}>
          <Flame size={16} />
          <span className="font-semibold text-[var(--c-text)] ln-mono">{streak}</span>
          <span className="text-[var(--c-text-3)] text-xs">day{streak !== 1 ? 's' : ''}</span>
        </div>

        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-md flex items-center justify-center bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-border-hover)] text-[var(--c-text-2)] hover:text-[var(--c-text)] transition-all"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <button
          onClick={onOpenHelp}
          className="w-8 h-8 rounded-md flex items-center justify-center bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-border-hover)] text-[var(--c-text-2)] hover:text-[var(--c-text)] transition-all"
          aria-label="Help & Onboarding"
        >
          <HelpCircle size={15} />
        </button>
        
        <div className="w-7 h-7 rounded-full bg-[var(--c-surface)] border border-[var(--c-border)] flex items-center justify-center cursor-pointer hover:border-[var(--c-border-hover)] transition-colors" aria-label="User profile">
          <span className="text-xs font-medium text-[var(--c-text-2)]">U</span>
        </div>
      </div>
    </header>
  );
};
