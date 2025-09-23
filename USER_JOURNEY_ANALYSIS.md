# KlusQuest User Journey Analysis

## Navigation overview

### Home (/)
- Entry point for parents and kids
- Links to dashboard, kid view, game demo, onboarding, and auth
- All calls to action resolve to live routes

### Dashboard (/dashboard)
- Parent control center with navigation back to home, kid view, chores, and rewards
- Guarded by Clerk; redirects unauthenticated users to sign-in

### Chores (/chores)
- Accessible from dashboard
- Provides links back to home and dashboard

### Kid experiences
- /kid-simple: simplified kid list with navigation back to home and dashboard
- /kid: PixiJS game demo, also links back to home and dashboard

### Onboarding (/onboarding)
- Guides new users through role selection and household setup
- Successful completion routes parents to the dashboard

### Kid access links (/kid-access/[token])
- Tokenised entry point for dedicated kid devices
- Includes logout path back to home

## Components
- Reward and game components ship with breadcrumbs so users can always step back
- Global header exposes home/dashboard links across breakpoints

## Journey highlights
- Parent: home -> sign up -> onboarding -> dashboard -> manage kids/chores -> review rewards
- Kid: home or invite -> kid dashboard -> complete chores -> earn rewards -> return to dashboard
- Every route includes at least one exit path; no dead ends identified during review

## Future enhancements
- Add breadcrumb history so kids can jump to their previous screen quickly
- Offer contextual suggestions (e.g. "Add your first reward" after onboarding)
- Consider keyboard shortcuts for power parents once workflows stabilise
