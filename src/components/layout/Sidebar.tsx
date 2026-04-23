import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListTodo, PlusCircle, Grid, Target, Timer, Server, CalendarDays } from 'lucide-react';

export const Sidebar: React.FC = () => {
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
    <aside className="fixed inset-y-0 left-0 w-60 bg-[var(--c-panel)] border-r border-[var(--c-border)] z-40 hidden md:flex flex-col h-screen transition-colors" aria-label="Main navigation">
      <div className="px-5 py-5 flex items-center space-x-2.5 border-b border-[var(--c-border)]">
        <div className="w-7 h-7 rounded-md bg-[var(--c-accent)] flex items-center justify-center text-white font-bold text-sm ln-mono">D</div>
        <h1 className="text-base font-semibold text-[var(--c-text)] tracking-tight">DSA Tracker</h1>
      </div>
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto mt-3 pb-6" aria-label="Primary">
        <p className="px-3 text-[10px] font-semibold text-[var(--c-text-3)] uppercase tracking-widest mb-2" aria-hidden="true">Menu</p>
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} end={item.path === '/'}
            className={({ isActive }) => `flex items-center space-x-2.5 px-3 py-2 rounded-md text-sm transition-colors duration-150 ${isActive ? 'bg-[var(--c-surface)] text-[var(--c-text)] font-medium' : 'text-[var(--c-text-2)] hover:text-[var(--c-text)] hover:bg-[var(--c-surface)]'}`}>
            {item.icon}<span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
