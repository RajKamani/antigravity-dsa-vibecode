export const PATTERNS = [
  { id: 'arrays', name: 'Arrays & Hashing', description: 'Basic array manipulation and hash maps' },
  { id: 'two-pointers', name: 'Two Pointers', description: 'Two pointers moving together' },
  { id: 'sliding-window', name: 'Sliding Window', description: 'Dynamically resizing window' },
  { id: 'stack', name: 'Stack', description: 'LIFO data structures' },
  { id: 'binary-search', name: 'Binary Search', description: 'O(log n) search on sorted data' },
  { id: 'linked-list', name: 'Linked List', description: 'Node-based sequences' },
  { id: 'trees', name: 'Trees', description: 'Binary trees and BSTs' },
  { id: 'tries', name: 'Tries', description: 'Prefix trees for strings' },
  { id: 'heap-pq', name: 'Heap / Priority Queue', description: 'Min/Max heaps' },
  { id: 'backtracking', name: 'Backtracking', description: 'DFS combination generation' },
  { id: 'graphs', name: 'Graphs', description: 'BFS, DFS, Union Find' },
  { id: 'dp-1d', name: '1D Dynamic Programming', description: 'Memoization and tabulation' },
  { id: 'dp-2d', name: '2D Dynamic Programming', description: '2D grid or two-string DP' },
  { id: 'greedy', name: 'Greedy', description: 'Locally optimal choices' },
  { id: 'intervals', name: 'Intervals', description: 'Overlapping intervals' },
  { id: 'math-geometry', name: 'Math & Geometry', description: 'Number theory and geometry' },
  { id: 'bit-manipulation', name: 'Bit Manipulation', description: 'Bitwise operators' }
];

export const getPatternName = (id: string): string => {
  return PATTERNS.find(p => p.id === id)?.name || id;
};
