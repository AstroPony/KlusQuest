import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth state
    await page.goto('/');
  });

  test('should show sign-in page for unauthenticated users', async ({ page }) => {
    // Try to access protected route
    await page.goto('/dashboard');
    
    // Should redirect to sign-in or show sign-in page
    // Note: In test environment, Clerk middleware might not work
    // So we'll check if we're on sign-in page or redirected
    const currentUrl = page.url();
    if (currentUrl.includes('sign-in')) {
      await expect(page.locator('h1')).toContainText(/Sign In|Inloggen/i);
    } else {
      // If not redirected, check that dashboard shows sign-in prompt
      await expect(page.getByText(/Inloggen|Sign In/i)).toBeVisible();
    }
  });

  test('should show home page with sign-in button for unauthenticated users', async ({ page }) => {
    await page.goto('/');
    
    // Should show home page
    await expect(page.locator('h1')).toContainText(/KlusQuest/i);
    
    // Should show sign-in button
    await expect(page.getByRole('button', { name: /Sign In|Inloggen/i })).toBeVisible();
  });

  test('should show sign-up page when clicking sign-up', async ({ page }) => {
    await page.goto('/');
    
    // Click sign-up button
    await page.getByRole('button', { name: /Sign Up|Account Aanmaken/i }).click();
    
    // Should navigate to sign-up page
    await expect(page).toHaveURL(/.*sign-up/);
    await expect(page.locator('h1')).toContainText(/Sign Up|Account Aanmaken/i);
  });

  test('should show sign-in page when clicking sign-in', async ({ page }) => {
    await page.goto('/');
    
    // Click sign-in button
    await page.getByRole('button', { name: /Sign In|Inloggen/i }).click();
    
    // Should navigate to sign-in page
    await expect(page).toHaveURL(/.*sign-in/);
    await expect(page.locator('h1')).toContainText(/Sign In|Inloggen/i);
  });

  test('should show navigation menu for authenticated users', async ({ page }) => {
    // Mock authentication state (this would normally be handled by Clerk)
    await page.addInitScript(() => {
      // Mock Clerk user
      (window as any).__CLERK_FRONTEND_API = 'mock';
      (window as any).__CLERK_PUBLISHABLE_KEY = 'mock';
    });

    // Mock the auth state
    await page.evaluate(() => {
      localStorage.setItem('clerk-db', JSON.stringify({
        lastActiveTokenId: 'mock-token',
        sessions: [{ id: 'mock-session', userId: 'mock-user' }]
      }));
    });

    await page.goto('/dashboard');
    
    // Should show dashboard content
    await expect(page.locator('h1')).toContainText('Parent Dashboard');
  });

  test('should handle sign-out correctly', async ({ page }) => {
    // Mock authentication state
    await page.addInitScript(() => {
      (window as any).__CLERK_FRONTEND_API = 'mock';
      (window as any).__CLERK_PUBLISHABLE_KEY = 'mock';
    });

    await page.goto('/dashboard');
    
    // Should show sign-out button
    const signOutButton = page.locator('button').filter({ hasText: /Sign Out|Uitloggen/i });
    await expect(signOutButton).toBeVisible();
    
    // Click sign-out
    await signOutButton.click();
    
    // Should redirect to home page
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText(/KlusQuest/i);
  });
}); 