export type Platform = 'leetcode' | 'gfg' | 'hello-interview' | 'hackerrank' | 'other';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Status = 'learning' | 'practicing' | 'mastered';
export type Confidence = 'low' | 'medium' | 'high';
export type Category = 'dsa' | 'system-design' | 'behavioural' | 'other';
export type Outcome = 'solved' | 'struggled' | 'failed';

export interface Submission {
  id: string;
  date: string;
  interval: number;
  timeTaken: number;
  outcome: Outcome;
}

export interface Problem {
  id: string;
  title: string;
  platform: Platform;
  difficulty: Difficulty;
  topics: string[];
  pattern: string;
  url: string;
  youtubeLinks: string[];
  solutionSummary: string;
  notes: string;
  timeTaken?: number;
  status: Status;
  confidence: Confidence;
  submits: Submission[];
  nextReview: string;
  category: Category;
  createdAt: string;
  // Best Solution Mapping (Feature 5)
  bruteForce?: string;         // Brute force approach description
  optimalApproach?: string;    // Optimal solution approach
  timeComplexity?: string;     // e.g. "O(n)"
  spaceComplexity?: string;    // e.g. "O(1)"
  editorialLink?: string;      // Official or community editorial
}

export interface DesignQuestion {
  id: string;
  title: string;
  tags: string[];
  notes: string;
  status: 'todo' | 'reviewing' | 'done';
  links: string[];
  createdAt: string;
}

export interface MockSession {
  id: string;
  date: string;
  problemsAttempted: number;
  problemsSolved: number;
  problemsSkipped: number;
  duration: number; // in seconds
  problems: string[]; // Problem IDs
}

export interface Streaks {
  current: number;
  best: number;
  lastActiveDate: string | null;
}

export interface Settings {
  theme: 'dark' | 'light';
  dailyGoal: number;
  notificationsEnabled: boolean;
}

export interface AppState {
  problems: Problem[];
  designQuestions: DesignQuestion[];
  mockSessions: MockSession[];
  streaks: Streaks;
  settings: Settings;
}
