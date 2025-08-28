import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display hero section with main message', async ({ page }) => {
    // Check hero section
    await expect(page.locator('h1')).toContainText(/KlusQuest/i);
    
    // Check for main features
    await expect(page.getByText(/gamified/i)).toBeVisible();
    await expect(page.getByText(/chores/i)).toBeVisible();
    await expect(page.getByText(/rewards/i)).toBeVisible();
  });

  test('should show navigation buttons', async ({ page }) => {
    // Check for main navigation buttons (they are Links, not buttons)
    await expect(page.getByRole('link', { name: /Inloggen|Sign In/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Account Aanmaken|Sign Up/i })).toBeVisible();
  });

  test('should display features section', async ({ page }) => {
    // Scroll to features section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check for feature cards
    await expect(page.getByText(/Gamified Experience/i)).toBeVisible();
    await expect(page.getByText(/Rewards System/i)).toBeVisible();
    await expect(page.getByText(/Bilingual Support/i)).toBeVisible();
  });

  test('should have working navigation to sign-in', async ({ page }) => {
    // Click sign-in link
    await page.getByRole('link', { name: /Inloggen|Sign In/i }).click();
    
    // Should navigate to sign-in page
    await expect(page).toHaveURL(/.*sign-in/);
  });

  test('should have working navigation to sign-up', async ({ page }) => {
    // Click sign-up link
    await page.getByRole('link', { name: /Account Aanmaken|Sign Up/i }).click();
    
    // Should navigate to sign-up page
    await expect(page).toHaveURL(/.*sign-up/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that content is still visible
    await expect(page.locator('h1')).toContainText(/KlusQuest/i);
    await expect(page.getByRole('link', { name: /Inloggen|Sign In/i })).toBeVisible();
    
    // Check that links are properly sized for touch
    const signInLink = page.getByRole('link', { name: /Inloggen|Sign In/i });
    const linkBox = await signInLink.boundingBox();
    expect(linkBox?.height).toBeGreaterThan(44); // Minimum touch target size
  });

  test('should have proper meta tags and title', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/KlusQuest/i);
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content');
  });

  test('should have accessible navigation', async ({ page }) => {
    // Check for proper heading hierarchy
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    await expect(headings.first()).toContainText(/KlusQuest/i);
    
    // Check for proper button labels
    const buttons = page.locator('button');
    for (let i = 0; i < await buttons.count(); i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      
      // Button should have either accessible text or aria-label
      expect(text?.trim() || ariaLabel).toBeTruthy();
    }
  });
}); 