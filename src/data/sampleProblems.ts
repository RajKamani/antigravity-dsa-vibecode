import { Problem } from '../types';
import { v4 as uuidv4 } from 'uuid';

const now = new Date();
const yesterday = new Date(now);
yesterday.setDate(now.getDate() - 1);

const pastWeekDate = new Date(now);
pastWeekDate.setDate(now.getDate() - 8);

const nextWeekDate = new Date(now);
nextWeekDate.setDate(now.getDate() + 7);

export const SAMPLE_PROBLEMS: Problem[] = [
  {
    id: uuidv4(),
    title: 'Two Sum',
    platform: 'leetcode',
    difficulty: 'easy',
    topics: ['Arrays', 'Hash Map'],
    pattern: 'arrays',
    url: 'https://leetcode.com/problems/two-sum',
    youtubeLinks: ['https://youtu.be/KLlXCFG5TnA'],
    solutionSummary: 'Use a hashmap to store the complement of the current element. O(n) time, O(n) space.',
    notes: 'Classic warmup.',
    timeTaken: 10,
    status: 'mastered',
    confidence: 'high',
    submits: [
      { id: uuidv4(), date: pastWeekDate.toISOString(), interval: 7, timeTaken: 15, outcome: 'solved' },
      { id: uuidv4(), date: yesterday.toISOString(), interval: 14, timeTaken: 8, outcome: 'solved' }
    ],
    nextReview: nextWeekDate.toISOString(),
    category: 'dsa',
    createdAt: pastWeekDate.toISOString()
  },
  {
    id: uuidv4(),
    title: 'LRU Cache',
    platform: 'leetcode',
    difficulty: 'medium',
    topics: ['Hash Map', 'Doubly Linked List'],
    pattern: 'linked-list',
    url: 'https://leetcode.com/problems/lru-cache',
    youtubeLinks: ['https://youtu.be/7ABFKPK2hD4'],
    solutionSummary: 'Combine Hash Map for O(1) fetch and Doubly Linked List for O(1) evict.',
    notes: 'Must not forget to manage both head/tail dummy nodes.',
    timeTaken: 45,
    status: 'learning',
    confidence: 'low',
    submits: [
      { id: uuidv4(), date: pastWeekDate.toISOString(), interval: 7, timeTaken: 45, outcome: 'struggled' }
    ],
    nextReview: yesterday.toISOString(), // OVERDUE!
    category: 'dsa',
    createdAt: pastWeekDate.toISOString()
  },
  {
    id: uuidv4(),
    title: 'Merge K Sorted Lists',
    platform: 'leetcode',
    difficulty: 'hard',
    topics: ['Linked List', 'Divide and Conquer', 'Heap'],
    pattern: 'heap-pq',
    url: 'https://leetcode.com/problems/merge-k-sorted-lists',
    youtubeLinks: ['https://youtu.be/q5a5OiGbT6Q'],
    solutionSummary: 'Use a min-heap to keep track of the smallest node amongst the K heads.',
    notes: 'Alternative is divide and conquer merging two lists at a time.',
    timeTaken: 50,
    status: 'practicing',
    confidence: 'medium',
    submits: [
      { id: uuidv4(), date: now.toISOString(), interval: 7, timeTaken: 50, outcome: 'solved' }
    ],
    nextReview: nextWeekDate.toISOString(),
    category: 'dsa',
    createdAt: now.toISOString()
  }
];
