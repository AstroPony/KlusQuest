# KlusQuest Quick Start

This quick start is simplified. For the canonical, detailed setup guide, see `how-to-run.md`.

Get Running in 3 Steps

1) Install
```bash
pnpm install
```

2) Database
```bash
pnpm prisma:generate
pnpm prisma:migrate --name init
pnpm exec tsx prisma/seed.ts   # if available
```

3) Start
```bash
pnpm dev
```

Open your browser:
- Home: http://localhost:3000
- Kid View: http://localhost:3000/kid
- Dashboard: http://localhost:3000/dashboard
- API Test: http://localhost:3000/api/test

More Docs
- Canonical Setup: `how-to-run.md`
- E2E Testing Overview: `E2E-TESTING-SUMMARY.md`
- E2E Tests Guide: `tests/e2e/README.md`

