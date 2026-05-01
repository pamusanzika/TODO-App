# Server - Node.js Backend

This is the backend component of the TODO application, built using Node.js, Express, and MongoDB.

## Running Locally

1. Create a `.env` file in the `server` directory and add:
   ```env
   PORT=8000
   MONGO_URI=your_mongodb_connection_string
   ```

2. Install dependencies:
   ```bash
   cd server
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

- `GET /api/todos`: Fetch all todos
- `POST /api/todos`: Create a new todo
- `PUT /api/todos/:id`: Update a todo
- `PATCH /api/todos/:id/done`: Toggle task completion status
- `DELETE /api/todos/:id`: Delete a todo
