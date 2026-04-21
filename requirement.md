# DSA Practice Tracker & Smart Revision System
## Master Build Prompt — v2.0

---

## Objective

Build a **DSA Practice Tracker & Smart Revision App** — a unified, platform-agnostic system that helps engineers track solved problems, schedule intelligent spaced-repetition revision, improve long-term pattern retention, and actively measure interview readiness.

The application must be **scalable**, **extensible**, and designed for **long-term daily habit formation**.

---

## Supported Platforms

### Launch Platforms
- LeetCode
- GeeksforGeeks (GFG)
- HelloInterview
- HackerRank

### Future Platforms (extensible architecture required)
- Codeforces
- AtCoder
- InterviewBit
- Custom / Company-specific problems
- System Design platforms

---

## Core Data Model

Every tracked problem stores the following:

```ts
Problem {
  id:             string
  title:          string
  platform:       "leetcode" | "gfg" | "hello-interview" | "hackerrank" | "other"
  difficulty:     "easy" | "medium" | "hard"
  topics:         string[]           // e.g. ["Arrays", "Sliding Window"]
  pattern:        string             // e.g. "Two Pointer"
  url:            string
  youtubeLinks:   string[]           // Neetcode, Striver, TakeUForward, etc.
  solutionSummary: string            // AI-generated or user-written
  notes:          string
  timeTaken?:     number             // minutes
  status:         "learning" | "practicing" | "mastered"
  confidence:     "low" | "medium" | "high"
  submits:        Submission[]
  nextReview:     Date
  category:       "dsa" | "system-design" | "behavioural" | "other"
}

Submission {
  date:      Date
  interval:  number    // days until next review
  timeTaken: number
  outcome:   "solved" | "struggled" | "failed"
}
```

---

## Feature Specifications

---

### Feature 1 — Problem Capture

**Primary method:** Browser Extension
- Auto-detects submission on supported platforms
- Extracts: problem title, URL, difficulty, topic tags, solution code
- Sends to backend, triggers AI summary generation

**Secondary method:** Platform APIs (where available)

**Fallback:** Manual entry form
- Fields: title, platform, difficulty, topic, pattern, URL, YouTube link, solution summary, notes, time taken

---

### Feature 2 — Spaced Repetition Engine

Default revision schedule:

| Attempt   | Interval  | Status      |
|-----------|-----------|-------------|
| 1st solve | 7 days    | learning    |
| 2nd solve | 14 days   | practicing  |
| 3rd solve | 30 days   | practicing  |
| 4th solve | 60 days   | practicing  |
| 5th solve | 90 days   | mastered    |

**Behavior rules:**
- Successful re-solve → advance to next interval
- Failed re-solve → **reset interval to 7 days**, status back to `learning`
- Confidence tagging after each attempt: `low` / `medium` / `high`
- Problems with `low` confidence are prioritized in Daily Plan regardless of interval

---

### Feature 3 — Smart Dashboard

**Priority order for display:**
1. Overdue (past due date)
2. Due today
3. Due this week
4. Recently solved
5. Mastered (collapsed section)

**Dashboard panels:**
- Stats bar: total tracked, due today, due this week, mastered count
- Streak tracker: current streak + best streak
- Today's revision queue (filterable)
- Weak topic alert banner

---

### Feature 4 — AI Solution Summary

Auto-generated after each submission. Format:

```
Pattern:           Sliding Window
Time complexity:   O(n)
Space complexity:  O(n)

Key insight:
  Use a hashmap to track last seen index.
  Expand right pointer, shrink left on duplicate.

Common mistakes:
  Not updating the left pointer before checking window size.

Similar problems:
  - Minimum Window Substring
  - Longest Repeating Character Replacement
```

---

### Feature 5 — Best Solution Mapping

Each problem links to:
- Best known solution (with pattern label)
- Alternative / brute force approach
- Editorial link (official or community)
- YouTube solutions: Neetcode, Striver, TakeUForward, others

---

### Feature 6 — Re-Solve Mode

Flow:
1. User clicks "Start revision"
2. Solution summary is hidden
3. Problem link opens in new tab
4. Timer starts automatically
5. User submits solution
6. Confidence rating prompted: Struggled / Okay / Nailed it
7. Interval updates accordingly
8. Performance delta shown vs previous attempt

---

### Feature 7 — Pattern-Based Learning Tracker

Supported patterns (extensible list):
- Arrays, Strings, Trees, Graphs
- Dynamic Programming, Backtracking
- Sliding Window, Two Pointers
- Binary Search, Heap / Priority Queue
- BFS, DFS
- System Design (future)

Display:
- Progress bar per pattern (problems solved / target)
- Color coding: red < 40%, amber 40–70%, green > 70%
- Weakest patterns surfaced with "Practice" CTA

---

### Feature 8 — Interview Readiness Score

Composite score (0–100%) calculated from:
- Number of problems solved (weighted by difficulty)
- Revision success rate
- Confidence ratings
- Pattern coverage breadth
- Recent activity (decay factor for inactivity)

Display:
- Score circle with color indicator (red / amber / green)
- Strengths: top 3 topics by score
- Weak areas: bottom 3 topics by score
- Difficulty breakdown bar chart
- CTA: "Get personalized study plan"

---

### Feature 9 — Daily Smart Practice Plan

Auto-generated daily plan:
- 2 Easy warm-up problems
- 2 Medium focus problems (from weakest topics)
- 1 Hard challenge
- All overdue reviews (mandatory)

Logic:
- Prioritizes topics with lowest readiness score
- Avoids repeating a problem solved in the last 24 hours
- Surfaces `low` confidence problems even if not due yet

---

### Feature 10 — Mock Interview Mode

- Timed random problem picker (from user's own solved list)
- Timer: start / pause / reset
- Session history: time per problem, solved / skipped count
- 45-minute blitz mode: auto-queues overdue Medium-first problems
- "Get hint" button triggers AI explanation

---

### Feature 11 — System Design Tracker

Each entry stores:
```ts
DesignQuestion {
  title:    string          // "Design URL Shortener"
  tags:     string[]        // ["Hashing", "Database", "Scaling"]
  notes:    string          // Architecture decisions, trade-offs
  status:   "todo" | "reviewing" | "done"
  links:    string[]        // Reference articles, YouTube
}
```

Example questions:
- URL Shortener
- Rate Limiter
- Notification System
- Distributed Cache
- Search Autocomplete

---

### Feature 12 — Weakness Heatmap Drill-Down

- Visual topic grid colored by readiness score
- Click any topic → auto-filters problem list + surfaces top 3 suggested next problems
- Color scale: red (< 40%), amber (40–70%), green (> 70%)

---

### Feature 13 — Pattern Flashcard Mode

- 60-second flashcard per pattern
- Card contains: definition, when to use it, code template snippet, 3 example problems
- Swipe-style review (mobile-friendly)
- Progress tracked per pattern

---

### Feature 14 — Peer Benchmark (Opt-in, Anonymous)

- Compare topic coverage and readiness score vs anonymized users at similar stage
- Example display: "You're ahead of 62% of users on Arrays. You're behind 71% on DP."
- No personal data shared; aggregate percentile only

---

### Feature 15 — Notifications

Channels:
- Browser push notification
- Email digest (daily / weekly)
- Mobile push (future)

Example:
```
You have 4 problems due today:
- Binary Tree Level Order (Trees)
- Coin Change (DP)
- Two Sum (Arrays)
- Detect Cycle in Graph (Graphs)
```

---

## Suggested Architecture

### Frontend
- Framework: React / Next.js
- Styling: Tailwind CSS
- State: Zustand or Redux Toolkit
- Charts: Recharts or Chart.js

### Backend
- Runtime: Node.js / FastAPI
- API: REST or GraphQL
- Auth: JWT / OAuth (Google login)

### Database Schema

**Problems table**
```
id, title, platform, difficulty, topics, pattern,
url, youtube_links, solution_summary, notes,
status, confidence, category, created_at
```

**Submissions table**
```
id, problem_id, date, interval, time_taken, outcome
```

**Reminders table**
```
id, problem_id, next_revision_date, interval_days, attempt_count
```

**Sessions table** (mock interview)
```
id, user_id, date, problems_attempted, problems_solved, duration
```

### Browser Extension
- Detects successful submission on supported platforms
- Extracts: problem title, URL, difficulty, topic tags
- Posts to backend API
- Triggers AI summary generation pipeline

---

## AI Features

| Feature                  | Trigger              | Output                                    |
|--------------------------|----------------------|-------------------------------------------|
| Solution summary         | After submission     | Pattern, complexity, key insight, mistakes|
| Similar problems         | On problem view      | 3 related problems by pattern             |
| Pattern detection        | On manual entry      | Auto-suggests pattern tag                 |
| Flashcard generation     | On demand            | Definition + template + examples          |
| Personalized study plan  | On demand / weekly   | Prioritized problem list by weakness      |
| Interview Q&A coach      | On demand            | Guided problem walkthrough                |

---

## MVP Scope (Ship First)

Must-have for v1:
- Manual problem entry (full form)
- Spaced repetition engine with reset-on-fail
- Dashboard with due queue and stats
- Pattern progress bars
- Readiness score
- Mock interview timer
- System design tracker (basic)
- Multi-platform support (data model only, manual entry)

---

## Future Roadmap

| Phase | Feature                              |
|-------|--------------------------------------|
| v1.1  | Browser extension (LeetCode first)   |
| v1.2  | AI solution summary (Anthropic API)  |
| v1.3  | Email / push notifications           |
| v2.0  | Pattern flashcard mode               |
| v2.1  | Peer benchmark (anonymous)           |
| v2.2  | Mobile app (React Native)            |
| v3.0  | AI interview coach (voice mode)      |
| v3.1  | Competitive tracking (Codeforces)    |

---

## Example User Flow

```
1. Solve "Two Sum" on LeetCode
2. Browser extension detects submission
3. Problem auto-saved with tags, difficulty, URL
4. AI generates solution summary (pattern, complexity, insight)
5. Spaced repetition schedules first review: +7 days
6. Day 7: browser notification fires
7. User opens Re-Solve Mode, hides solution, opens problem tab
8. User solves it — marks "Nailed it" (high confidence)
9. Interval doubles to 14 days, status → "practicing"
10. Day 7+14: second review. User struggles → marks "Struggled"
11. Confidence set to "low" — interval reset to 7 days
12. Readiness score and pattern heatmap update in real time
```

---

## End Goal

A **Smart Learning System** that improves:
- Memory retention through spaced repetition
- Pattern recognition across problem types
- Interview readiness with measurable scoring
- Consistency through streaks, plans, and daily queues
- Coverage across DSA, System Design, and Behavioural prep

> Build for scalability, extensibility, and long-term learning efficiency.
> Every feature should reinforce the habit loop: solve → review → improve → repeat.



Gemini Suggestion -

Create a 'Weakness Heatmap' visualization for the DSA Practice Tracker. This should be a grid or chart where each cell represents a DSA topic (e.g., Arrays, DP, Graphs). The color of each cell should indicate the user's proficiency in that topic, based on their problem-solving success rate, confidence levels, and revision history. The visualization should allow users to easily identify their weakest areas and click on a topic to get personalized problem recommendations.

Implement an AI feature that dynamically adjusts the perceived difficulty of problems for the user. Based on their submission history, confidence ratings, and time taken, suggest if a problem was too easy, too hard, or just right. If too hard, suggest a similar, easier problem or a prerequisite topic. If too easy, suggest a harder variation or a related, more complex problem.