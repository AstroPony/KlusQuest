# KlusQuest TODO

## Launch checklist (active)
- [ ] Provision the production Postgres database (Supabase or Neon) and update `DATABASE_URL`/`DIRECT_URL`
- [ ] Configure Vercel environment variables (`CLERK_SECRET_KEY`, `NEXT_PUBLIC_APP_URL`, Stripe secrets, analytics keys)
- [ ] Register the Vercel domain inside Clerk and add the webhook secret to both Vercel and the app
- [ ] Run `pnpm build`, `pnpm lint`, and `pnpm test:e2e` against production-like data before the first deploy
- [ ] Enable monitoring/alerting (Sentry, Vercel Analytics) and set up a minimal on-call contact
- [ ] Draft release notes plus a support email template for beta families

## Nice-to-have before GA
- [ ] Seed production with a demo household and kid for quick validation
- [ ] Add a short onboarding checklist inside the parent dashboard
- [ ] Publish privacy and terms copy alongside the marketing page

## Backlog (Phase 2+)

### Notifications & engagement
- [ ] Push notifications for daily quests
- [ ] Email reminders to parents/kids
- [ ] Streak bonuses and daily challenges

### Social & collaboration
- [ ] Family leaderboards
- [ ] Chore sharing between households
- [ ] Achievement sharing and kid shout-outs
- [ ] Lightweight family chat

### Monetisation & rewards
- [ ] Stripe subscriptions (free vs premium tiers)
- [ ] Premium chore packs and family bundles
- [ ] Managed payment processing flow

### Platform enhancements
- [ ] Multi-language routing with next-intl (NL/EN)
- [ ] PWA install prompt and tuned service worker caching
- [ ] Offline-first kid flow with sync plus optimistic UI
- [ ] Observability dashboard for core metrics

## Completed milestones
- [x] Authentication system (Clerk) with onboarding and role management
- [x] Parent dashboard covering kids, chores, approvals, and analytics
- [x] Kid dashboards (simple + PixiJS game) with XP/coin economy
- [x] Rewards catalog with approval workflow and categories
- [x] Playwright E2E infrastructure (405 tests across 5 browsers) integrated in CI
- [x] Tailwind-based design system, responsive layouts, and animation polish

_Last reviewed: prepare for Vercel launch_