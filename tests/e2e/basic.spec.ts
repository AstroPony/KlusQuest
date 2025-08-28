import { test, expect } from '@playwright/test';

test.describe('Basic Functionality', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads
    await expect(page.locator('h1')).toContainText('KlusQuest');
    
    // Check that navigation links are visible
    await expect(page.getByRole('link', { name: /Inloggen|Sign In/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Account Aanmaken|Sign Up/i })).toBeVisible();
  });

  test('should navigate to sign-in page', async ({ page }) => {
    await page.goto('/');
    
    // Click sign-in link
    await page.getByRole('link', { name: /Inloggen|Sign In/i }).click();
    
    // Should navigate to sign-in page
    await expect(page).toHaveURL(/.*sign-in/);
  });

  test('should navigate to sign-up page', async ({ page }) => {
    await page.goto('/');
    
    // Click sign-up link
    await page.getByRole('link', { name: /Account Aanmaken|Sign Up/i }).click();
    
    // Should navigate to sign-up page
    await expect(page).toHaveURL(/.*sign-up/);
  });

  test('should load kid-simple page', async ({ page }) => {
    await page.goto('/kid-simple');
    
    // Check that the page loads
    await expect(page.locator('h1')).toBeVisible();
    
    // Check for chore list
    await expect(page.getByText(/Tafel afruimen/i)).toBeVisible();
  });

  test('should load kid page with PixiJS', async ({ page }) => {
    await page.goto('/kid');
    
    // Check that the game canvas is present
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.goto('/');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that content is still visible
    await expect(page.locator('h1')).toContainText(/KlusQuest/i);
    await expect(page.getByRole('link', { name: /Inloggen|Sign In/i })).toBeVisible();
  });
}); 