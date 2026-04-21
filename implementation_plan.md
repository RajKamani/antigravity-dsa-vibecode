# DSA Practice Tracker & Smart Revision System — Implementation Plan

## Overview

Build an MVP of the DSA Practice Tracker — a client-side single-page application with rich UI, spaced repetition engine, readiness scoring, mock interview timer, and system design tracker. All data persists in `localStorage` with JSON import/export for portability.

---

## User Review Required

> [!NOTE]
> **Styling: TailwindCSS** — Per user preference, using TailwindCSS for styling.

> [!IMPORTANT]
> **No Backend for MVP**
> The MVP will be a **fully client-side React app** using `localStorage` for persistence. No server, no database, no auth. This lets us ship fast and iterate. A backend (Node.js/FastAPI) can be added in v1.1+ when we need sync, notifications, or multi-device support.

> [!IMPORTANT]
> **AI Features Deferred**
> AI solution summary, pattern detection, and study plan generation require an LLM API integration. These are deferred to post-MVP. The UI placeholders will be built so they can be wired up later.

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Language** | TypeScript | Type safety, better DX, fewer runtime bugs |
| **Framework** | React 19 + Vite | Fast dev server, modern tooling, HMR |
| **Routing** | React Router v7 | Client-side SPA routing |
| **State** | React Context + useReducer | Lightweight, no extra deps for MVP |
| **Styling** | TailwindCSS v4 | Utility-first, rapid UI development |
| **Charts** | Chart.js + react-chartjs-2 | Doughnut, bar, radar charts for scores |
| **Icons** | Lucide React | Clean, consistent icon set |
| **IDs** | uuid | Unique problem/submission IDs |
| **Storage** | localStorage | Zero-infra MVP persistence |
| **Pkg Manager** | Yarn | Per user preference |
| **Font** | Inter (Google Fonts) | Modern, clean typography |

---

## Project Structure

```
DSA Tracker/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── tailwind.config.ts
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx                    # Entry point
│   ├── App.tsx                     # Root component + routing
│   ├── index.css                   # Global styles + design tokens
│   │
│   ├── context/
│   │   └── AppContext.tsx          # Global state (problems, settings)
│   │
│   ├── engine/
│   │   ├── spacedRepetition.ts     # Spaced repetition logic
│   │   ├── readinessScore.ts       # Interview readiness calculator
│   │   ├── dailyPlan.ts            # Smart daily plan generator
│   │   └── storage.ts              # localStorage read/write/export
│   │
│   ├── data/
│   │   ├── patterns.ts             # DSA pattern definitions
│   │   ├── platforms.ts            # Platform configs
│   │   └── sampleProblems.ts       # ~15 seed problems for demo
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   │   ├── Header.tsx          # Top bar with search + streak
│   │   │   └── Layout.tsx          # Main layout wrapper
│   │   │
│   │   ├── dashboard/
│   │   │   ├── StatsBar.tsx        # Total, due today, due week, mastered
│   │   │   ├── StreakTracker.tsx    # Current + best streak display
│   │   │   ├── RevisionQueue.tsx   # Today's due problems list
│   │   │   ├── WeakTopicBanner.tsx # Alert for weak topics
│   │   │   └── RecentActivity.tsx  # Recently solved problems
│   │   │
│   │   ├── problems/
│   │   │   ├── ProblemForm.tsx     # Add/Edit problem form
│   │   │   ├── ProblemCard.tsx     # Problem list item card
│   │   │   ├── ProblemList.tsx     # Filterable problem list
│   │   │   ├── ProblemDetail.tsx   # Full problem detail view
│   │   │   └── FilterBar.tsx      # Filter by platform, difficulty, topic
│   │   │
│   │   ├── revision/
│   │   │   ├── ReSolveMode.tsx     # Re-solve flow with timer
│   │   │   └── ConfidenceRating.tsx # Post-solve confidence prompt
│   │   │
│   │   ├── patterns/
│   │   │   ├── PatternGrid.tsx     # Pattern progress grid
│   │   │   ├── PatternBar.tsx      # Individual pattern progress bar
│   │   │   └── WeaknessHeatmap.tsx # Topic heatmap visualization
│   │   │
│   │   ├── readiness/
│   │   │   ├── ReadinessScore.tsx  # Score circle + breakdown
│   │   │   ├── StrengthWeakness.tsx # Top/bottom topics
│   │   │   └── DifficultyChart.tsx # Difficulty breakdown bar chart
│   │   │
│   │   ├── mock/
│   │   │   ├── MockInterview.tsx   # Mock interview controller
│   │   │   ├── Timer.tsx           # Start/pause/reset timer
│   │   │   └── SessionHistory.tsx  # Past mock sessions
│   │   │
│   │   ├── systemdesign/
│   │   │   ├── DesignList.tsx      # System design question list
│   │   │   └── DesignForm.tsx      # Add/edit design question
│   │   │
│   │   ├── dailyplan/
│   │   │   └── DailyPlan.tsx       # Auto-generated daily plan
│   │   │
│   │   └── common/
│   │       ├── Modal.tsx           # Reusable modal
│   │       ├── Badge.tsx           # Status/difficulty badges
│   │       ├── ProgressBar.tsx     # Animated progress bar
│   │       ├── EmptyState.tsx      # Empty state illustrations
│   │       └── Toast.tsx           # Toast notifications
│   │
│   └── pages/
│       ├── DashboardPage.tsx
│       ├── ProblemsPage.tsx
│       ├── AddProblemPage.tsx
│       ├── ProblemDetailPage.tsx
│       ├── PatternsPage.tsx
│       ├── ReadinessPage.tsx
│       ├── MockInterviewPage.tsx
│       ├── SystemDesignPage.tsx
│       └── DailyPlanPage.tsx
```

---

## Data Model (localStorage)

```js
// Stored as JSON in localStorage under key "dsa-tracker-data"
{
  problems: [
    {
      id: "uuid-v4",
      title: "Two Sum",
      platform: "leetcode",           // "leetcode" | "gfg" | "hello-interview" | "hackerrank" | "other"
      difficulty: "easy",             // "easy" | "medium" | "hard"
      topics: ["Arrays", "Hash Map"],
      pattern: "Hash Map",
      url: "https://leetcode.com/problems/two-sum",
      youtubeLinks: ["https://youtube.com/..."],
      solutionSummary: "Use a hashmap to store complement...",
      notes: "Watch out for duplicate indices",
      timeTaken: 15,                  // minutes
      status: "learning",            // "learning" | "practicing" | "mastered"
      confidence: "medium",          // "low" | "medium" | "high"
      category: "dsa",              // "dsa" | "system-design" | "behavioural" | "other"
      submits: [
        {
          id: "uuid-v4",
          date: "2026-04-21T00:00:00Z",
          interval: 7,
          timeTaken: 15,
          outcome: "solved"          // "solved" | "struggled" | "failed"
        }
      ],
      nextReview: "2026-04-28T00:00:00Z",
      createdAt: "2026-04-21T00:00:00Z"
    }
  ],

  designQuestions: [
    {
      id: "uuid-v4",
      title: "Design URL Shortener",
      tags: ["Hashing", "Database", "Scaling"],
      notes: "Use base62 encoding...",
      status: "todo",                // "todo" | "reviewing" | "done"
      links: ["https://..."],
      createdAt: "2026-04-21T00:00:00Z"
    }
  ],

  mockSessions: [
    {
      id: "uuid-v4",
      date: "2026-04-21T00:00:00Z",
      problemsAttempted: 5,
      problemsSolved: 4,
      problemsSkipped: 1,
      duration: 2700,               // seconds
      problems: ["problem-id-1", "problem-id-2"]
    }
  ],

  streaks: {
    current: 5,
    best: 12,
    lastActiveDate: "2026-04-21"
  },

  settings: {
    theme: "dark",
    dailyGoal: 5,
    notificationsEnabled: false
  }
}
```

---

## Proposed Changes (by Phase)

### Phase 1 — Project Setup & Design System

#### [NEW] `package.json`
Initialize Vite + React + TypeScript project with dependencies: `react-router-dom`, `chart.js`, `react-chartjs-2`, `lucide-react`, `uuid`, `tailwindcss`, `@tailwindcss/vite`. Using **yarn** as package manager.

#### [NEW] `vite.config.ts`
Standard Vite React + TypeScript config with TailwindCSS plugin.

#### [NEW] `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
TypeScript configuration with strict mode and path aliases.

#### [NEW] `index.html`
Root HTML with Inter font import, meta tags, favicon.

#### [NEW] `src/index.css`
- TailwindCSS imports (`@import "tailwindcss"`)
- Custom CSS properties for glassmorphism effects and animation keyframes
- Base layer customizations for dark mode theme

#### [NEW] `tailwind.config.ts`
- Custom color palette (indigo-violet accents, emerald success, amber warning, rose error)
- Extended theme with glassmorphism utilities, custom animations
- Inter font family configuration

---

### Phase 2 — Core Engine & Data Layer

#### [NEW] `src/engine/storage.ts`
- `loadData()` — reads from localStorage, returns parsed state
- `saveData(state)` — serializes and writes to localStorage
- `exportData()` — downloads JSON backup
- `importData(file)` — restores from JSON file
- `clearData()` — resets all data

#### [NEW] `src/engine/spacedRepetition.ts`
- `getNextInterval(attemptNumber)` — returns days: 7 → 14 → 30 → 60 → 90
- `processSubmission(problem, outcome, confidence)` — updates interval, status, nextReview
- `resetToLearning(problem)` — resets on failure
- `getDueProblems(problems, date)` — filters overdue + due today
- `getDueThisWeek(problems, date)` — due within 7 days

#### [NEW] `src/engine/readinessScore.ts`
- `calculateReadinessScore(problems)` — composite 0–100 score
  - Problems solved weighted by difficulty (Easy=1, Medium=2, Hard=3)
  - Revision success rate (solved / total submissions)
  - Confidence distribution
  - Pattern coverage (topics covered / total patterns)
  - Activity decay (reduce score for inactivity)
- `getTopicScores(problems)` — per-topic readiness
- `getStrengthsAndWeaknesses(problems)` — top 3 / bottom 3

#### [NEW] `src/engine/dailyPlan.ts`
- `generateDailyPlan(problems)` — returns structured plan:
  - All overdue reviews (mandatory)
  - 2 Easy warm-ups (weakest topics)
  - 2 Medium focus problems (weakest topics)
  - 1 Hard challenge
  - Excludes problems solved in last 24h
  - Prioritizes low-confidence problems

#### [NEW] `src/context/AppContext.tsx`
- React Context + useReducer
- Actions: ADD_PROBLEM, UPDATE_PROBLEM, DELETE_PROBLEM, ADD_SUBMISSION, ADD_DESIGN_QUESTION, UPDATE_DESIGN_QUESTION, ADD_MOCK_SESSION, UPDATE_STREAK, UPDATE_SETTINGS
- Auto-save to localStorage on every dispatch

#### [NEW] `src/data/patterns.ts`
List of all DSA patterns with metadata (name, description, icon, target problem count).

#### [NEW] `src/data/platforms.ts`
Platform configurations (name, domain, color, icon).

#### [NEW] `src/data/sampleProblems.ts`
~15 seed problems across different topics/difficulties for demo purposes. Loaded on first launch.

---

### Phase 3 — Layout & Navigation

#### [NEW] `src/components/layout/Sidebar.jsx`
- Dark glassmorphic sidebar with nav links
- Icons + labels for: Dashboard, Problems, Add Problem, Patterns, Readiness, Mock Interview, System Design, Daily Plan
- Active state highlighting
- Collapsible on mobile

#### [NEW] `src/components/layout/Header.jsx`
- Top bar with page title, search input, streak badge, theme toggle

#### [NEW] `src/components/layout/Layout.jsx`
- Flex layout: Sidebar + main content area
- Responsive: sidebar collapses to hamburger on mobile

#### [NEW] `src/components/common/Modal.jsx`, `Badge.jsx`, `ProgressBar.jsx`, `EmptyState.jsx`, `Toast.jsx`
Reusable UI primitives with animations.

---

### Phase 4 — Dashboard Page

#### [NEW] `src/pages/DashboardPage.jsx`
Assembles all dashboard components.

#### [NEW] `src/components/dashboard/StatsBar.jsx`
4-card stats row: Total Tracked, Due Today, Due This Week, Mastered — with animated counters.

#### [NEW] `src/components/dashboard/StreakTracker.jsx`
Flame icon with current streak + best streak, animated on update.

#### [NEW] `src/components/dashboard/RevisionQueue.jsx`
Scrollable list of today's due problems, grouped by priority (overdue → due today). Each item shows title, platform badge, difficulty badge, days overdue. Click to open Re-Solve mode.

#### [NEW] `src/components/dashboard/WeakTopicBanner.jsx`
Alert-style banner highlighting the user's weakest topic with a "Practice Now" CTA.

#### [NEW] `src/components/dashboard/RecentActivity.jsx`
Timeline of recently solved problems (last 7 days).

---

### Phase 5 — Problem Management

#### [NEW] `src/pages/ProblemsPage.jsx`
Problem library with filters and search.

#### [NEW] `src/pages/AddProblemPage.jsx`
Full problem entry form page.

#### [NEW] `src/pages/ProblemDetailPage.jsx`
Detailed view of a single problem with submission history.

#### [NEW] `src/components/problems/ProblemForm.jsx`
Full form: title, platform (dropdown), difficulty (radio), topics (multi-select/tags), pattern (dropdown), URL, YouTube links (dynamic list), solution summary (textarea), notes, time taken, category. Validation on required fields.

#### [NEW] `src/components/problems/ProblemList.jsx`
Virtualized list of problem cards with sort (date, difficulty, status) and filter.

#### [NEW] `src/components/problems/ProblemCard.jsx`
Card showing: title, platform icon, difficulty badge, topic tags, status indicator, next review date, confidence dot.

#### [NEW] `src/components/problems/FilterBar.jsx`
Filter controls: platform, difficulty, topic, status, confidence, search text.

#### [NEW] `src/components/problems/ProblemDetail.jsx`
Full detail view: all problem fields, submission history timeline, edit/delete actions, "Start Revision" button.

---

### Phase 6 — Revision & Re-Solve Mode

#### [NEW] `src/components/revision/ReSolveMode.jsx`
- Hides solution summary
- Shows problem title + link (opens in new tab)
- Auto-starts timer
- "I'm done" button → triggers confidence rating
- Shows performance delta vs previous attempt

#### [NEW] `src/components/revision/ConfidenceRating.jsx`
- Three-button prompt: Struggled / Okay / Nailed It
- Maps to: failed → reset | struggled → same interval | solved → advance
- Updates confidence: low / medium / high
- Calls spaced repetition engine to update problem

---

### Phase 7 — Pattern Tracker, Readiness Score, Heatmap

#### [NEW] `src/pages/PatternsPage.jsx`
Pattern grid + weakness heatmap.

#### [NEW] `src/components/patterns/PatternGrid.jsx`
Grid of pattern cards, each showing: pattern name, solved/target count, progress bar (color-coded: red < 40%, amber 40-70%, green > 70%).

#### [NEW] `src/components/patterns/PatternBar.jsx`
Individual animated progress bar component.

#### [NEW] `src/components/patterns/WeaknessHeatmap.jsx`
Grid visualization colored by readiness score per topic. Click a cell → filters problem list + shows top 3 suggested problems.

#### [NEW] `src/pages/ReadinessPage.jsx`
Full readiness dashboard.

#### [NEW] `src/components/readiness/ReadinessScore.jsx`
Animated doughnut chart (Chart.js) showing 0–100 score with color (red/amber/green).

#### [NEW] `src/components/readiness/StrengthWeakness.jsx`
Two columns: Top 3 strengths, Bottom 3 weaknesses with scores.

#### [NEW] `src/components/readiness/DifficultyChart.jsx`
Bar chart: Easy/Medium/Hard solved counts.

---

### Phase 8 — Mock Interview, System Design, Daily Plan

#### [NEW] `src/pages/MockInterviewPage.jsx`
Mock interview mode page.

#### [NEW] `src/components/mock/MockInterview.jsx`
- Random problem picker from user's solved list
- Filter by difficulty
- 45-minute blitz mode option
- Queue display

#### [NEW] `src/components/mock/Timer.jsx`
Large timer display: start / pause / reset with animated digits.

#### [NEW] `src/components/mock/SessionHistory.jsx`
Table of past sessions: date, problems attempted/solved, duration, avg time per problem.

#### [NEW] `src/pages/SystemDesignPage.jsx`
System design tracker page.

#### [NEW] `src/components/systemdesign/DesignList.jsx`
Card list of design questions with status badges (todo/reviewing/done).

#### [NEW] `src/components/systemdesign/DesignForm.jsx`
Form: title, tags, notes (markdown), status, reference links.

#### [NEW] `src/pages/DailyPlanPage.jsx`
Auto-generated daily practice plan.

#### [NEW] `src/components/dailyplan/DailyPlan.jsx`
Sections: Overdue Reviews, Easy Warm-ups, Medium Focus, Hard Challenge. Each problem card is actionable (start revision / mark complete).

---

## Design Aesthetic

| Aspect | Approach |
|--------|----------|
| **Theme** | Dark mode primary (rich navy/slate backgrounds) with glassmorphism cards |
| **Colors** | TailwindCSS extended palette: indigo-violet accents, emerald for success, amber for warnings, rose for errors |
| **Typography** | Inter font via Google Fonts, Tailwind typography scale |
| **Cards** | Frosted glass effect (`backdrop-blur`, `bg-white/5`, subtle borders) |
| **Animations** | Tailwind `animate-*` + custom keyframes for counters, hover lifts, progress fills |
| **Charts** | Gradient fills, rounded corners, consistent color scheme |
| **Responsiveness** | Mobile-first with Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) |

---

## Open Questions

> [!NOTE]
> All open questions resolved:
> - ✅ **Seed data**: ~15 sample problems included on first launch
> - ✅ **JSON import/export**: Built into v1 from day one
> - ✅ **TailwindCSS**: Using Tailwind for styling
> - ✅ **TypeScript**: All files use `.tsx` / `.ts`
> - ✅ **Yarn**: Using yarn as package manager

---

## Verification Plan

### Automated Tests
- Run `yarn build` to verify zero TypeScript/compilation errors
- Run `yarn dev` and browser-test all pages load correctly

### Manual Verification (Browser Testing)
1. **Dashboard**: Verify stats render, streak displays, revision queue populates
2. **Add Problem**: Submit form → verify problem appears in list and localStorage
3. **Spaced Repetition**: Add problem → complete revision → verify interval advances; fail → verify reset to 7 days
4. **Pattern Tracker**: Add problems across topics → verify progress bars and heatmap colors
5. **Readiness Score**: Verify score calculation updates in real-time after submissions
6. **Mock Interview**: Start session → timer works → complete → session saved to history
7. **System Design**: Add/edit/delete design questions
8. **Daily Plan**: Verify plan generates correctly based on due problems and weak topics
9. **Responsive**: Test on mobile viewport sizes
