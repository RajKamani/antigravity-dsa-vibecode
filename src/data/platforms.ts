export const PLATFORMS = [
  { id: 'leetcode', name: 'LeetCode', color: 'text-amber-500' },
  { id: 'gfg', name: 'GeeksforGeeks', color: 'text-emerald-500' },
  { id: 'hello-interview', name: 'HelloInterview', color: 'text-blue-500' },
  { id: 'hackerrank', name: 'HackerRank', color: 'text-green-500' },
  { id: 'other', name: 'Other', color: 'text-slate-500' }
];

export const getPlatformDisplay = (id: string) => {
  return PLATFORMS.find(p => p.id === id) || PLATFORMS[PLATFORMS.length - 1]; // "other"
};
