# Practice Server

Simple Express + Mongoose backend for CRUD operations.

Setup

1. Copy `.env.example` to `.env` and set `MONGODB_URI` if needed.
2. Install dependencies: `npm install`.
3. Start server: `npm run dev` (requires `nodemon`) or `npm start`.

API endpoints

- GET /api/items
- POST /api/items { title, description }
- PUT /api/items/:id { title, description }
- DELETE /api/items/:id
