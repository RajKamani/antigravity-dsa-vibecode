import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListTodo, PlusCircle, Grid, Target, Timer, Server, CalendarDays, Infinity as InfinityIcon, Download } from 'lucide-react';

export const Sidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({ isOpen, onClose }) => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/problems', label: 'Problems', icon: <ListTodo size={18} /> },
    { path: '/add', label: 'Add Problem', icon: <PlusCircle size={18} /> },
    { path: '/daily-plan', label: 'Daily Plan', icon: <CalendarDays size={18} /> },
    { path: '/patterns', label: 'Patterns', icon: <Grid size={18} /> },
    { path: '/readiness', label: 'Readiness', icon: <Target size={18} /> },
    { path: '/mock', label: 'Mock Interview', icon: <Timer size={18} /> },
    { path: '/system-design', label: 'System Design', icon: <Server size={18} /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 w-60 bg-[var(--c-panel)] border-r border-[var(--c-border)] z-50 flex flex-col h-screen transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} 
        aria-label="Main navigation"
      >
      <div className="px-5 py-5 flex items-center space-x-2.5 border-b border-[var(--c-border)]">
        <div className="w-8 h-8 rounded-md bg-[var(--c-accent)] flex items-center justify-center text-white shadow-sm">
          <InfinityIcon size={20} strokeWidth={2.5} />
        </div>
        <h1 className="text-base font-bold text-[var(--c-text)] tracking-tight font-mono">O(1) Knot</h1>
      </div>
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto mt-3 pb-6" aria-label="Primary">
        <p className="px-3 text-[10px] font-semibold text-[var(--c-text-3)] uppercase tracking-widest mb-2" aria-hidden="true">Menu</p>
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            end={item.path === '/'}
            id={`tour-${item.path === '/' ? 'dashboard' : item.path.slice(1)}`}
            className={({ isActive }) => `flex items-center space-x-2.5 px-3 py-2 rounded-md text-sm transition-colors duration-150 ${isActive ? 'bg-[var(--c-surface)] text-[var(--c-text)] font-medium' : 'text-[var(--c-text-2)] hover:text-[var(--c-text)] hover:bg-[var(--c-surface)]'}`}>
            {item.icon}<span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-[var(--c-border)]">
        <a 
          href="/o1-knot-extension.zip" 
          download
          className="flex items-center justify-center space-x-2 w-full px-3 py-2 bg-[var(--c-surface)] text-[var(--c-text)] rounded-md text-sm border border-[var(--c-border)] hover:border-[var(--c-accent)] transition-colors"
        >
          <Download size={16} />
          <span>Get Chrome Ext</span>
        </a>
        <p className="text-[9px] text-[var(--c-text-3)] text-center mt-2 px-1">
          Unzip and "Load unpacked" in chrome://extensions
        </p>
      </div>
    </aside>
    </>
  );
};
