# KlusQuest Documentation Overview

## Purpose & Scope
- App: Gamified chores and allowance tracker for Dutch families.
- Users: Parents manage chores/rewards; kids complete chores, earn XP/coins.
- Stack: Next.js 14, TypeScript, Tailwind, Prisma, PixiJS; Clerk auth; Stripe planned.

## Getting Started
- Install: `pnpm install`
- DB: `pnpm prisma:generate` then `pnpm prisma:migrate --name init`
- Run: `pnpm dev` â†’ open `http://localhost:3000`
- Env: see `README.md` and `how-to-run.md` for required vars.

## Project Status
- Foundation: Next.js, TS strict, Tailwind, ESLint/Prettier configured.
- Auth: Clerk integrated; sign-in/up and protected dashboard implemented.
- Core: Chores CRUD, kid dashboard connection, rewards (phase 2) documented.
- Testing: Playwright E2E suite documented with multi-browser setup.

## Key Docs
- `README.md`: Primary quick start, features, structure, environment.
- `how-to-run.md`: Detailed setup, env, DB, commands, troubleshooting.
- `QUICK-START.md`: Expanded walkthrough and examples.
- `PROJECT-STATUS.md` / `TODO.md`: Roadmap and progress checklists.
- `E2E-TESTING-SUMMARY.md` / `tests/e2e/README.md`: E2E coverage and commands.
- `Coding-Standards.md` / `Style-Guide.md`: Engineering and design conventions.
- `USER_JOURNEY_ANALYSIS.md`: Navigation audit; zero dead-ends claimed.

## Notable Observations
- Package manager: Standardized docs to pnpm across guides and tests.
- Encoding: Removed mojibake characters from Markdown files.
- Duplication: QUICK-START overlaps with testing docs; consider consolidating.
- Auth path: Clerk chosen; references to Auth.js remain as optionalâ€”keep consistent.

## Next Documentation Improvements
- Consolidate QUICK-START with `how-to-run.md` to reduce redundancy.
- Add a short â€œCommands Referenceâ€ section in `README.md` for pnpm tasks.
- Ensure one canonical seed command (e.g., `pnpm exec tsx prisma/seed.ts`).
- Add links between docs (status â†’ quick start â†’ testing) for discovery.




