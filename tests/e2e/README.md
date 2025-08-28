# 🧪 E2E Testing with Playwright

This directory contains comprehensive end-to-end tests for KlusQuest, covering all user journeys and functionality.

## 🚀 Quick Start

### Run All Tests
```bash
npm run test:e2e
```

### Run Tests with UI
```bash
npm run test:e2e:ui
```

### Run Tests in Headed Mode (see browser)
```bash
npm run test:e2e:headed
```

### Debug Tests
```bash
npm run test:e2e:debug
```

### View Test Report
```bash
npm run test:e2e:report
```

## 📁 Test Structure

### `auth.spec.ts` - Authentication & User Management
- ✅ Sign-in/Sign-up flows
- ✅ Protected route access
- ✅ User authentication state
- ✅ Sign-out functionality

### `home.spec.ts` - Home Page & Navigation
- ✅ Hero section and messaging
- ✅ Feature showcase
- ✅ Navigation buttons
- ✅ Responsive design
- ✅ Accessibility features

### `kid-view.spec.ts` - PixiJS Game Experience
- ✅ Game canvas rendering
- ✅ Game interactions (click/touch)
- ✅ Score and level tracking
- ✅ Reset functionality
- ✅ Mobile responsiveness
- ✅ Navigation back to dashboard

### `kid-simple.spec.ts` - Simple Kid Dashboard
- ✅ Chore list display
- ✅ XP/coins/level stats
- ✅ Chore completion workflow
- ✅ Celebration animations
- ✅ Progress tracking
- ✅ Mobile optimization

### `chores.spec.ts` - Chore Management System
- ✅ Create new chores
- ✅ Edit existing chores
- ✅ Delete chores
- ✅ Form validation
- ✅ Kid assignment
- ✅ Frequency options
- ✅ XP/coin configuration

### `parent-dashboard.spec.ts` - Parent Dashboard
- ✅ Household overview with stats
- ✅ Kid management (add/edit/delete)
- ✅ Avatar selection
- ✅ Progress tracking
- ✅ Chore approval system
- ✅ Quick actions navigation
- ✅ Mobile responsiveness

### `api.spec.ts` - API Endpoint Testing
- ✅ Authentication requirements
- ✅ Error handling
- ✅ Request validation
- ✅ Response structure
- ✅ Edge case handling

## 🎯 Test Coverage

### **User Journeys Tested:**
1. **New User Onboarding**
   - Home page → Sign up → Dashboard
   - First kid creation
   - First chore creation

2. **Parent Workflow**
   - Add multiple kids
   - Create and assign chores
   - Monitor progress and stats
   - Approve chore completions

3. **Kid Experience**
   - View assigned chores
   - Complete chores for XP/coins
   - Play PixiJS game
   - Track progress

4. **System Integration**
   - Database operations
   - API endpoint functionality
   - Real-time updates
   - Error handling

### **Quality Assurance:**
- ✅ **Responsiveness**: Mobile and desktop layouts
- ✅ **Accessibility**: Screen reader support, keyboard navigation
- ✅ **Performance**: Loading states, error boundaries
- ✅ **Security**: Authentication, authorization
- ✅ **Data Integrity**: Form validation, API responses

## 🔧 Test Configuration

### **Playwright Config** (`playwright.config.ts`)
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Base URL**: `http://localhost:3001`
- **Parallel Execution**: Enabled for faster testing
- **Screenshots**: On failure
- **Videos**: On failure
- **Traces**: On first retry

### **Test Environment**
- **Database**: SQLite with seeded test data
- **Authentication**: Mocked Clerk integration
- **API**: Full backend testing with real endpoints

## 🚨 Important Notes

### **Authentication Mocking**
Since we're testing without real Clerk keys, tests use mocked authentication:
```typescript
await page.addInitScript(() => {
  (window as any).__CLERK_FRONTEND_API = 'mock';
  (window as any).__CLERK_PUBLISHABLE_KEY = 'mock';
});
```

### **Database State**
Tests assume a clean database state. The `db:seed` script provides consistent test data.

### **Async Operations**
Many tests include `waitForTimeout()` calls to handle animations and API responses. In production, these should be replaced with proper wait conditions.

## 🐛 Troubleshooting

### **Tests Failing?**
1. **Check dev server**: Ensure `npm run dev` is running on port 3001
2. **Database state**: Run `npm run db:seed` to reset test data
3. **Browser issues**: Try `npm run test:e2e:headed` to see what's happening

### **Common Issues**
- **Port conflicts**: Change port in `playwright.config.ts`
- **Database locks**: Restart dev server
- **Authentication errors**: Check mocked Clerk setup

## 📊 Test Results

After running tests, view the HTML report:
```bash
npm run test:e2e:report
```

The report shows:
- ✅ Passed tests
- ❌ Failed tests with screenshots
- 📹 Video recordings of failures
- 🔍 Detailed error information

## 🎉 Success Metrics

**Target Coverage**: 100% of user journeys
**Performance**: All tests complete in <5 minutes
**Reliability**: 99%+ pass rate on CI/CD

---

**Happy Testing! 🧪✨** 