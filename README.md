# LocalMind

LocalMind is an offline, privacy-first clone of the popular study application [Cramberry.study](https://cramberry.study/). The goal is to provide a comprehensive, premium-feeling dashboard for managing local study sets, generating flashcards, and answering quizzes completely locally without needing a constant internet connection.

## Phase 1 MVP
Phase 1 focuses on scaffolding out the high-fidelity UI shell and laying the foundation for local database storage.

### The Stack Requirements
*   **Frontend**: Next.js 14 (App Router), Tailwind CSS v3
*   **Backend**: FastAPI, SQLAlchemy
*   **Database**: SQLite

![High End Dashboard](https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop) *(Placeholder representing our rich dark-mode aesthetic)*

---

## Directory Structure

```plaintext
LocalMind/
├── frontend/             # Next.js Application
│   ├── src/app/          # Core App Router, globals.css, Layout
│   ├── src/components/   # Component Library (Sidebar, Dashboard layout)
│   ├── src/lib/          # Utilities
│   ├── tailwind.config.ts
│   └── package.json
└── backend/              # FastAPI Application
    ├── main.py           # Entry point and endpoints
    ├── database.py       # SQLAlchemy SQLite connection
    ├── models.py         # Table schemas
    └── requirements.txt
```

---

## Getting Started

### 1. Setup the Frontend (Next.js)

The frontend uses Node.js and npm. It has been built with an emphasis on a glassmorphic dark-theme aesthetic using `lucide-react` icons.

```bash
cd frontend
npm install
npm run dev
```

The application will begin running at `http://localhost:3000`.

### 2. Setup the Backend (FastAPI)

The backend provides a fast JSON API mapping to our local SQLite database.

```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```

The server will begin running at `http://localhost:8000`. Simply spinning up the server for the first time will trigger SQLAlchemy to initialize the local `localmind.db` schema.

---

## Core Features (Roadmap)
- [x] **Premium UI Shell**: Advanced dark-mode aesthetics using Tailwind utility classes.
- [x] **Local Storage Setup**: Robust SQLite relational storage.
- [ ] **Document Parsing**: Local extraction from uploaded PDFs and Word Docs.
- [ ] **Generative Flashcards**: AI/LLM integration to spin up quiz materials locally.
- [ ] **Offline Podcasts**: Text-to-Speech generation summarizing study units.
