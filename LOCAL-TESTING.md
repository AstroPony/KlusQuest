# Local Testing Guide

## Quick start
1. Install dependencies with `pnpm install`
2. Apply Prisma migrations: `pnpm prisma:generate` then `pnpm prisma:migrate --name init`
3. Start the dev server: `pnpm dev`
4. Visit http://localhost:3000

## What works without secrets
- Home page navigation and marketing content
- Simple kid dashboard at `/kid-simple` with mock chores, XP, and coin tracking
- PixiJS game demo at `/kid`
- API connectivity check at `/api/test`

## Enabling Clerk locally
1. Follow `CLERK-SETUP.md` to create an application
2. Copy your publishable and secret keys into `.env.local`
3. Restart `pnpm dev` and sign in or sign up on the home page
4. Complete onboarding to reach the parent dashboard or kid space

## Flows to smoke test
- New parent: home -> sign up -> onboarding -> dashboard
- New kid: invitation link -> kid dashboard -> complete chore -> reward flow
- Parent review: dashboard -> approve chore -> reward catalog -> approve reward

## Useful commands
- `pnpm build` - compile production bundle
- `pnpm lint` / `pnpm typecheck` - static checks
- `pnpm test:e2e` - full Playwright suite
- `pnpm test:e2e:ui` - run tests with the Playwright UI

## Troubleshooting
- Auth redirect loops: confirm Clerk keys and allowed origins
- Empty dashboards: run migrations and seed data if required
- PixiJS canvas blank: ensure browser WebGL is enabled or try another browser
- E2E failures: run `pnpm test:e2e --project=chromium --debug` for verbose logs