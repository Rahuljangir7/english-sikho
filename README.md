# English Sikho — Full-Stack Next.js + PostgreSQL Learning Platform

**English Sikho** is a multi-user Hinglish/Hindi-assisted platform for mastering English sentence foundations and all 12 tenses step-by-step, built with **Next.js App Router (TypeScript)**, **Tailwind CSS v4**, **Prisma ORM**, and **PostgreSQL**.

## Features

- **4 Modules, 15 Structured Lessons, 60 Quiz Questions:** Foundation (SVO, V1–V5, Helping Verbs) + Present, Past, and Future Tenses (Simple, Continuous, Perfect, Perfect Continuous).
- **Instant Guest Mode + Seamless Account Sync:** Start learning immediately without signing up (progress saved in `localStorage`). Creating an account or signing in automatically merges guest progress into PostgreSQL.
- **PostgreSQL Persistence & Server-Graded Quizzes:**
  - Server-side quiz grading (`POST /api/quiz/submit`) stored in `QuizAttempt`.
  - Preserves each learner's best score (`Math.max`) without overwriting higher scores.
  - **Quiz Answer Review Mode:** Inspect every chosen answer, correct answer, and Hinglish explanation after completing a quiz.
- **XP, Daily Streaks & Leaderboard:** Earn XP and maintain daily streaks across lessons and quizzes; view top learners on `/leaderboard`.
- **Audio Pronunciation & Customizable Preferences:** Web Speech API (`en-IN`) playback with configurable speech speed (`0.75x`–`1.15x`), daily goal settings, and recent quiz activity history on `/profile`.
- **Printable Cheat Sheet:** Clean print/PDF layout on `/cheatsheet`.

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19, TypeScript)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`)
- **Database & ORM:** PostgreSQL + Prisma 7 (`prisma`, `@prisma/client`, `@prisma/adapter-pg`, `pg`, `prisma.config.ts`)
- **Auth:** Email/Password (`bcryptjs`) + JWT `httpOnly` session cookies (`jose`)
- **Validation & Linting:** `zod` v4, `oxlint`, TypeScript `tsc --noEmit`

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure PostgreSQL & Environment Variables

Copy `.env.example` to `.env` and set your PostgreSQL connection string and JWT secret:

```bash
cp .env.example .env
```

If you want to run PostgreSQL via Docker:

```bash
docker compose up -d
```

Or use your local PostgreSQL instance and ensure the `english_sikho` database exists.

### 3. Run Prisma Migrations & Seed Curriculum

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```

The seed script populates all **4 modules**, **15 lessons**, **60 quiz questions**, and a sample demo user (`demo@englishsikho.app` / `Demo@1234`).

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful Scripts

- `npm run dev` — Start Next.js development server
- `npm run build` — Generate Prisma client and build Next.js for production
- `npm run start` — Start production server
- `npm run lint` — Run Oxlint across `src` and `prisma`
- `npm run typecheck` — Run TypeScript type checking (`tsc --noEmit`)
- `npm run db:migrate` — Run Prisma database migrations
- `npm run db:seed` — Seed curriculum & demo user into PostgreSQL
- `npm run db:studio` — Open Prisma Studio
