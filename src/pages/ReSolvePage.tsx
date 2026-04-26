import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ReSolveMode } from '../components/revision/ReSolveMode';
import { apiClient } from '../services/api';
import { Confidence, Outcome } from '../types';
import { showToast } from '../components/common/Toast';

export const ReSolvePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const { token, isAuthenticated } = useAuth();
  
  const problem = state.problems.find((p: any) => p.id === id);

  if (!problem) {
    return (
      <div className="p-8 text-center text-slate-400">Problem not found.</div>
    );
  }

  const handleComplete = async (confidence: Confidence, outcome: Outcome, timeTaken: number) => {
    if (!isAuthenticated) { showToast('Please login first', 'error'); return; }
    try {
      // The API endpoint handles spaced repetition logic
      const response = await apiClient.post(`/api/problems/${problem.id}/submissions`, { outcome, confidence, timeTaken });
      const updatedProblem = response.data;
      
      dispatch({ type: 'UPDATE_PROBLEM', payload: updatedProblem });
      dispatch({ type: 'RECORD_ACTIVITY' });
      showToast(`Progress saved! Review updated.`, 'success');
      navigate(-1);
    } catch (err) {
      showToast('Error saving submission', 'error');
      console.error(err);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="py-12">
      <ReSolveMode 
        problem={problem} 
        onComplete={handleComplete} 
        onCancel={handleCancel} 
      />
    </div>
  );
};
