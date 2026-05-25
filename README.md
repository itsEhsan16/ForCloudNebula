# CloudNebula

A React 18 + TypeScript dashboard featuring a searchable user list, a counter, and an analytics panel.

## Stack

- React 18, TypeScript
- Tailwind CSS (via CDN)
- Create React App

## Getting Started

```bash
npm install
npm start
```

Opens at [http://localhost:3000](http://localhost:3000).

## Features

- **User list** — search across 5,000 users with a live filter
- **Counter** — delayed increment (1s) demonstrating correct async state updates
- **Selected User** — click any user in the list to view their details
- **Analytics** — total user count and age sum, memoized to avoid unnecessary recalculation

## Project Structure

```
src/
├── index.tsx        # React root
├── App.tsx          # Entry point — renders Dashboard
├── Dashboard.tsx    # Main layout + UserList + AnalyticsPanel components
└── styles.css       # Base styles
```

## Engineering Notes

| Area | What was done |
|---|---|
| Stale closure | `setCount(prev => prev + 1)` instead of capturing `count` in the setTimeout callback |
| Memory leak | Resize event listener now has a cleanup function in `useEffect` |
| Memoization | `filteredUsers` wrapped in `useMemo`; `AnalyticsPanel` wrapped in `React.memo` with memoized `totalAge` |
| Type safety | `User` interface replaces all `any` types |
| Component structure | Sidebar extracted into `UserList`; `Component` renamed to `AnalyticsPanel` |
| Responsive UI | Mobile-first Tailwind breakpoints — sidebar stacks vertically on small screens |
