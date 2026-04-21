import { Problem } from '../types';
import { getDueProblems } from './spacedRepetition';
import { getTopicScores } from './readinessScore';

export interface DailyPlanResult {
  mandatory: Problem[];
  warmUps: Problem[];
  focus: Problem[];
  challenge: Problem[];
}

export const generateDailyPlan = (problems: Problem[]): DailyPlanResult => {
  const now = new Date();
  const past24hBoundary = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // 1. Mandatory Overdue
  const mandatory = getDueProblems(problems, now);
  const mandatoryIds = new Set(mandatory.map(p => p.id));

  // 2. Identify weak topics
  const scores = getTopicScores(problems);
  // Exclude problems solved recently or already in mandatory
  // Actually, we want to include problems that MIGHT not be due yet but we need them for practice.
  // We'll exclude ones solved in the last 24h.
  const pool = problems.filter(p => {
    if (mandatoryIds.has(p.id)) return false;
    
    // Check if solved in last 24h
    if (p.submits.length > 0) {
      const lastSubmit = new Date(p.submits[p.submits.length - 1].date);
      if (lastSubmit > past24hBoundary) return false;
    }
    return true;
  });

  const getFromPool = (count: number, condition: (p: Problem) => boolean): Problem[] => {
    const matches = pool.filter(condition).sort((a, b) => {
      // Prioritize weak topics
      const scoreA = scores[a.pattern] ?? 100;
      const scoreB = scores[b.pattern] ?? 100;
      if (scoreA !== scoreB) return scoreA - scoreB;
      
      // Secondary: Prioritize low confidence
      const confMap = { low: 1, medium: 2, high: 3 };
      return confMap[a.confidence] - confMap[b.confidence];
    });
    
    const selected = matches.slice(0, count);
    selected.forEach(s => {
      const idx = pool.findIndex(p => p.id === s.id);
      if (idx !== -1) pool.splice(idx, 1);
    });
    return selected;
  };

  const warmUps = getFromPool(2, p => p.difficulty === 'easy');
  const focus = getFromPool(2, p => p.difficulty === 'medium');
  const challenge = getFromPool(1, p => p.difficulty === 'hard');

  return {
    mandatory,
    warmUps,
    focus,
    challenge
  };
};
