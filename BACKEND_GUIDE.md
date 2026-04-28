# Production-Ready Backend Guide

Your backend has been upgraded with a robust architecture using **Express**, **Prisma ORM**, and **SQLite** (local) / **PostgreSQL** (production ready).

## 1. Architecture Overview
- **Database**: Prisma ORM with a relational schema (Users, Categories, Levels, Quizzes, Progress).
- **Authentication**: JWT-based secure auth with `bcryptjs` password hashing.
- **Business Logic**: Server-side quiz validation to prevent cheating. Next levels are unlocked automatically when a score of ≥ 70% is achieved.
- **Middleware**: `authenticate` middleware protects private routes.

## 2. File Structure
- `prisma/schema.prisma`: Database definitions.
- `src/lib/db.ts`: Prisma Client initialization (Singleton).
- `src/middleware/authMiddleware.ts`: JWT verification logic.
- `src/services/authService.ts`: Signup and Login business logic.
- `src/services/quizService.ts`: Quiz submission, scoring, and progress tracking logic.
- `server.ts`: API route definitions and server startup.

## 3. Database Schema (Prisma)
The schema supports:
- **User**: Profiles with XP and Leveling.
- **Category & Level**: Hierarchical quiz structure.
- **Quiz**: Server-stored questions and correct answers.
- **Progress**: Tracking per user/level with auto-completion status.

## 4. API Endpoints
- `POST /api/auth/signup`: Create a new account.
- `POST /api/auth/login`: Authenticate and get a JWT token.
- `POST /api/quiz/submit`: Submit answers (Server-side validation).
- `GET /api/user/progress`: Fetch personalized progression data.
- `GET /api/leaderboard`: Global rankings by XP.

## 5. How to switch to PostgreSQL for Production (Vercel/Cloud)
1. In `prisma/schema.prisma`, change the provider:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Update your `.env` with your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
   ```
3. Run `npx prisma db push` to sync.

## 6. Security Features
- **No Client-Side Scoring**: The frontend only sends chosen answers; the server checks them against the database.
- **Input Validation**: All API routes are wrapped in try-catch blocks with error handling.
- **Token Protection**: User data is only accessible with a valid Bearer token.
