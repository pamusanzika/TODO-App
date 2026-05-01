# Tasky — React Frontend

A clean, minimalistic todo app built with React, Vite, and Tailwind CSS.

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 5 | Dev server and bundler |
| Tailwind CSS 3 | Styling |
| Framer Motion | Animations |
| Lucide React | Icons |

## Prerequisites

- **Node.js** v18 or higher
- The backend server running on port `8000` (see [server/README.md](../server/README.md))

## Setup and Running

**1. Install dependencies**

```bash
cd client
npm install
```

**2. Start the development server**

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

> Vite is configured to proxy all `/api` requests to `http://localhost:8000`, so no separate CORS or URL configuration is needed during development.

**3. Build for production**

```bash
npm run build
```

Output is placed in `client/dist/`. Preview the production build locally with:

```bash
npm run preview
```

## Features

- **Create tasks** with a title, optional description, and optional due date
- **Edit tasks** inline — click a task to open the edit form
- **Toggle completion** — mark tasks done or pending with a single click
- **Delete tasks** with animated removal
- **Mini calendar sidebar** — highlights dates that have tasks; click a date to filter the task list
- **Overview panel** — shows total, completed, and pending counts with a progress bar
- **Skeleton loading** — placeholder cards shown while the initial fetch is in progress
- **Error banner** — displayed if the backend is unreachable on startup

## Project Structure

```
client/
├── src/
│   ├── api/
│   │   └── todos.js          # All API calls to the backend
│   ├── components/
│   │   ├── MiniCalendar.jsx  # Calendar sidebar with task date highlights
│   │   ├── ShowAllTasksButton.jsx
│   │   ├── TaskForm.jsx      # Add / edit task form
│   │   ├── TaskItem.jsx      # Individual task row
│   │   └── TaskList.jsx      # Renders the filtered list
│   ├── App.jsx               # Root component, state management
│   ├── index.css             # Global styles and Tailwind directives
│   └── main.jsx              # React entry point
├── assets/
│   └── To_do_logo.svg
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Assumptions and Limitations

- **Backend dependency**: The frontend has no offline mode. All data is fetched from the Express/MongoDB backend; the app will show an error banner if the server is not reachable.
- **No authentication**: There is no user login — all users share the same task list.
- **Single list**: Tasks are not grouped by user or category beyond date filtering.
- **Date handling**: Due dates are stored in UTC on the server. The calendar and date labels convert to local time in the browser, so dates may appear off by one day in timezones far from UTC depending on the time the task was created.
- **No pagination**: All tasks are loaded in a single request. Performance may degrade with a very large number of tasks.
- **No offline/PWA support**: The app requires an active network connection to the backend.
