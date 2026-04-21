import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ReSolveMode } from '../components/revision/ReSolveMode';
import { processSubmission } from '../engine/spacedRepetition';
import { Confidence, Outcome } from '../types';
import { showToast } from '../components/common/Toast';

export const ReSolvePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  
  const problem = state.problems.find((p: any) => p.id === id);

  if (!problem) {
    return (
      <div className="p-8 text-center text-slate-400">Problem not found.</div>
    );
  }

  const handleComplete = (confidence: Confidence, outcome: Outcome, timeTaken: number) => {
    const updatedProblem = processSubmission(problem, outcome, confidence, timeTaken);
    dispatch({ type: 'UPDATE_PROBLEM', payload: updatedProblem });
    dispatch({ type: 'RECORD_ACTIVITY' });
    showToast(`Progress saved! Review updated.`, 'success');
    navigate(-1);
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
