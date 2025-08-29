﻿# ðŸ” Clerk Authentication Setup Guide

## ðŸš€ **Step 1: Create Clerk Account**

1. Go to [https://dashboard.clerk.com/](https://dashboard.clerk.com/)
2. Click "Sign up" and create an account
3. Verify your email

## ðŸ—ï¸ **Step 2: Create New Application**

1. Click "Add application"
2. Choose "Next.js" as your framework
3. Give it a name: `KlusQuest`
4. Click "Create application"

## ðŸ”‘ **Step 3: Get Your API Keys**

1. In your new application, go to **API Keys** in the sidebar
2. Copy the **Publishable Key** (starts with `pk_test_...`)
3. Copy the **Secret Key** (starts with `sk_test_...`)

## âš™ï¸ **Step 4: Update Environment Variables**

Replace the placeholder values in your `.env.local` file:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_YOUR_ACTUAL_KEY_HERE"
CLERK_SECRET_KEY="sk_test_YOUR_ACTUAL_SECRET_HERE"
```

## ðŸŒ **Step 5: Configure Allowed Origins**

1. In Clerk dashboard, go to **Settings** â†’ **Domains**
2. Add your development domain: `http://localhost:3000`
3. Add your production domain when ready

## ðŸ§ª **Step 6: Test Authentication**

1. Restart your development server: `pnpm dev`
2. Go to [http://localhost:3000](http://localhost:3000)
3. Click "Account Aanmaken" to test sign-up
4. Try logging in with your new account

## ðŸ”§ **Step 7: Enable Clerk Middleware**

Once Clerk is working, update your `middleware.ts`:

```typescript
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/api/test", "/sign-in", "/sign-up"],
  ignoredRoutes: ["/api/webhook/clerk"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

## âœ… **What You'll Get**

- **User Registration & Login**: Beautiful, customizable forms
- **Email Verification**: Automatic email verification
- **Password Management**: Secure password reset flows
- **User Profiles**: Built-in user profile management
- **Session Management**: Secure session handling
- **Multi-factor Auth**: Optional 2FA support

## ðŸš¨ **Troubleshooting**

### **Build Errors**
- Make sure your API keys are correct
- Restart the dev server after updating `.env.local`
- Check that keys start with `pk_test_` and `sk_test_`

### **Runtime Errors**
- Verify your domain is in the allowed origins
- Check browser console for CORS errors
- Ensure environment variables are loaded

### **Authentication Issues**
- Clear browser cookies/localStorage
- Check Clerk dashboard for user creation
- Verify email verification if enabled

## ðŸŽ¯ **Next Steps After Setup**

1. **Test user registration and login**
2. **Build household creation flow**
3. **Connect users to database records**
4. **Implement role-based access control**

---

**Need Help?** Check [Clerk Documentation](https://clerk.com/docs) or their [Discord community](https://discord.gg/clerk) 
