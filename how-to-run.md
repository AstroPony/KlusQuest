Canonical Setup Guide

This is the canonical quick start and setup guide. For a high-level map of all docs, see `DOCS-OVERVIEW.md`.

Quick Start

1) Prereqs
- Node 20+
- pnpm
- Git + GitHub account

2) Clone & Install
git clone <repo-url>
cd klusquest
pnpm install

3) Environment Variables (`.env.local`)

# Database (dev)
DATABASE_URL="file:./dev.db"

# Auth (choose one)
# Clerk (preferred)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
# or Auth.js
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # optional locally

# i18n
NEXT_PUBLIC_DEFAULT_LOCALE="nl"
NEXT_PUBLIC_SUPPORTED_LOCALES="nl,en"

4) Database (SQLite for dev)
pnpm prisma:generate
pnpm prisma:migrate --name init
pnpm exec prisma db seed   # if seeding is provided

5) Run Dev Server
pnpm dev
# http://localhost:3000

Services & Testing

- Auth: Prefer Clerk. See `CLERK-SETUP.md`.
- E2E Tests: See `E2E-TESTING-SUMMARY.md` and `tests/e2e/README.md`.

MVP Happy Path (manual)

- Create parent account → land on Parent Dashboard
- Add kid → add 3 chores (daily/weekly/one‑off)
- Open Kid Dashboard → see today’s quest list
- Mark chore as done → XP/coins increment; PixiJS completion burst
- Add reward → spend coins → parent approves

Useful Commands

pnpm dev                # start dev server
pnpm build              # production build
pnpm lint               # lint
pnpm typecheck          # TypeScript
pnpm prisma:generate    # Prisma client
pnpm prisma:migrate --name <name>   # migrate
pnpm exec tsx prisma/seed.ts        # seed (if available)
pnpm test:e2e           # E2E tests
pnpm test:e2e:ui        # E2E with UI
pnpm test:e2e:report    # E2E HTML report

Troubleshooting

- White canvas / no Pixi: ensure component is client-side ("use client"), check WebGL support
- Fonts/icons missing: verify `/public` assets and Tailwind config
- Auth redirect loops: confirm env vars and callback URLs

Optional: Supabase + Vercel

- Create Supabase project; set DATABASE_URL (prod) in Vercel
- Add STRIPE + AUTH envs in Vercel dashboard
- Connect GitHub → Vercel auto‑deploys on main

Related Docs

- Overview: `DOCS-OVERVIEW.md`
- Project Status: `PROJECT-STATUS.md`
- Roadmap: `TODO.md`
- User Journeys: `USER_JOURNEY_ANALYSIS.md`

