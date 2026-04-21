import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../../context/ThemeContext';
ChartJS.register(ArcElement, Tooltip, Legend);
export const ReadinessScoreCircle: React.FC<{ score: number }> = ({ score }) => {
  const { theme } = useTheme();
  let color = '#34d399'; if (score < 40) color = '#f87171'; else if (score < 70) color = '#fbbf24';
  if (theme === 'light') { if (score < 40) color = '#ef4444'; else if (score < 70) color = '#f59e0b'; else color = '#10b981'; }
  const gapColor = theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)';
  const data = { labels: ['Readiness', 'Gap'], datasets: [{ data: [score, 100 - score], backgroundColor: [color, gapColor], borderWidth: 0, cutout: '82%' }] };
  const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } } };
  return (
    <div className="ln-panel p-6 flex flex-col items-center justify-center relative w-full h-full min-h-[280px]">
      <div className="absolute inset-0 m-auto w-44 h-44"><Doughnut data={data} options={options} /><div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-4xl font-bold" style={{ color }}>{score}</span><span className="text-[10px] font-medium text-[var(--c-text-3)] mt-1 uppercase tracking-widest">Score</span></div></div>
    </div>
  );
};
