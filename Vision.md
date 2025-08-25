KlusQuest — Gamified Chores & Allowance for Dutch Families

One‑liner (EN): KlusQuest makes household chores feel like a game, so kids stay motivated and parents stay sane.

One‑liner (NL): KlusQuest maakt klussen leuk en overzichtelijk — kinderen spelen, ouders houden het overzicht.

Problem

Parents struggle to keep kids (7–16) consistently engaged with chores.

Existing apps feel like boring checklists; kids drop off quickly.

Allowance tracking and rewards are fragmented across notes, chats, and memory.

Vision

A playful, modern web app where chores feel like quests: kids earn XP/coins, level up avatars, and claim rewards; parents assign chores and get clarity — no nagging required.

Target Market & Languages

Market: Netherlands first; designed to work across EU.

Languages: Bilingual Dutch + English from day one. Copy must be short, emoji‑friendly, and easy to localize.

Product Pillars

Fun for kids — progress bars, levels, juicy animations 🎉

Stress‑free for parents — simple setup, clear status, sane defaults ✅

Fair rewards — coins → rewards, allowance visibility 💶

Privacy & safety — minimal data, kid PINs, parent control 🔒

MVP Scope (Weeks 1–6)

Parent Dashboard: manage kids, chores (daily/weekly/one‑off), track completion.

Kid Dashboard: today’s quest list, mark done, XP/coins.

Rewards: parent‑defined rewards; kids spend coins to claim.

Auth: parent login (email/password via Clerk/Auth.js), optional kid PIN.

Monetization: Free (≤2 kids) vs Premium (€3/mo) via Stripe.

Non‑Goals (MVP)

Push notifications, streak bonuses, chore marketplace (Phase 2).

Complex social features, public profiles, or chat.

Success Metrics

DAU/WAU of kids completing ≥1 chore/day.

Setup time: < 5 minutes to add first kid + first 3 chores.

Retention: 4‑week kid activity retention ≥ 35%.

Conversion: Free → Premium trial start ≥ 5%; trial → paid ≥ 40%.

Tech Direction

Frontend: Next.js (App Router), TailwindCSS.

Game Layer: PixiJS (WebGL renderer) embedded in Kid Dashboard for grid animations, particles, and “juicy” feedback.

Backend: API routes/Server Actions in Next.js.

DB: Prisma + SQLite (dev) / Supabase or MySQL (prod).

Auth: Clerk or Auth.js (choose one; keep adapter pattern).

Billing: Stripe (Premium €3/mo).

Deploy: Vercel (web) + Supabase (DB).

Timeline (Weeks 1–8)

W1–2: Scaffold app, Tailwind, Prisma schema, Auth. Deploy skeleton.

W3–4: Parent Dashboard + chore assignment CRUD.

W5: Kid Dashboard + XP/coins + PixiJS animations.

W6: Rewards + Stripe subscriptions.

W7–8: UI polish, i18n copy, accessibility, launch.

Principles

Keep it simple, legible, fast.

Design for touch first (mobile primary, desktop secondary).

Every action should feel good: micro‑animations, confetti, sounds (muted by default).

Optimize the first session: guided setup → first chore → first reward preview.