import { useState, useEffect } from 'react';
import { Users, TrendingUp, Award, Target, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiClient } from '../services/api';
import { showToast } from '../components/common/Toast';

interface BenchmarkData {
  user: {
    solved_count: number;
    success_rate: number;
    percentile: number;
  };
  global: {
    avg_solved: number;
    avg_success_rate: number;
    avg_consistency: number;
  };
  percentiles: Array<{ label: string; value: number }>;
}

export const BenchmarkPage = () => {
  const [data, setData] = useState<BenchmarkData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/api/stats/benchmark')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load benchmark stats", err);
        showToast("Could not load stats", "error");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-[var(--c-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-10">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold text-[var(--c-text)]">Peer Benchmark</h1>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--c-accent)]/10 text-[var(--c-accent)] font-bold border border-[var(--c-accent)]/20">BETA</span>
        </div>
        <p className="text-[var(--c-text-3)] mt-1">See how your DSA journey compares to the community</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Main Score Card */}
        <div className="lg:col-span-2 bg-[var(--c-panel)] rounded-3xl border border-[var(--c-border)] p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--c-accent)] opacity-[0.05] rounded-full -mr-32 -mt-32" />
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-[var(--c-accent)]/10 text-[var(--c-accent)] rounded-xl">
                <Award size={24} />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider text-[var(--c-text-2)]">Overall Standing</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <span className="text-7xl font-black text-[var(--c-text)] font-mono leading-none">
                  {data.user.percentile}
                  <span className="text-3xl text-[var(--c-accent)] ml-1">th</span>
                </span>
                <p className="text-xl font-medium text-[var(--c-text-2)] mt-4">
                  Percentile among all users
                </p>
                <div className="mt-6 flex items-center space-x-2 text-[var(--c-success)] bg-[var(--c-success)]/10 px-4 py-2 rounded-full w-fit text-sm font-bold">
                  <TrendingUp size={16} />
                  <span>Top {100 - data.user.percentile}% of learners</span>
                </div>
              </div>

              <div className="flex-1 max-w-sm space-y-4">
                {data.percentiles.map((p, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs font-bold text-[var(--c-text-3)] uppercase tracking-widest mb-2">
                      <span>{p.label}</span>
                      <span className="text-[var(--c-text)]">{p.value}%</span>
                    </div>
                    <div className="h-2 bg-[var(--c-surface)] rounded-full overflow-hidden border border-[var(--c-border)]">
                      <div 
                        className="h-full bg-gradient-to-r from-[var(--c-accent)] to-[#818cf8] rounded-full transition-all duration-1000 delay-300"
                        style={{ width: `${p.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Global Stats Sidebar */}
        <div className="bg-[var(--c-surface)] rounded-3xl border border-[var(--c-border)] p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-[var(--c-text)] mb-6 flex items-center">
              <Users size={20} className="mr-2 text-[var(--c-accent)]" />
              Community Stats
            </h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--c-text-3)]">Avg. Problems Solved</span>
                <span className="text-lg font-bold text-[var(--c-text)] font-mono">{data.global.avg_solved}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--c-text-3)]">Avg. Accuracy Rate</span>
                <span className="text-lg font-bold text-[var(--c-text)] font-mono">{data.global.avg_success_rate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--c-text-3)]">Weekly Consistency</span>
                <span className="text-lg font-bold text-[var(--c-text)] font-mono">{data.global.avg_consistency}d</span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-[var(--c-panel)] rounded-2xl border border-[var(--c-border)] text-[11px] text-[var(--c-text-3)] leading-relaxed">
            <Info size={14} className="mb-2 text-[var(--c-accent)]" />
            Aggregated from 1,200+ active O(1) Knot users over the last 30 days.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Comparison List */}
        <div className="bg-[var(--c-panel)] rounded-2xl border border-[var(--c-border)] p-6">
          <h3 className="font-bold text-[var(--c-text)] mb-6 flex items-center">
            <Target size={18} className="mr-2 text-[var(--c-accent)]" />
            Comparison Details
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[var(--c-surface)] rounded-xl border border-[var(--c-border)]">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg mr-4 ${data.user.solved_count >= data.global.avg_solved ? 'bg-[var(--c-success)]/10 text-[var(--c-success)]' : 'bg-[var(--c-danger)]/10 text-[var(--c-danger)]'}`}>
                  {data.user.solved_count >= data.global.avg_solved ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--c-text-3)] uppercase tracking-wider">Solved Count</p>
                  <p className="text-sm font-bold text-[var(--c-text)]">{data.user.solved_count} vs {data.global.avg_solved}</p>
                </div>
              </div>
              <span className={`text-xs font-bold ${data.user.solved_count >= data.global.avg_solved ? 'text-[var(--c-success)]' : 'text-[var(--c-danger)]'}`}>
                {data.user.solved_count >= data.global.avg_solved ? 'Above Avg' : 'Below Avg'}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-[var(--c-surface)] rounded-xl border border-[var(--c-border)]">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg mr-4 ${data.user.success_rate >= data.global.avg_success_rate ? 'bg-[var(--c-success)]/10 text-[var(--c-success)]' : 'bg-[var(--c-danger)]/10 text-[var(--c-danger)]'}`}>
                  {data.user.success_rate >= data.global.avg_success_rate ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--c-text-3)] uppercase tracking-wider">Accuracy</p>
                  <p className="text-sm font-bold text-[var(--c-text)]">{data.user.success_rate}% vs {data.global.avg_success_rate}%</p>
                </div>
              </div>
              <span className={`text-xs font-bold ${data.user.success_rate >= data.global.avg_success_rate ? 'text-[var(--c-success)]' : 'text-[var(--c-danger)]'}`}>
                {data.user.success_rate >= data.global.avg_success_rate ? 'Above Avg' : 'Below Avg'}
              </span>
            </div>
          </div>
        </div>

        {/* Insight Card */}
        <div className="bg-gradient-to-br from-[var(--c-accent)] to-[#818cf8] rounded-2xl p-6 text-white flex flex-col justify-between shadow-lg shadow-indigo-500/20">
          <div>
            <h3 className="text-lg font-bold mb-2">Weekly Insight</h3>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Your accuracy is currently in the top 10% of users. However, your problem volume is below the community average. 
            </p>
          </div>
          
          <div className="mt-6 flex items-center bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-100">Recommendation</p>
              <p className="text-sm font-medium">Focus on quantity this week: Aim for 5 more problems.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
