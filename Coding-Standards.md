Stack & Versions

Language: TypeScript strict mode.

Framework: Next.js (App Router).

UI: TailwindCSS + Headless UI/shadcn when helpful.

Game: PixiJS 7+.

DB: Prisma 5+ with SQLite (dev), Supabase/MySQL (prod).

Auth: Clerk or Auth.js (choose; wrap with an AuthProvider interface).

Payments: Stripe.

Project Structure (suggested)
/ app
  /(public)
  /dashboard
  /kid
  /api
/components
  /ui
  /pixi
/lib
  auth/
  db/
  i18n/
  pixi/
/prisma
/public
/scripts
/tests
TypeScript

"strict": true, no any in committed code.

Prefer Zod for runtime validation at boundaries (API routes, forms).

Reuse domain types across client/server via @types folder or module exports from /lib.

React & Next.js

App Router, Server Components by default; Client Components only when needed (Pixi, interactive UI, forms with local state).

Co-locate component styles; keep components small and pure.

Use Server Actions for simple mutations where feasible.

Data fetching via async server components or tRPC/HTTP (keep it simple for MVP).

PixiJS Integration

Encapsulate Pixi in a Client Component: <PixiBoard /> under /components/pixi.

Never mutate React state inside Pixi game loop; bridge via a small event bus (RxJS or custom emitter) and props for initial config.

Use a GameModel (plain TS) for grid logic; Pixi renders from that model. Keep logic renderer‑agnostic.

Ensure devicePixelRatio handling for crispness; throttle effects on low‑end devices.

Styling

Tailwind for spacing/layout; extract repetitive patterns to @apply utilities or components under /components/ui.

Use CSS variables for theme tokens (colors, radii) to allow day/night themes later.

State & Data

Minimal global state; prefer server data + component state. If needed, use Zustand/Jotai for lightweight client state.

All server calls validated with Zod. Return typed DTOs only.

i18n

Use next-intl or @lingui with ICU messages. Store copy under /lib/i18n/{nl,en}.json.

No hardcoded strings in components; use translation hooks.

Testing

Unit: Vitest/Jest for pure TS (GameModel, utils).

Component: Testing Library + JSDOM.

E2E: Playwright for flows (setup → add kid → add chore → complete chore → claim reward).

Linting & Formatting

ESLint (Next + TS + security), Prettier. CI must fail on lint/test.

Security & Privacy

Use role checks on server (parent vs kid).

PII minimal; no public kid names in URLs. Use IDs/slug hashes.

Rate‑limit mutation routes; CSRF for non-GET where applicable.

Git & CI

Conventional Commits (feat:, fix:, chore:).

PRs must include screenshots/gifs for UI changes.

GitHub Actions: typecheck, lint, test, build on PRs.