# Tasky — Fullstack TODO Application

A clean, minimalistic full-stack todo app with a React frontend and a Node.js/Express backend, managed as an npm workspaces monorepo.

## Project Structure

```
tasky/
├── client/   # React 18 + Vite frontend
├── server/   # Node.js + Express + MongoDB backend
└── package.json  # Workspace root — run everything from here
```

## Prerequisites

- **Node.js** v18 or higher
- A MongoDB instance (Atlas or local) — see [server/README.md](server/README.md) for setup

## Setup

Install all dependencies for both workspaces from the repo root:

```bash
npm install
```

Create a `.env` file in `server/`:

```bash
cp server/.env.example server/.env   # then fill in your MONGO_URI
```

Or create `server/.env` manually:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
```

## Running the Application

| Command | What it does |
|---|---|
| `npm run dev` | Starts both frontend and backend concurrently |
| `npm run client` | Starts only the React dev server (`localhost:5173`) |
| `npm run server` | Starts only the Express server (`localhost:8000`) |
| `npm run build` | Builds the frontend for production |
| `npm start` | Starts the backend in production mode |

The frontend dev server proxies `/api` requests to `http://localhost:8000`, so both must be running for the app to work.

## Demo Video
https://www.loom.com/share/1576e55a99954832ab42677f98746ee0

## Code Walkthrough
https://www.loom.com/share/b01ef11796b442c6a141e407db55169a

## Further Reading

- [client/README.md](client/README.md) — frontend setup, features, and limitations
- [server/README.md](server/README.md) — API reference, MongoDB connection, and limitations
