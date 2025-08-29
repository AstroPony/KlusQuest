# ðŸ§ª **Local Testing Guide - Week 1 Features**

## ðŸš€ **Quick Start Testing**

### **1. Start the Development Server**
```bash
pnpm dev
```
Your app will be available at: **http://localhost:3000**

---

## ðŸŽ¯ **What You Can Test Right Now (Without Clerk Keys)**

### **âœ… Working Features (No Setup Required)**

#### **1. Basic UI & Navigation**
- **Home Page**: http://localhost:3000
  - âœ… Beautiful landing page with hero section
  - âœ… Features showcase (gamified experience, rewards, bilingual)
  - âœ… Navigation buttons (will show auth state when Clerk is set up)

#### **2. Simple Kid View (No Auth Required)**
- **URL**: http://localhost:3000/kid-simple
  - âœ… Interactive chore list with 3 sample chores
  - âœ… Click "Klaar!" buttons to complete chores
  - âœ… Watch XP, coins, and level increase in real-time
  - âœ… Celebration alerts when chores are completed
  - âœ… Responsive design that works on mobile

#### **3. PixiJS Game Demo**
- **URL**: http://localhost:3000/kid
  - âœ… Interactive 6x6 grid of colored tiles
  - âœ… Click tiles to see animations and earn points
  - âœ… Score, level, and moves tracking
  - âœ… Responsive canvas that adjusts to screen size

#### **4. Database & API**
- **URL**: http://localhost:3000/api/test
  - âœ… Returns sample household data
  - âœ… Shows database connection is working
  - âœ… Displays seeded data (Demo Gezin, Demo Kid, sample chore)

---

## ðŸ” **Testing Authentication Features (Requires Clerk Setup)**

### **Prerequisites**
1. **Set up Clerk account** (follow `CLERK-SETUP.md`)
2. **Get your API keys** from Clerk dashboard
3. **Update `.env.local`** with real keys

### **What You'll Be Able to Test**

#### **1. User Registration Flow**
1. Go to http://localhost:3000
2. Click "Account Aanmaken"
3. Fill out Clerk registration form
4. Get redirected to `/onboarding`

#### **2. Complete Onboarding Flow**
1. **Role Selection**: Choose between Parent or Kid
2. **Household Creation** (if Parent): Enter family name and language
3. **Completion**: See success message and get redirected

#### **3. Protected Dashboard**
1. **URL**: http://localhost:3000/dashboard
2. **Features to test**:
   - âœ… User info display (name, email)
   - âœ… Welcome message for new users
   - âœ… Quick action buttons
   - âœ… Household overview stats
   - âœ… Sign out functionality

#### **4. Authentication State Changes**
1. **Signed Out**: See "Inloggen" and "Account Aanmaken" buttons
2. **Signed In**: See "Dashboard" and "Eenvoudige Kid View" buttons
3. **Protected Routes**: Try accessing `/dashboard` when signed out

---

## ðŸ§ª **Step-by-Step Testing Scenarios**

### **Scenario 1: New User Journey (Parent)**
1. **Start**: http://localhost:3000
2. **Sign Up**: Click "Account Aanmaken"
3. **Create Account**: Use Clerk form
4. **Onboarding**: 
   - Select "Ouder" role
   - Create household (e.g., "Familie Jansen", Dutch)
   - Complete setup
5. **Dashboard**: Land on protected dashboard
6. **Verify**: See welcome message and user info

### **Scenario 2: New User Journey (Kid)**
1. **Start**: http://localhost:3000
2. **Sign Up**: Click "Account Aanmaken"
3. **Create Account**: Use Clerk form
4. **Onboarding**: 
   - Select "Kind" role
   - Skip household creation
   - Complete setup
5. **Kid View**: Land on simple chore list
6. **Test**: Complete chores, watch XP increase

### **Scenario 3: Existing User Login**
1. **Start**: http://localhost:3000
2. **Sign In**: Click "Inloggen"
3. **Login**: Use existing credentials
4. **Redirect**: Go to appropriate page based on role

---

## ðŸ”§ **Testing Without Clerk (Mock Mode)**

If you want to test the UI without setting up Clerk, you can temporarily modify the auth check:

### **Option 1: Bypass Auth Check**
In `app/page.tsx`, temporarily change:
```tsx
// From:
const { userId } = await auth();

// To:
const userId = "mock-user-id"; // This will show authenticated state
```

### **Option 2: Test Individual Components**
You can test the onboarding flow directly:
- **URL**: http://localhost:3000/onboarding
- **Features**: Role selection, household creation, completion

---

## ðŸ“± **Mobile Testing**

### **Responsive Design Testing**
1. **Open DevTools** (F12)
2. **Toggle Device Toolbar** (Ctrl+Shift+M)
3. **Test different screen sizes**:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1200px+)

### **Touch Interactions**
- **Kid View**: Test tile tapping on mobile
- **Forms**: Test input fields and buttons
- **Navigation**: Test menu interactions

---

## ðŸ› **Common Issues & Solutions**

### **Build Errors**
```bash
# If you get Clerk-related build errors:
pnpm build

# Solution: Set up Clerk keys or use mock mode
```

### **Runtime Errors**
```bash
# If Clerk throws "invalid key" errors:
# Solution: Update .env.local with real Clerk keys
```

### **Database Issues**
```bash
# If API test fails:
pnpm prisma:generate
pnpm prisma:migrate --name init
pnpm exec tsx prisma/seed.ts
```

---

## ðŸ“Š **Testing Checklist**

### **Week 1 Features - Test Status**
- [ ] **Home Page**: Landing page loads correctly
- [ ] **Navigation**: Buttons show correct state
- [ ] **Simple Kid View**: Chore completion works
- [ ] **PixiJS Demo**: Game interactions work
- [ ] **Database API**: Sample data returns correctly
- [ ] **Authentication**: Sign up/in flows work
- [ ] **Onboarding**: Role selection and household creation
- [ ] **Dashboard**: Protected route with user info
- [ ] **Responsive Design**: Works on mobile/tablet

---

## ðŸŽ¯ **What to Test Next (Week 2 Preview)**

Once Week 1 is working, you'll be able to test:
- **Real household creation** (connected to database)
- **User-database linking** (Clerk users in Prisma)
- **Chore management** (create, edit, delete)
- **Kid management** (add, edit, remove kids)

---

## ðŸš€ **Quick Commands**

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Type check
pnpm typecheck

# Database operations
pnpm prisma:generate
pnpm prisma:migrate
pnpm exec tsx prisma/seed.ts

# Test API endpoint
curl http://localhost:3000/api/test
```

---

## ðŸ’¡ **Pro Tips**

1. **Use Browser DevTools** to inspect network requests
2. **Check Console** for any JavaScript errors
3. **Test on Different Devices** to ensure responsiveness
4. **Clear Browser Cache** if you see stale data
5. **Use Incognito Mode** to test fresh user sessions

---

**Happy Testing! ðŸŽ‰** 

Once you have Clerk set up, you'll have a fully functional authentication and onboarding system to test! 

