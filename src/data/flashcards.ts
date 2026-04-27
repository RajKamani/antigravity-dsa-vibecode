export interface Flashcard {
  id: string;
  name: string;
  definition: string;
  whenToUse: string[];
  codeTemplate: string;
  examples: string[];
}

export const FLASHCARDS: Flashcard[] = [
  {
    id: 'arrays',
    name: 'Arrays & Hashing',
    definition: 'Using arrays to store data and hash maps for O(1) lookups.',
    whenToUse: [
      'Frequency counting',
      'Mapping values to indices',
      'Checking for duplicates'
    ],
    codeTemplate: 'count = {}\nfor n in nums:\n    count[n] = 1 + count.get(n, 0)',
    examples: ['Two Sum', 'Contains Duplicate', 'Valid Anagram']
  },
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    definition: 'Using two pointers to iterate through data, often from both ends or at different speeds.',
    whenToUse: [
      'Sorted arrays',
      'Finding pairs with a sum',
      'Reversing strings/arrays'
    ],
    codeTemplate: 'l, r = 0, len(nums) - 1\nwhile l < r:\n    curr_sum = nums[l] + nums[r]\n    if curr_sum == target: return [l, r]\n    if curr_sum < target: l += 1\n    else: r -= 1',
    examples: ['Valid Palindrome', 'Two Sum II', '3Sum']
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    definition: 'A window that slides over a sequence to find a sub-segment meeting certain criteria.',
    whenToUse: [
      'Contiguous subarrays/substrings',
      'Finding min/max length with a property',
      'Fixed or dynamic size windows'
    ],
    codeTemplate: 'l, res = 0, 0\nfor r in range(len(s)):\n    # update state with s[r]\n    while condition_not_met:\n        # remove s[l] from state, l += 1\n    res = max(res, r - l + 1)',
    examples: ['Longest Substring Without Repeating Characters', 'Minimum Size Subarray Sum']
  },
  {
    id: 'stack',
    name: 'Stack',
    definition: 'LIFO (Last-In-First-Out) data structure used to track nested or hierarchical relationships.',
    whenToUse: [
      'Parentheses matching',
      'Monotonic stack for next greater element',
      'Undo operations / recursion simulation'
    ],
    codeTemplate: 'stack = []\nfor char in s:\n    if char in close_to_open:\n        if stack and stack[-1] == close_to_open[char]:\n            stack.pop()\n        else: return False\n    else: stack.append(char)',
    examples: ['Valid Parentheses', 'Min Stack', 'Daily Temperatures']
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    definition: 'Divide and conquer algorithm for searching sorted data in O(log n) time.',
    whenToUse: [
      'Sorted arrays',
      'Searching for a value in a range',
      'Optimization problems (binary search on answer)'
    ],
    codeTemplate: 'l, r = 0, len(nums) - 1\nwhile l <= r:\n    m = l + ((r - l) // 2)\n    if nums[m] == target: return m\n    if nums[m] < target: l = m + 1\n    else: r = m - 1',
    examples: ['Binary Search', 'Search a 2D Matrix', 'Koko Eating Bananas']
  },
  {
    id: 'linked-list',
    name: 'Linked List',
    definition: 'Linear data structure where elements are not stored contiguously, but connected via pointers.',
    whenToUse: [
      'Dynamic size requirements',
      'Fast insertions/deletions at ends',
      'Cycle detection (Floyd\'s algorithm)'
    ],
    codeTemplate: 'prev, curr = None, head\nwhile curr:\n    nxt = curr.next\n    curr.next = prev\n    prev = curr\n    curr = nxt\nreturn prev',
    examples: ['Reverse Linked List', 'Merge Two Sorted Lists', 'Linked List Cycle']
  },
  {
    id: 'trees',
    name: 'Trees',
    definition: 'Hierarchical structure where nodes have children (usually Binary Trees).',
    whenToUse: [
      'Hierarchical data',
      'Fast search (BST)',
      'Recursive traversals (DFS/BFS)'
    ],
    codeTemplate: 'def dfs(node):\n    if not node: return\n    dfs(node.left)\n    # process node\n    dfs(node.right)',
    examples: ['Maximum Depth of Binary Tree', 'Invert Binary Tree', 'Lowest Common Ancestor']
  },
  {
    id: 'tries',
    name: 'Tries',
    definition: 'Prefix tree used for efficient string storage and retrieval.',
    whenToUse: [
      'Prefix matching',
      'Autocomplete',
      'Spell checking'
    ],
    codeTemplate: 'class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.end = False',
    examples: ['Implement Trie', 'Design Add and Search Words Data Structure']
  },
  {
    id: 'heap-pq',
    name: 'Heap / Priority Queue',
    definition: 'Tree-based data structure that satisfies the heap property (Min or Max).',
    whenToUse: [
      'Finding top K elements',
      'Merging sorted lists',
      'Scheduling tasks'
    ],
    codeTemplate: 'import heapq\nheap = []\nheapq.heappush(heap, val)\nheapq.heappop(heap)',
    examples: ['Kth Largest Element in an Array', 'Top K Frequent Elements']
  },
  {
    id: 'backtracking',
    name: 'Backtracking',
    definition: 'Algorithmic technique that considers all possible solutions and discards those that fail criteria.',
    whenToUse: [
      'Combinations',
      'Permutations',
      'Subset problems'
    ],
    codeTemplate: 'def backtrack(i, path):\n    if condition: \n        res.append(path[:])\n        return\n    for j in range(i, len(nums)):\n        path.append(nums[j])\n        backtrack(j + 1, path)\n        path.pop()',
    examples: ['Subsets', 'Combination Sum', 'Permutations']
  },
  {
    id: 'graphs',
    name: 'Graphs',
    definition: 'Set of nodes (vertices) connected by edges.',
    whenToUse: [
      'Connectivity problems',
      'Shortest path (BFS/Dijkstra)',
      'Cycle detection (Union Find/DFS)'
    ],
    codeTemplate: 'q = collections.deque([start])\nvisited = {start}\nwhile q:\n    node = q.popleft()\n    for neighbor in adj[node]:\n        if neighbor not in visited:\n            visited.add(neighbor)\n            q.append(neighbor)',
    examples: ['Number of Islands', 'Clone Graph', 'Course Schedule']
  },
  {
    id: 'dp-1d',
    name: '1D Dynamic Programming',
    definition: 'Breaking down problems into simpler subproblems and storing results (memoization/tabulation).',
    whenToUse: [
      'Overlapping subproblems',
      'Optimal substructure',
      'Counting paths or min/max values'
    ],
    codeTemplate: 'dp = [0] * (n + 1)\ndp[0], dp[1] = 1, 1\nfor i in range(2, n + 1):\n    dp[i] = dp[i-1] + dp[i-2]',
    examples: ['Climbing Stairs', 'House Robber', 'Coin Change']
  },
  {
    id: 'dp-2d',
    name: '2D Dynamic Programming',
    definition: 'DP on grids or involving two different input sequences.',
    whenToUse: [
      'Grid traversal (unique paths)',
      'String matching (Edit Distance, LCS)',
      'Knapsack variants'
    ],
    codeTemplate: 'dp = [[0] * n for _ in range(m)]\nfor i in range(m):\n    for j in range(n):\n        dp[i][j] = dp[i-1][j] + dp[i][j-1]',
    examples: ['Unique Paths', 'Longest Common Subsequence', 'Best Time to Buy and Sell Stock with Cooldown']
  },
  {
    id: 'greedy',
    name: 'Greedy',
    definition: 'Making the locally optimal choice at each step with the hope of finding a global optimum.',
    whenToUse: [
      'Optimization problems where local choice suffices',
      'Interval scheduling',
      'Huffman coding'
    ],
    codeTemplate: 'nums.sort()\nres = 0\nfor n in nums:\n    # local optimal choice',
    examples: ['Maximum Subarray (Kadane\'s)', 'Jump Game', 'Gas Station']
  },
  {
    id: 'intervals',
    name: 'Intervals',
    definition: 'Problems involving overlapping or non-overlapping ranges.',
    whenToUse: [
      'Merging intervals',
      'Finding intersections',
      'Scheduling'
    ],
    codeTemplate: 'intervals.sort(key=lambda x: x[0])\nres = [intervals[0]]\nfor start, end in intervals[1:]:\n    if start <= res[-1][1]:\n        res[-1][1] = max(res[-1][1], end)\n    else:\n        res.append([start, end])',
    examples: ['Merge Intervals', 'Insert Interval', 'Non-overlapping Intervals']
  },
  {
    id: 'math-geometry',
    name: 'Math & Geometry',
    definition: 'Using mathematical properties or geometric algorithms.',
    whenToUse: [
      'Number theory (primes, GCD)',
      'Matrix manipulation',
      'Coordinate geometry'
    ],
    codeTemplate: 'def gcd(a, b):\n    return a if b == 0 else gcd(b, a % b)',
    examples: ['Rotate Image', 'Spiral Matrix', 'Happy Number']
  },
  {
    id: 'bit-manipulation',
    name: 'Bit Manipulation',
    definition: 'Operating directly on the binary representations of numbers.',
    whenToUse: [
      'Power of two checks',
      'Counting set bits',
      'Finding the unique element in a pair-filled array'
    ],
    codeTemplate: 'count = 0\nwhile n:\n    n &= (n - 1)\n    count += 1\nreturn count',
    examples: ['Single Number', 'Number of 1 Bits', 'Reverse Bits']
  }
];
