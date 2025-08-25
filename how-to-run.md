Prereqs

Node 20+

pnpm (recommended) or npm

Git + GitHub account

1) Clone & Install
git clone <repo-url>
cd klusquest
pnpm install
2) Environment Variables

Create .env.local with placeholders:

# Database (dev)
DATABASE_URL="file:./dev.db"


# Auth (choose one)
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
# or Auth.js
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"


# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # optional for local


# i18n
NEXT_PUBLIC_DEFAULT_LOCALE="nl"
NEXT_PUBLIC_SUPPORTED_LOCALES="nl,en"
3) Database (SQLite for dev)
pnpx prisma migrate dev --name init
pnpx prisma db seed   # if seeding is provided
4) Run Dev Server
pnpm dev
# http://localhost:3000
5) Mocked Services (for first run)

Auth: Use Clerk dev browser or mock session provider.

Stripe: Use test keys; no webhooks required for basic flows.

6) Test Plan (MVP happy paths)

Create parent account → land on Parent Dashboard.

Add kid (NL/EN names ok) → add 3 chores (daily/weekly/one‑off).

Open Kid Dashboard → see today’s quest list.

Mark chore as done → XP/coins increment; PixiJS shows completion burst.

Add reward → spend coins to claim → parent approves.

7) Running Tests
pnpm test          # unit/component (Vitest/Jest)
pnpm test:e2e      # Playwright
pnpm lint && pnpm typecheck && pnpm build
8) Troubleshooting

White canvas / no Pixi: ensure component is client‑side ("use client"), check WebGL support.

Fonts/icons missing: verify /public assets and Tailwind config.

Auth redirect loops: confirm env vars and callback URLs.

9) Optional: Supabase + Vercel

Create Supabase project; set DATABASE_URL (prod) in Vercel.

Add STRIPE + AUTH envs in Vercel dashboard.

Set up GitHub → Vercel auto‑deploys on main.