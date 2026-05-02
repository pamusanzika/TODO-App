# Tasky — Node.js Backend

REST API for the Tasky todo application, built with Express and MongoDB via Mongoose.

## Tech Stack

| Tool | Purpose |
|---|---|
| Node.js | Runtime |
| Express 5 | HTTP framework |
| Mongoose 9 | MongoDB ODM |
| dotenv | Environment variable loading |
| cors | Cross-origin request handling |
| nodemon | Auto-reload during development |

## Prerequisites

- **Node.js** v18 or higher
- A **MongoDB** instance — either a local installation or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

## Setup and Running

**1. Install dependencies**

```bash
cd server
npm install
```

**2. Create the environment file**

Create a `.env` file in the `server/` directory:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
```

See the [MongoDB Connection](#mongodb-connection) section below for how to get `MONGO_URI`.

**3. Start the server**

Development mode (auto-reloads on file changes):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will log `MongoDB Connected` followed by `Server running on port 8000` when ready.

## MongoDB Connection

### Option A — MongoDB Atlas (cloud, recommended)

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Under **Database Access**, add a user with a username and password.
3. Under **Network Access**, add your IP address (or `0.0.0.0/0` to allow all IPs during development).
4. Click **Connect → Drivers** and copy the connection string. It looks like:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
```

5. Replace `<username>` and `<password>` with your database user credentials and paste the string as `MONGO_URI` in `.env`.

### Option B — Local MongoDB

1. Install MongoDB Community Edition and start `mongod`.
2. Use the following connection string:

```env
MONGO_URI=mongodb://localhost:27017/tasky
```

> **Never commit your `.env` file.** It is already listed in `.gitignore`.

## API Endpoints

Base path: `/api/todos`

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/todos` | Fetch all todos (sorted newest first) |
| `POST` | `/api/todos` | Create a new todo |
| `PUT` | `/api/todos/:id` | Update title, description, and due date |
| `PATCH` | `/api/todos/:id/done` | Toggle completion status |
| `DELETE` | `/api/todos/:id` | Delete a todo |

### Todo schema

```json
{
  "_id": "ObjectId",
  "title": "string (required)",
  "description": "string (default: \"\")",
  "done": "boolean (default: false)",
  "dueDate": "Date | null",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Example requests

**Create a todo**

```bash
curl -X POST http://localhost:8000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, eggs", "dueDate": "2026-05-10"}'
```

**Toggle completion**

```bash
curl -X PATCH http://localhost:8000/api/todos/<id>/done
```

## Project Structure

```
server/
├── controllers/
│   └── todoController.js   # Route handler logic (CRUD + toggle)
├── models/
│   └── Todo.js             # Mongoose schema and model
├── routes/
│   └── todoRoutes.js       # Express router
├── server.js               # App entry point — middleware, routes, DB connect
└── package.json
```

## Assumptions and Limitations

- **No authentication**: The API is open — any client that can reach the server can read and modify all todos. Do not expose it publicly without adding auth.
- **Single collection**: All todos belong to one global list with no user or workspace separation.
- **CORS open by default**: `cors()` is applied without an origin allowlist, which is fine for local development but should be tightened before any production deployment.
- **No input sanitisation beyond trimming**: The title and description are trimmed but not sanitised for HTML or script content. If the frontend ever renders raw HTML from these fields, XSS protection will be needed.
- **No pagination**: `Todo.find()` returns every document. For large datasets, adding `limit` and `skip` (or cursor-based pagination) is recommended.
- **PORT defaults to 8000**: If the `.env` file is missing or `PORT` is unset, the server falls back to port `8000`. The React frontend's Vite proxy is hardcoded to this port, so changing it requires updating `client/vite.config.js` as well.
