import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/common/Toast';
import { UserPlus, Infinity as InfinityIcon } from 'lucide-react';

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await apiClient.post('/api/auth/register', { email, password });

      if (response.status === 200) {
        // Automatically login after registration
        const loginResponse = await apiClient.post('/api/auth/login', new URLSearchParams({
          username: email,
          password: password,
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        if (loginResponse.status === 200) {
          login(loginResponse.data.access_token);
          showToast('Registration successful', 'success');
          navigate('/');
        }
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      showToast(err.response?.data?.detail || 'An error occurred during registration', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--c-bg)] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--c-accent)] opacity-[0.15] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--c-warning)] opacity-[0.1] blur-[120px] pointer-events-none" />
      
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-bl from-[var(--c-accent)] to-[#8b5cf6] flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 mx-auto mb-6 transform transition-transform hover:scale-105">
            <InfinityIcon size={36} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-extrabold text-[var(--c-text)] tracking-tight">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-[var(--c-text-3)] font-medium">
            Join O(1) Knot and master algorithms
          </p>
        </div>
        
        <div className="bg-[var(--c-panel)] py-8 px-6 shadow-2xl shadow-black/5 border border-[var(--c-border)] rounded-2xl sm:px-10 backdrop-blur-xl transition-all">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-[var(--c-text-2)] mb-2 uppercase tracking-wide">
                Email address
              </label>
              <input
                type="email"
                required
                className="appearance-none block w-full px-4 py-3 border border-[var(--c-border)] rounded-xl bg-[var(--c-surface)] text-[var(--c-text)] placeholder-[var(--c-text-3)] focus:outline-none focus:ring-2 focus:ring-[var(--c-accent)]/50 focus:border-[var(--c-accent)] transition-all sm:text-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-[var(--c-text-2)] mb-2 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                className="appearance-none block w-full px-4 py-3 border border-[var(--c-border)] rounded-xl bg-[var(--c-surface)] text-[var(--c-text)] placeholder-[var(--c-text-3)] focus:outline-none focus:ring-2 focus:ring-[var(--c-accent)]/50 focus:border-[var(--c-accent)] transition-all sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="mt-2 text-[10px] text-[var(--c-text-3)] font-medium">Must be at least 6 characters long.</p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[var(--c-accent)] hover:bg-[var(--c-accent-h)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--c-accent)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <UserPlus size={16} />
                    <span>Sign up</span>
                  </span>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-[var(--c-border)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-[var(--c-panel)] text-[var(--c-text-3)]">
                Already have an account?
              </span>
            </div>
          </div>
          
          <div className="mt-6">
            <Link 
              to="/login" 
              className="w-full flex justify-center py-2.5 px-4 border border-[var(--c-border)] rounded-xl shadow-sm text-sm font-medium text-[var(--c-text)] bg-[var(--c-surface)] hover:bg-[var(--c-border)] transition-all"
            >
              Sign in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
