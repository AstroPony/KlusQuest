import { test, expect } from '@playwright/test';

test.describe('Kid Simple Page - Public Access', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to kid-simple page
    await page.goto('/kid-simple');
  });

  test('should load kid-simple page successfully', async ({ page }) => {
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    
    // Check that the page loads
    await expect(page.locator('h1')).toBeVisible();
    
    // Check for chore list
    await expect(page.getByText(/Tafel afruimen/i)).toBeVisible();
    await expect(page.getByText(/Kamer opruimen/i)).toBeVisible();
    await expect(page.getByText(/Afval weggooien/i)).toBeVisible();
  });

  test('should show kid stats', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for stats display
    await expect(page.getByText(/XP/i)).toBeVisible();
    await expect(page.getByText(/Coins|Munten/i)).toBeVisible();
    await expect(page.getByText(/Level/i)).toBeVisible();
  });

  test('should show chore completion buttons', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for completion buttons
    const completeButtons = page.getByRole('button', { name: /Klaar|Done/i });
    await expect(completeButtons.first()).toBeVisible();
  });

  test('should have navigation back to dashboard', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for navigation link
    const backLink = page.getByRole('link', { name: /Terug naar Dashboard|Back to Dashboard/i });
    await expect(backLink).toBeVisible();
    
    // Click the link
    await backLink.click();
    
    // Should navigate back to home page (since dashboard requires auth)
    await expect(page).toHaveURL('/');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that content is still visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByText(/Tafel afruimen/i)).toBeVisible();
    
    // Check that buttons are properly sized for touch
    const completeButton = page.getByRole('button', { name: /Klaar|Done/i }).first();
    const buttonBox = await completeButton.boundingBox();
    expect(buttonBox?.height).toBeGreaterThan(44); // Minimum touch target
  });

  test('should handle chore completion interaction', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Find a chore completion button
    const completeButton = page.getByRole('button', { name: /Klaar|Done/i }).first();
    await expect(completeButton).toBeVisible();
    
    // Click the button (this should trigger some interaction)
    await completeButton.click();
    
    // Wait a moment for any animation or state change
    await page.waitForTimeout(1000);
    
    // Page should still be functional
    await expect(page.locator('h1')).toBeVisible();
  });
}); 