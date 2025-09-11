import { test, expect } from '@playwright/test';

test.describe('Kid Simple Page - Public Access', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to kid-simple page for each test
    await page.goto('/kid-simple');
  });

  test('should require authentication for kid-simple page', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Should show authentication required message
    await expect(page.getByText(/Je moet ingelogd zijn/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Inloggen/i })).toBeVisible();
  });

  test('should show proper authentication prompt', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check authentication message
    await expect(page.getByText(/Je moet ingelogd zijn/i)).toBeVisible();
    await expect(page.getByText(/Log in om de kid view te bekijken/i)).toBeVisible();
    
    // Check for sign-in button
    await expect(page.getByRole('link', { name: /Inloggen/i })).toBeVisible();
  });

  test('should have navigation back to home', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for home navigation
    await expect(page.getByRole('link', { name: /🏠 Home/i })).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that authentication message is still visible
    await expect(page.getByText(/Je moet ingelogd zijn/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Inloggen/i })).toBeVisible();
  });

  test('should have proper page structure', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for main content
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
    
    // Check for proper heading
    const heading = page.locator('h1');
    await expect(heading).toContainText(/Je moet ingelogd zijn/i);
  });

  test('should handle authentication flow correctly', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Click sign-in link
    await page.getByRole('link', { name: /Inloggen/i }).click();
    
    // Should navigate to sign-in page
    await expect(page).toHaveURL(/.*sign-in/);
  });
}); 