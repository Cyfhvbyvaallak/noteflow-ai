# NoteFlow AI — Intelligent Speech-to-Study Automation Platform

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB.svg?style=flat&logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![MySQL](https://img.shields.io/badge/Database-MySQL%20%2B%20SQLite%20Fallback-4479A1.svg?style=flat&logo=mysql)](https://www.mysql.com)
[![OpenAI](https://img.shields.io/badge/AI-OpenAI%20Whisper%20%2B%20GPT-412991.svg?style=flat&logo=openai)](https://openai.com)

**NoteFlow AI** is a modern, student-centric SaaS platform that eliminates manual lecture note-taking by automating the end-to-end learning lifecycle:

$$\text{Lecture Speech} \longrightarrow \text{Speech-to-Text} \longrightarrow \text{AI Processing} \longrightarrow \text{Summary} + \text{Key Points} + \text{Revision Kit} + \text{Practice Quiz}$$

---

## 🌟 Key Features

1. **🎙️ Live Lecture Audio Recording & Visualizer:** Real-time microphone audio capture with Web Audio API waveforms, timer, pause/resume controls, and direct speech-to-text processing.
2. **📁 Multi-Format Ingestion:** Drag-and-drop support for **MP3, WAV, M4A, MP4 (Video), and PDF slide decks** (via PyPDF2).
3. **📝 Real-time Speech-to-Text & Transcript Studio:** Search inside transcripts with term highlighting, one-click copy, Markdown download, and inline editing.
4. **🤖 Executive AI Summarization & Key Points:** Concise summaries, key takeaways, and bulleted concepts with importance ratings (Critical, High, Medium).
5. **📚 Exam Revision Center & Flashcards:** Active recall flashcard flip mode, terminology glossaries, quick revision checklists, and high-probability exam focus topics.
6. **🧠 Interactive Practice Quizzes:** Auto-generated MCQs and True/False questions strictly grounded in lecture facts, with instant grading, score percentages, and detailed answer explanations.
7. **✍️ Student Study Notes:** Rich Markdown note editor with subject filtering, tag search, and favorite pinning.
8. **🔍 Unified Global Search:** Instant cross-resource search querying lectures, transcripts, notes, summaries, revision sheets, and quiz questions.
9. **⚡ Zero-Config Demo Mode:** Complete offline capability with 4 preloaded multi-disciplinary lectures (Computer Science, Physics, Biology, Math) and mock AI generator when no API key is present.

---

## 🏗️ Project Architecture

```
noteflow-ai/
├── backend/
│   ├── app/
│   │   ├── core/           # Security, JWT, and settings config
│   │   ├── database/       # SQLAlchemy engine (MySQL + SQLite fallback) & Seed data
│   │   ├── models/         # ORM models (User, Lecture, Transcript, Summary, Quiz, etc.)
│   │   ├── schemas/        # Pydantic request/response validation
│   │   ├── services/       # STT Whisper, PyPDF2, and AI prompt engines
│   │   ├── routes/         # REST API endpoints
│   │   └── main.py         # FastAPI application entrypoint
│   ├── uploads/            # Secure uploaded audio/video/pdf storage
│   ├── requirements.txt    # Python dependencies
│   └── run.py              # Server starter
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable layout, recorder, uploader, tabs, quiz & notes UI
│   │   ├── context/        # AuthContext (JWT & Demo login) and ToastContext
│   │   ├── pages/          # Landing, Dashboard, Detail, Notes, Revision, Quiz, Search
│   │   ├── services/       # API fetch client
│   │   ├── App.jsx         # React router and route protection
│   │   └── index.css       # Tailwind design system & styling
│   ├── package.json
│   └── vite.config.js
├── database/
│   └── schema.sql          # Native MySQL 8.0 schema
├── .env.example            # Environment configuration template
├── start.bat               # Windows 1-click startup
└── start.sh                # Unix 1-click startup
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Python 3.10+** (Tested on Python 3.10, 3.11, 3.12, 3.14)
- **Node.js 18+** and **npm**
- *(Optional)* **MySQL 8.0+** (If MySQL is not installed, backend automatically runs on SQLite fallback).

---

### 2. Quick 1-Click Launch (Windows)
Double-click `start.bat` or run:
```powershell
.\start.bat
```
This automatically starts the FastAPI Backend on `http://127.0.0.1:8000` and the Vite Frontend on `http://localhost:5173`.

---

### 3. Manual Step-by-Step Setup

#### A. Backend Setup
1. Navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Initialize database tables and seed sample lectures:
   ```bash
   python app/database/seed.py
   ```
4. Start the FastAPI backend server:
   ```bash
   python run.py
   ```
   *API will be running on `http://127.0.0.1:8000` (Interactive Swagger docs: `http://127.0.0.1:8000/docs`).*

#### B. Frontend Setup
1. Navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start Vite dev server:
   ```bash
   npm run dev
   ```
   *Open `http://localhost:5173` in your web browser.*

---

### 4. Database Configuration (MySQL Setup)

To use a dedicated MySQL server:
1. Create the database using `database/schema.sql`:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
2. Set your MySQL connection URL in `.env` or system environment:
   ```ini
   DATABASE_URL=mysql+pymysql://username:password@localhost:3306/noteflow_ai
   ```
> **Note:** If MySQL credentials fail or the server is inactive, the application automatically uses SQLite (`noteflow_ai.db`) so you never get blocked.

---

### 5. Environment Variables (`.env.example`)

Copy `.env.example` to `.env` to configure your custom API keys:

```ini
# Environment
ENVIRONMENT=development
PORT=8000
SECRET_KEY=noteflow_super_secret_jwt_key_change_in_production_2026

# MySQL or SQLite
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/noteflow_ai
SQLITE_FALLBACK=true

# AI Configuration (Optional: if empty, runs in high-quality Demo Mode)
OPENAI_API_KEY=sk-your_key_here
OPENAI_MODEL=gpt-4o-mini
STT_PROVIDER=openai_whisper
```

---

### 6. Interactive Demo Mode

- Default Demo Student Account:
  - **Email:** `student@noteflow.ai`
  - **Password:** `noteflow123`
- Or simply click **"1-Click Demo Login"** on the Login page.
- Pre-populated with 4 comprehensive academic lectures:
  1. **Computer Science:** *Consensus in Distributed Systems & The Raft Protocol*
  2. **Physics:** *Quantum Mechanics, Wave-Particle Duality & Schrödinger Equation*
  3. **Biology:** *Cellular Respiration, Glycolysis & ATP Synthase*
  4. **Mathematics:** *Linear Algebra: Eigenvalues & Matrix Diagonalization*

---

## 🛡️ Security & Quality Best Practices
- **Password Hashing:** Native `bcrypt` with cryptographic salt generation.
- **Session Tokens:** Stateless JWT tokens using `HS256`.
- **Protected Endpoints:** Strict user data isolation; students can only access their own lectures and notes.
- **Factual AI Grounding:** Strict system prompt templates preventing hallucinations and tying quiz questions solely to lecture transcript facts.
