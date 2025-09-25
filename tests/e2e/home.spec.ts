import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display hero section with main message', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/KlusQuest/i);
    await expect(page.getByRole('heading', { level: 2 })).toContainText(/Maak klussen leuk/i);
    await expect(page.getByText(/XP en munten/i).first()).toBeVisible();
  });

  test('should show navigation buttons', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Inloggen|Sign In/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Account Aanmaken|Sign Up/i })).toBeVisible();
  });

  test('should display features section', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByText(/Gamified Experience/i)).toBeVisible();
    await expect(page.getByText(/Reward System/i)).toBeVisible();
    await expect(page.getByText(/Bilingual/i)).toBeVisible();
  });

  test('should have working navigation to sign-in', async ({ page }) => {
    const signInLink = page.getByRole('link', { name: /Inloggen|Sign In/i });
    await expect(signInLink).toHaveAttribute('href', '/sign-in');
  });

  test('should have working navigation to sign-up', async ({ page }) => {
    const signUpLink = page.getByRole('link', { name: /Account Aanmaken|Sign Up/i });
    await expect(signUpLink).toHaveAttribute('href', '/sign-up');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toContainText(/KlusQuest/i);
    const signInLink = page.getByRole('link', { name: /Inloggen|Sign In/i });
    await expect(signInLink).toBeVisible();

    const linkBox = await signInLink.boundingBox();
    expect(linkBox?.height).toBeGreaterThanOrEqual(44);
  });

  test('should have proper meta tags and title', async ({ page }) => {
    await expect(page).toHaveTitle(/KlusQuest/i);

    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content');
  });

  test('should have accessible navigation', async ({ page }) => {
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    await expect(headings.first()).toContainText(/KlusQuest/i);

    const buttons = page.locator('button');
    for (let i = 0; i < await buttons.count(); i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      expect(text?.trim() || ariaLabel).toBeTruthy();
    }
  });
});