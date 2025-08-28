import { test, expect } from '@playwright/test';

test.describe('Simple Demo Pages', () => {
  test('should load home page with all content', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that the page loads completely
    await expect(page.locator('h1')).toContainText('KlusQuest');
    
    // Check navigation links
    await expect(page.getByRole('link', { name: /Inloggen|Sign In/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Account Aanmaken|Sign Up/i })).toBeVisible();
    
    // Check hero section
    await expect(page.getByText(/Maak klussen leuk voor/i)).toBeVisible();
    await expect(page.getByText(/het hele gezin/i)).toBeVisible();
    
    // Check call-to-action buttons
    await expect(page.getByRole('link', { name: /🚀 Start Gratis/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /🔑 Al een account/i })).toBeVisible();
  });

  test('should navigate to sign-in page successfully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Click sign-in link
    await page.getByRole('link', { name: /Inloggen|Sign In/i }).click();
    
    // Should navigate to sign-in page
    await expect(page).toHaveURL(/.*sign-in/);
    
    // Check that sign-in page loads (there might be multiple h1 elements)
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('should navigate to sign-up page successfully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Click sign-up link
    await page.getByRole('link', { name: /Account Aanmaken|Sign Up/i }).click();
    
    // Should navigate to sign-up page
    await expect(page).toHaveURL(/.*sign-up/);
    
    // Check that sign-up page loads (there might be multiple h1 elements)
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('should be fully responsive on mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that content is still visible
    await expect(page.locator('h1')).toContainText(/KlusQuest/i);
    await expect(page.getByRole('link', { name: /Inloggen|Sign In/i })).toBeVisible();
    
    // Check that links are properly sized for touch
    const signInLink = page.getByRole('link', { name: /Inloggen|Sign In/i });
    const linkBox = await signInLink.boundingBox();
    expect(linkBox?.height).toBeGreaterThan(44); // Minimum touch target
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1')).toContainText(/KlusQuest/i);
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('h1')).toContainText(/KlusQuest/i);
  });

  test('should have proper accessibility features', async ({ page }) => {
    await page.goto('/');
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
    
    // Check for proper page title
    await expect(page).toHaveTitle(/KlusQuest/i);
    
    // Check for meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content');
  });

  test('should handle navigation state correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to sign-in
    await page.getByRole('link', { name: /Inloggen|Sign In/i }).click();
    await expect(page).toHaveURL(/.*sign-in/);
    
    // Go back to home
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to sign-up
    await page.getByRole('link', { name: /Account Aanmaken|Sign Up/i }).click();
    await expect(page).toHaveURL(/.*sign-up/);
    
    // Go back to home
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Home page should still work
    await expect(page.locator('h1')).toContainText('KlusQuest');
  });
}); 