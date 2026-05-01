# Fullstack TODO Application

A clean, minimalistic full-stack TODO application using a React frontend and Node.js backend.

## Project Structure

This is a monorepo setup containing both the client and server code:

- `client/`: React frontend (Vite)
- `server/`: Node.js/Express backend

## Running the Application

1. Install root dependencies:
   ```bash
   npm install
   ```

2. Start both the client and server concurrently:
   ```bash
   npm run dev
   ```

Alternatively, you can run them separately:
- `npm run client`: Starts only the React development server.
- `npm run server`: Starts only the Node.js backend.
