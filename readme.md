# 99Tech Code Challenge

A single-page application built with **Vite + React + TypeScript** presenting solutions to all three 99Tech take-home problems.

Participant: Dư Đình Quang Huy

Email: [duquanghuy@gmail.com]  or [duquanghuy98@gmail.com]

**Live demo:** [https://99tech-code-challenge-nine.vercel.app]

---

## For reviewers - written answers

The take-home **question prompts and submitted answers** for Problems **1** and **3** live in each problem’s `written-answer/` folder (unchanged from the challenge deliverable):

| Problem | Path | Contents |
|---------|------|----------|
| **1** | [`src/problem1/written-answer/`](src/problem1/written-answer/) | Three JavaScript implementations of *sum to n* (`index.js`) |
| **3** | [`src/problem3/written-answer/`](src/problem3/written-answer/) | Original messy component (`original.tsx`) and refactored solution (`WalletPage.tsx`) |

Problem 2 is implemented in the app UI only (no separate written-answer folder).

---

## Problems

| # | Title | Highlights |
|---|-------|------------|
| 1 | Three Ways to Sum to N | Interactive 3D carousel with three JS implementations, live results, complexity badges, and **More info** modals with step-by-step algorithm visualizations (Gauss pairing, loop stepper, recursion call stack), playback controls, and adjustable speed |
| 2 | Fancy Swap Form | Real-time token prices (TanStack Query), swap + fiat buy/sell tabs, trending bar, top prices panel |
| 3 | Messy React | 14 issues with severity filters, expandable cards, resizable Before/After diff viewer with dual-pane line highlights |

---

## Tech Stack

- **Vite** + **React 18** + **TypeScript**
- **React Router** - client-side routing across landing + problem pages
- **Tailwind CSS** + **shadcn/ui** (Radix UI primitives: Dialog, Popover, Tabs, Label, Separator, Slot)
- **Framer Motion** - page transitions, carousel, modal/step animations
- **TanStack Query** - price API data fetching
- **i18next** - English / Vietnamese language toggle
- **next-themes** - dark / light mode
- **Sonner** - toast notifications
- **react-syntax-highlighter** - code display (Problem 1 modals + Problem 3 diff viewer)
- **react-resizable-panels** - side-by-side diff viewer
- **react-number-format** + **bignumber.js** - precise amount formatting
- **lucide-react** - icons
- **ogl** - WebGL particle background

---

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/              shadcn/ui primitives (Button, Card, Dialog, Tabs, …)
│   ├── effects/         Particles, GooeyNav, ClickSpark, FuzzyText, BorderGlow, DecryptedText
│   ├── layout/          Layout shell + Navbar
│   ├── display/         CodeSnippet, PageTransition, TruncatedNumber
│   └── common/          Shared ProblemBadge
├── hooks/               Shared React hooks (debounce, delayed value, mobile breakpoint)
├── lib/
│   ├── numbers/         Display formatting + exchange calculations
│   ├── formatNumbers.ts
│   └── utils.ts
├── pages/               Landing page
├── problem1/
│   ├── components/      Solution carousel, detail modal, per-algorithm visualizers
│   ├── constants/       Carousel styling maps, playback speed constants
│   ├── hooks/           Infinite carousel + algorithm step playback
│   ├── visualizers/     Trace generators (Gauss, loop, recursion)
│   └── written-answer/  Original JS implementations (do not modify)
├── problem2/
│   ├── components/      Swap form, exchange panel, token selector
│   │   └── fiat/        Fiat buy/sell form + order summary
│   ├── hooks/           Token prices, amount validation, fiat calculations
│   └── lib/             Swap/fiat utilities
├── problem3/
│   ├── components/      Issue cards, progress strip, diff viewer panes
│   │   └── diff/        CodeDiffViewer, CodePane, toolbar
│   ├── data/            Issue metadata
│   ├── hooks/           Synced scroll for diff panes
│   └── written-answer/  Original + refactored code (do not modify)
└── i18n/                EN + VI translation files
```

---

## Features

- **Navbar** with GooeyNav pill animation (desktop) and mobile drawer
- **Particles** + click spark effects on all pages
- **Lazy-loaded** Problem 3 page for faster initial load
- **Full i18n** - all user-facing strings in `en.json` / `vi.json`
- **Responsive** - mobile swipe carousel (Problem 1), full-screen algorithm detail modals on mobile, stacked diff viewer (Problem 3)
- **Problem 1 algorithm deep-dives** - More info modals with step playback (play/pause/scrub), speed multiplier (×0.5–×3), live code trace with line highlighting, and per-approach visualizations
- **Skeleton loading** - initial load placeholders on Problem 1 carousel, Problem 2 swap form, and Problem 3 page
- **Simulated latency** - a minimum **1s** loading delay (`useDelayedValue` / `useMinLoadingTime` in `hooks/useDelayedValue.ts`) so skeletons and pending states are visible even when data resolves instantly (e.g. Problem 1 result recalc, Problem 2 price/quote updates)
