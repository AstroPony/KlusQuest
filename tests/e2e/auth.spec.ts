import { test, expect } from '@playwright/test';

test.describe('Authentication Links & Guards', () => {
  test('home page exposes auth navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText(/KlusQuest/i);
    await expect(page.getByRole('link', { name: /Inloggen|Sign In/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Account Aanmaken|Sign Up/i })).toBeVisible();
  });

  test('sign-in navigation points to Clerk route', async ({ page }) => {
    await page.goto('/');
    const signIn = page.getByRole('link', { name: /Inloggen|Sign In/i });
    await expect(signIn).toHaveAttribute('href', '/sign-in');
  });

  test('sign-up navigation points to Clerk route', async ({ page }) => {
    await page.goto('/');
    const signUp = page.getByRole('link', { name: /Account Aanmaken|Sign Up/i });
    await expect(signUp).toHaveAttribute('href', '/sign-up');
  });

  test('dashboard prompts unauthenticated users to sign in', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('body')).toContainText(/Loading|Sign In|Inloggen/);
  });
});
