import { test, expect } from '@playwright/test';

test.describe('Public Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page for each test
    await page.goto('/');
  });

  test('should load home page successfully', async ({ page }) => {
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    
    // Check that the page loads
    await expect(page.locator('h1')).toContainText('KlusQuest');
    
    // Check that navigation links are visible
    await expect(page.getByRole('link', { name: /Inloggen|Sign In/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Account Aanmaken|Sign Up/i })).toBeVisible();
  });

  test('should display hero section content', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check hero section
    await expect(page.getByText(/Maak klussen leuk voor/i)).toBeVisible();
    await expect(page.getByText(/het hele gezin/i)).toBeVisible();
    await expect(page.getByText(/KlusQuest maakt huishoudelijke taken voelen als een spel/i)).toBeVisible();
  });

  test('should show feature cards', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for feature cards
    await expect(page.getByText(/Gamified Experience/i)).toBeVisible();
    await expect(page.getByText(/Rewards System/i)).toBeVisible();
    await expect(page.getByText(/Bilingual/i)).toBeVisible();
  });

  test('should show onboarding link for new users', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for onboarding link
    await expect(page.getByRole('link', { name: /Onboarding/i })).toBeVisible();
  });

  test('should navigate to sign-in page', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Click sign-in link
    await page.getByRole('link', { name: /Inloggen|Sign In/i }).click();
    
    // Should navigate to sign-in page
    await expect(page).toHaveURL(/.*sign-in/);
  });

  test('should navigate to sign-up page', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Click sign-up link
    await page.getByRole('link', { name: /Account Aanmaken|Sign Up/i }).click();
    
    // Should navigate to sign-up page
    await expect(page).toHaveURL(/.*sign-up/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that content is still visible
    await expect(page.locator('h1')).toContainText(/KlusQuest/i);
    await expect(page.getByRole('link', { name: /Inloggen|Sign In/i })).toBeVisible();
    
    // Check that links are properly sized for touch
    const signInLink = page.getByRole('link', { name: /Inloggen|Sign In/i });
    const linkBox = await signInLink.boundingBox();
    expect(linkBox?.height).toBeGreaterThan(44); // Minimum touch target
  });

  test('should have proper page title and meta tags', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check page title
    await expect(page).toHaveTitle(/KlusQuest/i);
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content');
  });

  test('should have accessible navigation', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for proper heading hierarchy
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    await expect(headings.first()).toContainText(/KlusQuest/i);
    
    // Check that navigation links have proper labels
    const navLinks = page.locator('nav a');
    for (let i = 0; i < await navLinks.count(); i++) {
      const link = navLinks.nth(i);
      const ariaLabel = await link.getAttribute('aria-label');
      const text = await link.textContent();
      
      // Link should have either accessible text or aria-label
      expect(text?.trim() || ariaLabel).toBeTruthy();
    }
  });
}); 