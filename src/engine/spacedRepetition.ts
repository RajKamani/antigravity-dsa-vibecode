import { Problem, Submission, Outcome, Confidence } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Default revision schedule (in days)
const INTERVALS = [7, 14, 30, 60, 90]; 

export const getNextInterval = (attemptNumber: number): number => {
  if (attemptNumber < 1) return INTERVALS[0];
  if (attemptNumber > INTERVALS.length) return INTERVALS[INTERVALS.length - 1];
  return INTERVALS[attemptNumber - 1]; // attempt 1 -> index 0 (7 days)
};

export const processSubmission = (
  problem: Problem, 
  outcome: Outcome, 
  confidence: Confidence, 
  timeTaken: number
): Problem => {
  const isFail = outcome === 'failed' || outcome === 'struggled'; // In requirements: Failed re-solve -> reset interval to 7 days
  
  // If it's a fail, interval is reset to first interval (7). If solved, interval goes to next.
  
  // Try to determine which attempt we are effectively on based on intervals
  // But a simpler approach is: count consecutive solved.
  let consecutiveSolved = 0;
  for (let i = problem.submits.length - 1; i >= 0; i--) {
    if (problem.submits[i].outcome === 'solved') consecutiveSolved++;
    else break;
  }
  
  let nextAttemptNumber = isFail ? 1 : consecutiveSolved + 2; // +1 for this solve, +1 for next lookup
  
  const nextInterval = isFail ? 7 : getNextInterval(nextAttemptNumber);
  
  const now = new Date();
  const nextReviewDate = new Date(now);
  nextReviewDate.setDate(now.getDate() + nextInterval);
  
  const newSubmission: Submission = {
    id: uuidv4(),
    date: now.toISOString(),
    interval: nextInterval,
    timeTaken,
    outcome
  };
  
  let nextStatus: Problem['status'] = problem.status;
  if (isFail) {
    nextStatus = 'learning';
  } else {
    // 5th solve is interval index 4 (90 days). If next attempt would be > 5, it's mastered.
    if (nextAttemptNumber > 5) {
      nextStatus = 'mastered';
    } else {
      nextStatus = 'practicing';
    }
  }

  return {
    ...problem,
    status: Math.max(consecutiveSolved, isFail ? 0 : 1) === 0 ? 'learning' : nextStatus,
    confidence, // User explicit rating overrides logic for confidence
    submits: [...problem.submits, newSubmission],
    nextReview: nextReviewDate.toISOString()
  };
};

export const isOverdue = (problem: Problem, currentDate = new Date()): boolean => {
  return new Date(problem.nextReview) < currentDate;
};

export const getDueProblems = (problems: Problem[], date = new Date()): Problem[] => {
  // Normalize current date to end of today to include everything due today
  const endOfToday = new Date(date);
  endOfToday.setHours(23, 59, 59, 999);
  
  return problems.filter(p => new Date(p.nextReview) <= endOfToday && p.status !== 'mastered');
};

export const getDueThisWeek = (problems: Problem[], date = new Date()): Problem[] => {
  const endOfWeek = new Date(date);
  endOfWeek.setDate(endOfWeek.getDate() + 7);
  endOfWeek.setHours(23, 59, 59, 999);
  
  const startOfTomorrow = new Date(date);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
  startOfTomorrow.setHours(0, 0, 0, 0);

  return problems.filter(p => {
    const reviewDate = new Date(p.nextReview);
    return reviewDate >= startOfTomorrow && reviewDate <= endOfWeek && p.status !== 'mastered';
  });
};
