import React from 'react';
import { Problem } from '../../types';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title as ChartTitle, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../../context/ThemeContext';
ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);
export const DifficultyChart: React.FC<{ problems: Problem[] }> = ({ problems }) => {
  const { theme } = useTheme();
  const easy = problems.filter(p => p.difficulty === 'easy').length;
  const medium = problems.filter(p => p.difficulty === 'medium').length;
  const hard = problems.filter(p => p.difficulty === 'hard').length;
  const isDark = theme === 'dark';
  const data = { labels: ['Easy', 'Medium', 'Hard'], datasets: [{ label: 'Solved', data: [easy, medium, hard], backgroundColor: isDark ? ['#34d399', '#fbbf24', '#f87171'] : ['#10b981', '#f59e0b', '#ef4444'], borderRadius: 4, barThickness: 36 }] };
  const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: isDark ? '#111111' : '#ffffff', titleColor: isDark ? '#f8f8f8' : '#111', bodyColor: isDark ? '#888' : '#666', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)', borderWidth: 1 } }, scales: { y: { beginAtZero: true, grid: { color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)' }, ticks: { color: isDark ? '#555' : '#999', stepSize: 1 } }, x: { grid: { display: false }, ticks: { color: isDark ? '#555' : '#999' } } } };
  return (<div className="ln-panel p-5 h-[280px]"><h3 className="text-sm font-semibold text-[var(--c-text)] mb-3">Difficulty Breakdown</h3><div className="h-[200px]"><Bar data={data} options={options} /></div></div>);
};
