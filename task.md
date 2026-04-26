# Backend Implementation Tasks

## Phase 1: Setup & Auth Core
- [x] Create `api/` directory and `requirements.txt`
- [x] Setup `api/index.py` (FastAPI app configured for Vercel)
- [x] Setup `api/core/config.py` and `api/core/security.py` (PyJWT, Passlib)
- [x] Setup `api/core/dependencies.py` (Auth dependency)
- [x] Create Beanie `User` model (`api/models/user.py`)
- [x] Create Pydantic schemas for Auth (`api/schemas/user.py`, `token.py`)
- [x] Implement `/api/auth/register` and `/api/auth/login` (`api/routers/auth.py`)

## Phase 2: Core Models & API
- [x] Create Beanie `Problem` and `Submission` models (`api/models/problem.py`)
- [x] Create Pydantic schemas for Problems (`api/schemas/problem.py`)
- [x] Implement `/api/problems` routes (GET, POST, PUT, DELETE)
- [x] Implement spaced-repetition next-review calculation in POST/PUT submissions

## Phase 3: Chrome Extension Endpoint
- [x] Create `/api/extension/sync` endpoint specifically for the Chrome extension payload
- [x] Modify `extension/background.js` to execute `fetch` POST to `/api/extension/sync`

## Phase 4: Frontend Migration
- [x] Create `AuthContext.tsx` in React to manage JWT
- [x] Build `/login` and `/register` React components
- [x] Update `ProblemContext` or API hooks to fetch from `/api/problems` with `Bearer` token
- [x] Test local development proxy and ensure Vercel rewrites work correctly
