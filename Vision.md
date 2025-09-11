﻿KlusQuest â€” Gamified Chores & Allowance for Dutch Families

Oneâ€‘liner (EN): KlusQuest makes household chores feel like a game, so kids stay motivated and parents stay sane.

Oneâ€‘liner (NL): KlusQuest maakt klussen leuk en overzichtelijk â€” kinderen spelen, ouders houden het overzicht.

Problem

Parents struggle to keep kids (7â€“16) consistently engaged with chores.

Existing apps feel like boring checklists; kids drop off quickly.

Allowance tracking and rewards are fragmented across notes, chats, and memory.

Vision

A playful, modern web app where chores feel like quests: kids earn XP/coins, level up avatars, and claim rewards; parents assign chores and get clarity â€” no nagging required.

Target Market & Languages

Market: Netherlands first; designed to work across EU.

Languages: Bilingual Dutch + English from day one. Copy must be short, emojiâ€‘friendly, and easy to localize.

Product Pillars

Fun for kids â€” progress bars, levels, juicy animations ðŸŽ‰

Stressâ€‘free for parents â€” simple setup, clear status, sane defaults âœ…

Fair rewards â€” coins â†’ rewards, allowance visibility ðŸ’¶

Privacy & safety â€” minimal data, kid PINs, parent control ðŸ”’

MVP Scope (Weeks 1â€“6)

Parent Dashboard: manage kids, chores (daily/weekly/oneâ€‘off), track completion.

Kid Dashboard: todayâ€™s quest list, mark done, XP/coins.

Rewards: parentâ€‘defined rewards; kids spend coins to claim.

Auth: parent login (email/password via Clerk/Auth.js), optional kid PIN.

Monetization: Free (â‰¤2 kids) vs Premium (â‚¬3/mo) via Stripe.

Nonâ€‘Goals (MVP)

Push notifications, streak bonuses, chore marketplace (Phase 2).

Complex social features, public profiles, or chat.

Success Metrics

DAU/WAU of kids completing â‰¥1 chore/day.

Setup time: < 5 minutes to add first kid + first 3 chores.

Retention: 4â€‘week kid activity retention â‰¥ 35%.

Conversion: Free â†’ Premium trial start â‰¥ 5%; trial â†’ paid â‰¥ 40%.

Tech Direction

Frontend: Next.js (App Router), TailwindCSS.

Game Layer: PixiJS (WebGL renderer) embedded in Kid Dashboard for grid animations, particles, and â€œjuicyâ€ feedback.

Backend: API routes/Server Actions in Next.js.

DB: Prisma + SQLite (dev) / Supabase or MySQL (prod).

Auth: Clerk or Auth.js (choose one; keep adapter pattern).

Billing: Stripe (Premium â‚¬3/mo).

Deploy: Vercel (web) + Supabase (DB).

Timeline (Weeks 1â€“8)

W1â€“2: Scaffold app, Tailwind, Prisma schema, Auth. Deploy skeleton.

W3â€“4: Parent Dashboard + chore assignment CRUD.

W5: Kid Dashboard + XP/coins + PixiJS animations.

W6: Rewards + Stripe subscriptions.

W7â€“8: UI polish, i18n copy, accessibility, launch.

Principles

Keep it simple, legible, fast.

Design for touch first (mobile primary, desktop secondary).

Every action should feel good: microâ€‘animations, confetti, sounds (muted by default).

Optimize the first session: guided setup â†’ first chore â†’ first reward preview.

