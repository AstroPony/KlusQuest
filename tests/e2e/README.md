﻿# ðŸ§ª E2E Testing with Playwright

This directory contains comprehensive end-to-end tests for KlusQuest, covering all user journeys and functionality.

## ðŸš€ Quick Start

### Run All Tests
```bash
pnpm test:e2e
```

### Run Tests with UI
```bash
pnpm test:e2e:ui
```

### Run Tests in Headed Mode (see browser)
```bash
pnpm test:e2e:headed
```

### Debug Tests
```bash
pnpm test:e2e:debug
```

### View Test Report
```bash
pnpm test:e2e:report
```

## ðŸ“ Test Structure

### `auth.spec.ts` - Authentication & User Management
- âœ… Sign-in/Sign-up flows
- âœ… Protected route access
- âœ… User authentication state
- âœ… Sign-out functionality

### `home.spec.ts` - Home Page & Navigation
- âœ… Hero section and messaging
- âœ… Feature showcase
- âœ… Navigation buttons
- âœ… Responsive design
- âœ… Accessibility features

### `kid-view.spec.ts` - PixiJS Game Experience
- âœ… Game canvas rendering
- âœ… Game interactions (click/touch)
- âœ… Score and level tracking
- âœ… Reset functionality
- âœ… Mobile responsiveness
- âœ… Navigation back to dashboard

### `kid-simple.spec.ts` - Simple Kid Dashboard
- âœ… Chore list display
- âœ… XP/coins/level stats
- âœ… Chore completion workflow
- âœ… Celebration animations
- âœ… Progress tracking
- âœ… Mobile optimization

### `chores.spec.ts` - Chore Management System
- âœ… Create new chores
- âœ… Edit existing chores
- âœ… Delete chores
- âœ… Form validation
- âœ… Kid assignment
- âœ… Frequency options
- âœ… XP/coin configuration

### `parent-dashboard.spec.ts` - Parent Dashboard
- âœ… Household overview with stats
- âœ… Kid management (add/edit/delete)
- âœ… Avatar selection
- âœ… Progress tracking
- âœ… Chore approval system
- âœ… Quick actions navigation
- âœ… Mobile responsiveness

### `api.spec.ts` - API Endpoint Testing
- âœ… Authentication requirements
- âœ… Error handling
- âœ… Request validation
- âœ… Response structure
- âœ… Edge case handling

## ðŸŽ¯ Test Coverage

### **User Journeys Tested:**
1. **New User Onboarding**
   - Home page â†’ Sign up â†’ Dashboard
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
- âœ… **Responsiveness**: Mobile and desktop layouts
- âœ… **Accessibility**: Screen reader support, keyboard navigation
- âœ… **Performance**: Loading states, error boundaries
- âœ… **Security**: Authentication, authorization
- âœ… **Data Integrity**: Form validation, API responses

## ðŸ”§ Test Configuration

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

## ðŸš¨ Important Notes

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

## ðŸ› Troubleshooting

### **Tests Failing?**
1. **Check dev server**: Ensure `pnpm dev` is running on port 3001
2. **Database state**: Run `pnpm db:seed` to reset test data
3. **Browser issues**: Try `pnpm test:e2e:headed` to see what's happening

### **Common Issues**
- **Port conflicts**: Change port in `playwright.config.ts`
- **Database locks**: Restart dev server
- **Authentication errors**: Check mocked Clerk setup

## ðŸ“Š Test Results

After running tests, view the HTML report:
```bash
pnpm test:e2e:report
```

The report shows:
- âœ… Passed tests
- âŒ Failed tests with screenshots
- ðŸ“¹ Video recordings of failures
- ðŸ” Detailed error information

## ðŸŽ‰ Success Metrics

**Target Coverage**: 100% of user journeys
**Performance**: All tests complete in <5 minutes
**Reliability**: 99%+ pass rate on CI/CD

---

**Happy Testing! ðŸ§ªâœ¨** 
