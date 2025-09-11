# KlusQuest

Gamified chores & allowance tracker for Dutch families.

## Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up the database:**
   ```bash
   pnpm prisma:generate
   pnpm prisma:migrate --name init
   ```

3. **Run the development server:**
   ```bash
   pnpm dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)**

## Features

**Kid View**: Simple dashboard for chores, progress and rewards
- **Parent Dashboard**: Manage kids, chores, and rewards
- **Bilingual**: Dutch + English support
- **Modern Stack**: Next.js 14, TypeScript, Tailwind CSS, Prisma

## Project Structure

```
/app
  /(public)          # Public routes
  /dashboard         # Parent dashboard
  /kid-simple       # Simple kid dashboard
  /api              # API routes
/components
  /ui               # Reusable UI components
  
/lib
  /auth             # Authentication logic
  /db               # Database utilities
  /i18n             # Internationalization
  
/prisma             # Database schema
```

## Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm typecheck` - Run TypeScript checks
- `pnpm lint` - Run ESLint
- `pnpm prisma:migrate` - Run database migrations

## Commands Reference

- Setup: `pnpm install`
- Dev server: `pnpm dev`
- Start (prod build): `pnpm start`
- Build: `pnpm build`
- Lint: `pnpm lint`
- Typecheck: `pnpm typecheck`
- Prisma generate: `pnpm prisma:generate`
- Prisma migrate: `pnpm prisma:migrate --name <name>`
- Seed database: `pnpm db:seed` or `pnpm exec tsx prisma/seed.ts`
- E2E tests: `pnpm test:e2e`, UI: `pnpm test:e2e:ui`, report: `pnpm test:e2e:report`

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom design tokens
 
- **Database**: Prisma with SQLite (dev) / Supabase/MySQL (prod)
- **Authentication**: Clerk (integrated)
- **Payments**: Stripe (to be implemented)

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```env
DATABASE_PROVIDER=sqlite
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_DEFAULT_LOCALE=nl
NEXT_PUBLIC_SUPPORTED_LOCALES=nl,en
```

## Documentation

- Getting Started: `how-to-run.md`
- Overview: `DOCS-OVERVIEW.md`
- E2E Testing Summary: `E2E-TESTING-SUMMARY.md`
- E2E Tests Guide: `tests/e2e/README.md`
- Coding Standards: `Coding-Standards.md`
- Style Guide: `Style-Guide.md`
- Project Status: `PROJECT-STATUS.md`
- TODOs & Roadmap: `TODO.md`
- User Journeys: `USER_JOURNEY_ANALYSIS.md`

## Next Steps

1. Implement authentication (Clerk/Auth.js)
2. Add chore management CRUD operations
3. Enhance kid experience with simple mini-games (optional)
4. Add Stripe subscription handling
5. Implement i18n with next-intl 
