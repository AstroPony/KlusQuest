import { test, expect } from '@playwright/test';

test.describe('Basic Functionality', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that the page loads
    await expect(page.locator('h1')).toContainText('KlusQuest');
    
    // Check that navigation links are visible
    await expect(page.getByRole('link', { name: /Inloggen|Sign In/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Account Aanmaken|Sign Up/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Onboarding/i })).toBeVisible();
  });

  test('should navigate to sign-in page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Click sign-in link
    await page.getByRole('link', { name: /Inloggen|Sign In/i }).click();
    await page.waitForLoadState('networkidle');
    
    // Should navigate to sign-in page
    await expect(page).toHaveURL(/.*sign-in/);
  });

  test('should navigate to sign-up page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Click sign-up link
    await page.getByRole('link', { name: /Account Aanmaken|Sign Up/i }).click();
    await page.waitForLoadState('networkidle');
    
    // Should navigate to sign-up page
    await expect(page).toHaveURL(/.*sign-up/);
  });

  test('should navigate to onboarding page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Click onboarding link
    await page.getByRole('link', { name: /Onboarding/i }).click();
    await page.waitForLoadState('networkidle');
    
    // Should navigate to onboarding page
    await expect(page.locator('h1').first()).toContainText(/Welkom bij KlusQuest/i);
  });

  test('should require authentication for kid-simple page', async ({ page }) => {
    await page.goto('/kid-simple');
    await page.waitForLoadState('networkidle');
    
    // Should show authentication required message
    await expect(page.getByText(/Je moet ingelogd zijn/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Inloggen/i })).toBeVisible();
  });


  test('should be responsive on mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that content is still visible
    await expect(page.locator('h1')).toContainText(/KlusQuest/i);
    await expect(page.getByRole('link', { name: /Inloggen|Sign In/i })).toBeVisible();
  });
}); 
