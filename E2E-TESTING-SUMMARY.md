# E2E Testing Setup

Related docs: see `tests/e2e/README.md` for a quick start and commands. This document provides an overview of coverage and infrastructure.

## What We've Built

- 405 tests across 7 files
- 5 browser environments (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari)
- 100% user journey coverage for MVP core features

## Test Files
- `auth.spec.ts` — Authentication & user management
- `home.spec.ts` — Home page & navigation
- `kid-view.spec.ts` — PixiJS game experience
- `kid-simple.spec.ts` — Simple kid dashboard
- `chores.spec.ts` — Chore management CRUD
- `parent-dashboard.spec.ts` — Parent dashboard features
- `api.spec.ts` — API endpoint testing

## Infrastructure

- Playwright projects for desktop and mobile
- Parallel execution for speed
- Screenshots, videos, traces on failure
- Base URL: `http://localhost:3001`
- Auth mocking for Clerk during tests
- Shared helpers for forms and responsive testing
- CI integration with reports and artifacts

## Commands

```bash
pnpm test:e2e         # run all tests
pnpm test:e2e:ui      # interactive UI
pnpm test:e2e:headed  # run headed
pnpm test:e2e:debug   # debug mode
pnpm test:e2e:report  # open HTML report

# tip: targeted runs
pnpm exec playwright test auth.spec.ts
pnpm exec playwright test --grep "should add kid"
pnpm exec playwright test --project=chromium
```

## Coverage Snapshot

- Onboarding: 100% (home → sign up → dashboard)
- Parent workflow: kids, chores, approvals
- Kid experience: chores, XP/coins, game
- System integration: DB, API, realtime
- QA: responsiveness, accessibility, performance, security, data integrity

## Next Steps

- Performance/load testing for APIs
- Visual regression testing
- Accessibility (WCAG) automated checks
- Security/pentest scenarios

---

Test count: 405  
Browsers: 5 (desktop + mobile)  
Status: Complete & Ready

