# NoteFow

NoteFow is an intelligent, web-based note-taking application designed to help users organize their thoughts effortlessly. It leverages Artificial Intelligence to automatically categorize notes, generate keywords, and enable semantic search, making it easier than ever to retrieve information.

## Features

-   **Smart Note Creation**: Write notes and let AI automatically generate relevant keywords and suggest categories.
-   **Semantic Search**: Search for notes using natural language queries, not just exact keyword matches.
-   **Automatic Categorization**: Keep your workspace organized with AI-driven category suggestions.
-   **User Authentication**: Secure user accounts with JWT-based authentication.
-   **Responsive Design**: A clean, modern interface built with Next.js and Tailwind CSS.

## Tech Stack

### Backend
-   **Runtime**: Node.js
-   **Framework**: Fastify
-   **Database**: MongoDB (via Prisma ORM)
-   **Vector Database**: Qdrant (for semantic search)
-   **AI Integration**: OpenAI API
-   **Authentication**: JWT (JSON Web Tokens)

### Frontend
-   **Framework**: Next.js 14 (App Router)
-   **Styling**: Tailwind CSS
-   **State Management**: Zustand
-   **Data Fetching**: TanStack Query (React Query)
-   **Icons**: Lucide React

## Prerequisites

Before running the application, ensure you have the following installed and set up:

1.  **Node.js** (v18 or higher)
2.  **MongoDB Database**: You need a MongoDB connection string (e.g., MongoDB Atlas).
3.  **Qdrant Instance**: You need a running Qdrant instance (local or cloud).
4.  **OpenAI API Key**: You need a valid API key from OpenAI.

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd NoteFow
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `backend` directory with the following variables:

```env
DATABASE_URL="your_mongodb_connection_string"
JWT_SECRET="your_strong_jwt_secret"
OPENAI_API_KEY="your_openai_api_key"
QDRANT_URL="your_qdrant_url" # e.g., http://localhost:6333
QDRANT_API_KEY="your_qdrant_api_key" # Optional, if using Qdrant Cloud
PORT=3001
```

Build the backend:

```bash
npm run build
```

Start the backend server:

```bash
npm start
```
The backend will run on `http://localhost:3001`.

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`.

## Usage

1.  Open your browser and go to `http://localhost:3000`.
2.  **Register** a new account.
3.  **Login** with your credentials.
4.  **Create a Note**: Click "New Note", type your content, and save. The AI will process it in the background.
5.  **Search**: Use the search bar to find notes by keywords or meaning.

## Project Structure

```
NoteFow/
├── backend/                # Node.js/Fastify Backend
│   ├── src/
│   │   ├── plugins/        # Fastify plugins (Prisma, JWT)
│   │   ├── routes/         # API Routes (Auth, Notes)
│   │   ├── services/       # Business logic (AI, Qdrant)
│   │   └── server.ts       # Entry point
│   └── prisma/             # Database schema
│
└── frontend/               # Next.js Frontend
    ├── src/
    │   ├── app/            # App Router pages
    │   ├── components/     # Reusable UI components
    │   ├── lib/            # Utilities (Axios, etc.)
    │   └── store/          # Zustand state store
```
