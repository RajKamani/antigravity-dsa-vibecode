# Backend Implementation Plan: FastAPI + MongoDB

This plan outlines the architecture for migrating the O(1) Knot stateless application to a robust, persistent backend using FastAPI, MongoDB, and JWT Authentication.

## Goal
Design a highly performant, scalable Python backend that acts as the source of truth for the React frontend and handles the automated incoming data from the Chrome Extension.

> [!IMPORTANT]
> **User Review Required**
> Please review this architecture plan. It involves introducing Python, MongoDB, and a new directory structure into the project.

## Proposed Tech Stack
- **Framework:** FastAPI (High performance, async native, auto-generated Swagger UI).
- **Database:** MongoDB (Ideal for dynamic schema, lists of topics/submissions).
- **ODM:** Beanie (An Object-Document Mapper built on Pydantic, making Mongo integration with FastAPI completely seamless and typed).
- **Authentication:** PyJWT + Passlib (Standard Bearer Token / JWT implementation).

---

## 1. Directory Structure

We will create a standalone `backend/` directory in the root of your project:

```text
backend/
├── app/
│   ├── main.py              # App entry point (FastAPI instance)
│   ├── core/
│   │   ├── config.py        # Env vars (Mongo URI, JWT Secret)
│   │   ├── security.py      # Password hashing, JWT generation
│   │   └── dependencies.py  # get_current_user (Auth middleware)
│   ├── models/              # Database Documents (Beanie)
│   │   ├── user.py          
│   │   └── problem.py       
│   ├── schemas/             # Pydantic validation models (API In/Out)
│   │   ├── user.py          
│   │   └── problem.py       
│   └── api/
│       └── routers/
│           ├── auth.py      # /api/auth/register, /api/auth/login
│           ├── problems.py  # /api/problems/*
│           └── extension.py # /api/extension/sync (For Chrome Ext)
├── requirements.txt
└── .env                     # Local secrets
```

---

## 2. Database Schema (MongoDB + Beanie)

### User Model
Will store authentication credentials.
- `id`: ObjectId
- `email`: Indexed, Unique
- `hashed_password`: String
- `created_at`: Datetime

### Problem Model
Will mirror your `requirement.md` TypeScript interface.
- `user_id`: Link to User (Indexed)
- `title`, `platform`, `difficulty`, `url` (Indexed)
- `topics`, `pattern`, `solutionSummary`, `status`, `confidence`
- `nextReview`: Datetime
- `submissions`: Array of nested objects (`date`, `interval`, `outcome`)

---

## 3. Authentication Flow

1. **Registration/Login:** The frontend sends email/password to `/api/auth/login`.
2. **Token Generation:** Backend returns a JWT `access_token` valid for 7 days.
3. **Protected Routes:** All routes under `/api/problems` require the `Authorization: Bearer <token>` header.
4. **Extension Sync:** You will paste this same JWT into the Chrome Extension's popup "Auth Token" field. The `background.js` will use it to securely POST submissions directly into your specific user account in the database.

---

## 4. Implementation Phases

### Phase 1: Setup & Auth Core
- Initialize Python environment, `requirements.txt`.
- Connect FastAPI to MongoDB Atlas/Local via Beanie.
- Build `User` model, JWT hashing utilities, and the login/register API routes.

### Phase 2: CRUD & Core Logic
- Build the `Problem` model.
- Implement `/api/problems` (GET, POST, PUT, DELETE).
- Move the **Spaced Repetition Algorithm** logic (calculating the next interval based on "Struggled" vs "Nailed it") to the backend so it's centralized.

### Phase 3: Chrome Extension Endpoint
- Build `/api/extension/sync`.
- Modify the Extension's `background.js` to actually execute the `fetch` POST request to this endpoint instead of just storing it locally.

### Phase 4: Frontend Migration
- Build a Login/Signup UI in the React app.
- Swap out the existing LocalStorage logic for React Query (or native `fetch`) to sync seamlessly with the FastAPI backend.

---

## Open Questions

> [!WARNING]
> **Please clarify these points before we begin coding:**

1. **Database Hosting:** Will you be using MongoDB Atlas (cloud database) for this, or a local MongoDB installation on your machine?
2. **ODM Choice:** I proposed **Beanie**, which is highly regarded for FastAPI + Mongo. Are you comfortable with that, or do you prefer raw `motor` queries?
3. **Frontend Scope:** Should I also build the Login/Signup screens in the React frontend as part of this immediate execution, or do you just want the backend API built and tested first?
