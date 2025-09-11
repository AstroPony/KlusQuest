# Clerk Authentication Setup Guide

## Step 1: Create Clerk Account

1. Go to https://dashboard.clerk.com/
2. Click "Sign up" and create an account
3. Verify your email

## Step 2: Create New Application

1. Click "Add application"
2. Choose "Next.js" as your framework
3. Name it: `KlusQuest`
4. Click "Create application"

## Step 3: Get Your API Keys

1. In your new application, open "API Keys"
2. Copy the Publishable Key (starts with `pk_...`)
3. Copy the Secret Key (starts with `sk_...`)

## Step 4: Update Environment Variables

Add to `.env.local` (or `.env` in this repo):

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_YOUR_KEY_HERE"
CLERK_SECRET_KEY="sk_test_YOUR_SECRET_HERE"
```

## Step 5: Configure Allowed Origins

1. In Clerk dashboard, go to Settings -> Domains
2. Add `http://localhost:3000` for development
3. Add your production domain when ready

## Step 6: Test Authentication

1. Restart the dev server: `npm run dev`
2. Visit http://localhost:3000
3. Use the sign-in/sign-up to test

## Step 7: Enable Clerk Middleware

Update `middleware.ts` if you want to protect routes:

```ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/api/test", "/sign-in", "/sign-up"],
  ignoredRoutes: ["/api/webhook/clerk"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

## Troubleshooting

- Ensure keys are correct and loaded (restart after editing .env)
- Add localhost to Clerk Domains
- Check browser console and server logs for errors

## Next Steps

- Create the first parent account
- Set up a household
- Add a kid and some chores
