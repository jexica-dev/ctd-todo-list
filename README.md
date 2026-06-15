# Taskly — Todo List App

A clean, fast task manager built with React. Every change appears instantly with optimistic UI updates while syncing to the server in the background.

**Live demo:** _[your-app.vercel.app]_ <!-- replace after deploying -->

---

## Features

- Add, edit, and delete tasks
- Drag and drop to reorder tasks
- Mark tasks complete / active
- Filter by All / Active / Done
- Sort by date created or title (ascending or descending)
- Search tasks by keyword (debounced)
- Secure login with CSRF token protection
- Input sanitization via DOMPurify
- Responsive layout — works on mobile, tablet, and desktop

## Screenshots

| Desktop | Mobile |
|---------|--------|
| _add screenshot_ | _add screenshot_ |

---

## Tech stack

| Layer | Choice |
|-------|--------|
| UI framework | React 19 |
| Routing | React Router 7 |
| State management | Context API + `useReducer` |
| Styling | Tailwind CSS |
| Build tool | Vite |
| Input security | DOMPurify |
| Hosting | Vercel |

---

## Getting started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/jexica-dev/<your-repo-name>.git
cd <your-repo-name>
npm install
```

### Environment variables

Create a `.env` file in the project root:

```
VITE_TARGET=https://ctd-learns-node-l42tx.ondigitalocean.app
```

> `.env` is gitignored — never commit it.

### Running locally

```bash
npm run dev
```

App runs at `http://localhost:3001`. The Vite dev server proxies `/api/*` requests to the backend automatically.

---

## Available scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Deployment (Vercel)

1. Push your code to GitHub
2. Import the repo at [vercel.com](https://vercel.com)
3. Add the `VITE_TARGET` environment variable in Vercel's project settings
4. Deploy — Vercel detects Vite automatically

The included `vercel.json` rewrites `/api/*` requests to the backend, replacing the Vite dev proxy in production.

---

## Design decisions

- **Tailwind CSS** — utility-first classes kept co-located with components, no separate stylesheet maintenance
- **Optimistic UI** — todos update instantly on screen; failures roll back automatically
- **HTML5 Drag API** — native drag-and-drop reordering with no extra dependencies
- **DOMPurify** — all user-supplied text is validated then stripped of any HTML/script tags before being sent to the server
- **Debounced search** — filter input waits 300ms before querying, reducing unnecessary API calls

## Future improvements

- Drag-and-drop order persistence via a backend `position` field
- Dark mode toggle
- Due dates and priority levels
- Unit tests with Vitest + React Testing Library
- PWA support for offline use

---

## License

MIT

---

## Contact

GitHub: [github.com/jexica-dev](https://github.com/jexica-dev)