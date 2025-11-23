# NoteFlow Backend API

Backend API for NoteFlow built with Fastify, Prisma, and MongoDB.

## Tech Stack

- **Fastify**: High-performance web framework
- **Prisma**: Type-safe database ORM for MongoDB
- **MongoDB**: Document database
- **Redis**: Session storage and caching
- **JWT**: Authentication tokens
- **Winston**: Structured logging

## Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- Redis (for session management)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Generate Prisma client:
```bash
npm run prisma:generate
```

4. Push Prisma schema to database:
```bash
npm run prisma:push
```

5. Create MongoDB indexes manually (Prisma doesn't support all MongoDB index types):
```javascript
// Connect to MongoDB and run:
db.notes.createIndex({ "content.text": "text", "keywords": "text" }, { name: "notes_content_text_text" })
db.notes.createIndex({ "vectorId": 1 }, { unique: true, sparse: true, name: "notes_vectorId_sparse_unique" })
```

### Development

```bash
npm run dev
```

Server will start on `http://localhost:3001`

### Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

## Project Structure

```
backend/
├── src/
│   ├── routes/          # API route handlers
│   ├── middleware/      # Authentication and other middleware
│   ├── utils/           # Utility functions (db, redis, auth, logger)
│   └── index.ts         # Application entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── schemas.ts           # Fastify JSON schemas
└── package.json
```

