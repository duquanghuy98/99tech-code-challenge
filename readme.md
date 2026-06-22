# 99Tech Code Challenge

A single-page application built with **Vite + React + TypeScript** presenting solutions to all three 99Tech take-home problems.

Participant: Dư Đình Quang Huy

Email: [duquanghuy@gmail.com]  or [duquanghuy98@gmail.com]

**Live demo:** []

---

## Problems

| # | Title | Highlights |
|---|-------|------------|
| 1 | Three Ways to Sum to N | Interactive 3D carousel with three JS implementations, live results, and complexity badges |
| 2 | Fancy Swap Form | Real-time token prices (TanStack Query), swap + fiat buy/sell tabs, trending bar, top prices panel |
| 3 | Messy React | 14 issues with severity filters, expandable cards, resizable Before/After diff viewer with dual-pane line highlights |

---

## Tech Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix UI primitives)
- **Framer Motion** - page transitions, carousel, micro-animations
- **TanStack Query** - price API data fetching
- **i18next** - English / Vietnamese language toggle
- **next-themes** - dark / light mode
- **Sonner** - toast notifications
- **react-syntax-highlighter** - code display in Problem 3
- **react-resizable-panels** - side-by-side diff viewer
- **react-number-format** + **bignumber.js** - precise amount formatting
- **ogl** - WebGL particle background.

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
│   ├── ui/              shadcn/ui primitives
│   ├── effects/         Animation components (Particles, GooeyNav, etc.)
│   ├── layout/          Layout shell + Navbar
│   ├── display/         CodeSnippet, PageTransition, TruncatedNumber
│   └── common/          Shared ProblemBadge
├── hooks/               Shared React hooks
├── lib/
│   └── numbers/         Display formatting + exchange calculations
├── pages/               Landing page
├── problem1/
│   ├── components/      Solution carousel
│   ├── constants/       Carousel styling maps
│   ├── hooks/           Infinite carousel logic
│   └── written-answer/  Original JS implementations (do not modify)
├── problem2/
│   ├── components/      Swap form, exchange panel, token selector
│   │   └── fiat/        Fiat buy/sell form + order summary
│   ├── hooks/           Token prices, amount validation
│   └── lib/             Swap/fiat utilities
├── problem3/
│   ├── components/      Issue cards, diff viewer panes
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
- **Responsive** - mobile swipe carousel (Problem 1), stacked diff viewer (Problem 3)
