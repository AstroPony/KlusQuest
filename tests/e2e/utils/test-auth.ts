import { Page } from '@playwright/test';

/**
 * Mock Clerk authentication for testing
 * This bypasses the real Clerk authentication and creates a mock user session
 */
export async function mockClerkAuth(page: Page) {
  // Mock Clerk environment variables
  await page.addInitScript(() => {
    // Mock Clerk global objects
    (window as any).__CLERK_FRONTEND_API = 'mock';
    (window as any).__CLERK_PUBLISHABLE_KEY = 'mock';
    
    // Mock Clerk user object
    (window as any).clerk = {
      user: {
        id: 'test-user-123',
        emailAddresses: [{ emailAddress: 'test@example.com' }],
        firstName: 'Test',
        lastName: 'User',
        imageUrl: 'https://example.com/avatar.jpg'
      },
      session: {
        id: 'test-session-123',
        userId: 'test-user-123',
        status: 'active'
      },
      isSignedIn: true,
      isLoaded: true
    };
    
    // Mock Clerk hooks
    (window as any).useUser = () => ({
      user: (window as any).clerk.user,
      isSignedIn: true,
      isLoaded: true
    });
    
    (window as any).useAuth = () => ({
      userId: 'test-user-123',
      sessionId: 'test-session-123',
      isSignedIn: true,
      isLoaded: true
    });
  });

  // Mock localStorage to simulate authenticated state
  await page.evaluate(() => {
    localStorage.setItem('clerk-db', JSON.stringify({
      lastActiveTokenId: 'test-token',
      sessions: [{ id: 'test-session-123', userId: 'test-user-123' }],
      users: [{ id: 'test-user-123', email: 'test@example.com' }]
    }));
  });
}

/**
 * Mock API authentication by intercepting requests
 */
export async function mockAPIAuth(page: Page) {
  // Intercept API requests and add mock authentication headers
  await page.route('**/api/**', async (route) => {
    const headers = {
      ...route.request().headers(),
      'authorization': 'Bearer test-token',
      'x-clerk-user-id': 'test-user-123'
    };
    
    await route.continue({ headers });
  });
}

/**
 * Setup complete test environment with authentication
 */
export async function setupTestEnvironment(page: Page) {
  await mockClerkAuth(page);
  await mockAPIAuth(page);
  
  // Wait for page to be ready
  await page.waitForLoadState('networkidle');
}

/**
 * Create test user data
 */
export const testUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User'
};

/**
 * Create test household data
 */
export const testHousehold = {
  id: 'test-household-123',
  name: 'Test Family',
  locale: 'nl'
};

/**
 * Create test kid data
 */
export const testKid = {
  id: 'test-kid-123',
  displayName: 'Test Kid',
  avatar: '👶',
  level: 1,
  xp: 0,
  coins: 0
};

/**
 * Create test chore data
 */
export const testChore = {
  id: 'test-chore-123',
  title: 'Test Chore',
  description: 'A test chore for testing',
  frequency: 'DAILY',
  baseXp: 15,
  baseCoins: 2,
  active: true
}; 