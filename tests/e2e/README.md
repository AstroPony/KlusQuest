# E2E Tests — Quick Start

For full details and coverage, see `E2E-TESTING-SUMMARY.md`.

## Commands

```bash
pnpm test:e2e         # run all tests
pnpm test:e2e:ui      # interactive UI
pnpm test:e2e:headed  # run headed
pnpm test:e2e:debug   # debug mode
pnpm test:e2e:report  # open HTML report
```

## Tips

- Single file: `pnpm exec playwright test auth.spec.ts`
- Grep: `pnpm exec playwright test --grep "should add kid"`
- Browser: `pnpm exec playwright test --project=chromium`

Related: `how-to-run.md` for environment setup.

