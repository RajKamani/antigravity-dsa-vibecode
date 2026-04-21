import { Problem } from '../types';
import { PATTERNS } from '../data/patterns';

const DIFFICULTY_WEIGHTS = {
  easy: 1,
  medium: 2,
  hard: 3,
};

export const calculateReadinessScore = (problems: Problem[]): number => {
  if (problems.length === 0) return 0;

  // 1. Problem solved score (Difficulty weighted coverage)
  const totalWeight = problems.reduce((acc, p) => acc + DIFFICULTY_WEIGHTS[p.difficulty], 0);
  const targetWeight = 100 * DIFFICULTY_WEIGHTS.medium; // Arbitrary target: e.g. 100 mediums worth
  const coverageScore = Math.min(100, (totalWeight / targetWeight) * 100);

  // 2. Revision success rate & Confidence
  let successPoints = 0;
  let totalSubmits = 0;
  let highConfidencePoints = 0;
  
  problems.forEach(p => {
    p.submits.forEach(sub => {
      totalSubmits++;
      if (sub.outcome === 'solved') successPoints++;
    });
    if (p.confidence === 'high') highConfidencePoints += 2;
    if (p.confidence === 'medium') highConfidencePoints += 1;
  });

  const rawSuccessRate = totalSubmits > 0 ? (successPoints / totalSubmits) * 100 : 0;
  
  // Confidence score: max is 2 points per problem
  const maxConfidencePoints = problems.length * 2;
  const confidenceScore = maxConfidencePoints > 0 ? (highConfidencePoints / maxConfidencePoints) * 100 : 0;

  // 3. Pattern coverage
  const coveredPatterns = new Set(problems.map(p => p.pattern)).size;
  const patternCoverage = Math.min(100, (coveredPatterns / PATTERNS.length) * 100);

  // 4. Activity Decay
  // 1% penalty for every day of inactivity over 7 days, max 20% penalty
  let decayFactor = 1;
  if (problems.length > 0) {
    const lastActive = new Date(Math.max(...problems.map(p => 
      p.submits.length > 0 ? new Date(p.submits[p.submits.length - 1].date).getTime() : new Date(p.createdAt).getTime()
    )));
    const daysSinceActive = (new Date().getTime() - lastActive.getTime()) / (1000 * 3600 * 24);
    if (daysSinceActive > 7) {
      const penalty = Math.min(0.2, (daysSinceActive - 7) * 0.01);
      decayFactor = 1 - penalty;
    }
  }

  // Composite calculation
  // Weights: Coverage (30%), Success Rate (30%), Confidence (20%), Pattern Coverage (20%)
  const compositeScore = (
    (coverageScore * 0.3) + 
    (rawSuccessRate * 0.3) + 
    (confidenceScore * 0.2) + 
    (patternCoverage * 0.2)
  ) * decayFactor;

  return Math.round(Math.max(0, Math.min(100, compositeScore)));
};

export const getTopicScores = (problems: Problem[]): Record<string, number> => {
  const scores: Record<string, number> = {};
  
  PATTERNS.forEach(pattern => {
    const patternProblems = problems.filter(p => p.pattern === pattern.id);
    if (patternProblems.length === 0) {
      scores[pattern.id] = 0;
    } else {
      // Calculate mini-readiness for just this topic
      let highConf = 0;
      let totalRevs = 0;
      let wins = 0;
      patternProblems.forEach(p => {
        if (p.confidence === 'high') highConf += 2;
        if (p.confidence === 'medium') highConf += 1;
        p.submits.forEach(s => {
          totalRevs++;
          if (s.outcome === 'solved') wins++;
        });
      });
      const confRatio = (highConf / (patternProblems.length * 2)) * 50;
      const winRatio = totalRevs > 0 ? (wins / totalRevs) * 50 : 0;
      scores[pattern.id] = Math.round(confRatio + winRatio);
    }
  });

  return scores;
};

export const getStrengthsAndWeaknesses = (problems: Problem[]) => {
  const scores = getTopicScores(problems);
  const sorted = Object.entries(scores)
    .filter(([_, score]) => score > 0) // only include attempted topics
    .sort((a, b) => b[1] - a[1]);

  return {
    strengths: sorted.slice(0, 3).map(s => ({ topic: s[0], score: s[1] })),
    weaknesses: sorted.slice(-3).reverse().map(s => ({ topic: s[0], score: s[1] }))
  };
};
