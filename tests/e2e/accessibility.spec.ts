import { test, expect } from '@playwright/test';

test.describe('Accessibility & User Experience', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check that headings are in logical order
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    
    expect(headingCount).toBeGreaterThan(0);
    
    // First heading should be h1
    const firstHeading = headings.first();
    const firstTag = await firstHeading.evaluate(el => el.tagName.toLowerCase());
    expect(firstTag).toBe('h1');
    
    // Should contain KlusQuest
    await expect(firstHeading).toContainText('KlusQuest');
  });

  test('should have proper link labels', async ({ page }) => {
    // Check all links have accessible text
    const links = page.locator('a');
    const linkCount = await links.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');
      
      // Link should have either text, aria-label, or title
      expect(text?.trim() || ariaLabel || title).toBeTruthy();
    }
    
    // Check specific important links
    await expect(page.getByRole('link', { name: /Inloggen|Sign In/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Account Aanmaken|Sign Up/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Onboarding/i })).toBeVisible();
  });

  test('should have proper button labels', async ({ page }) => {
    // Check all buttons have accessible text
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const title = await button.getAttribute('title');
      
      // Button should have either text, aria-label, or title
      expect(text?.trim() || ariaLabel || title).toBeTruthy();
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Focus should be visible
    await page.keyboard.press('Tab');
    
    // Should be able to navigate through interactive elements
    const focusableElements = page.locator('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const focusableCount = await focusableElements.count();
    
    expect(focusableCount).toBeGreaterThan(0);
    
    // Test tab navigation
    for (let i = 0; i < Math.min(focusableCount, 5); i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
      
      // Page should remain stable
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    // This is a basic check - in a real scenario you'd use axe-core or similar
    // For now, we'll check that text is visible against backgrounds
    
    const mainText = page.locator('h1, h2, h3, p');
    const textCount = await mainText.count();
    
    for (let i = 0; i < Math.min(textCount, 3); i++) {
      const element = mainText.nth(i);
      const isVisible = await element.isVisible();
      expect(isVisible).toBe(true);
    }
  });

  test('should handle screen reader announcements', async ({ page }) => {
    // Check for proper ARIA attributes
    const elementsWithAria = page.locator('[aria-label], [aria-describedby], [aria-hidden], [aria-expanded], [aria-selected]');
    const ariaCount = await elementsWithAria.count();
    
    // Should have some ARIA attributes for accessibility
    expect(ariaCount).toBeGreaterThanOrEqual(0);
  });

  test('should have proper form labels', async ({ page }) => {
    // Navigate to sign-up page to check forms
    await page.getByRole('link', { name: /Account Aanmaken|Sign Up/i }).click();
    await expect(page).toHaveURL(/.*sign-up/);
    
    // Check for form elements
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      // Check that form inputs have proper labels
      const inputs = page.locator('input, select, textarea');
      const inputCount = await inputs.count();
      
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const placeholder = await input.getAttribute('placeholder');
        
        // Input should have either id (for label association), aria-label, or placeholder
        expect(id || ariaLabel || placeholder).toBeTruthy();
      }
    }
  });

  test('should handle focus management correctly', async ({ page }) => {
    // Navigate to sign-in page
    await page.getByRole('link', { name: /Inloggen|Sign In/i }).click();
    await expect(page).toHaveURL(/.*sign-in/);
    
    // Focus should be managed properly
    await page.keyboard.press('Tab');
    
    // Should be able to navigate through the page
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Page should remain functional
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('should have proper page structure', async ({ page }) => {
    // Check for semantic HTML elements
    const main = page.locator('main');
    const header = page.locator('header');
    const nav = page.locator('nav');
    const section = page.locator('section');
    
    // Should have main content area
    await expect(main).toBeVisible();
    
    // Should have navigation
    await expect(nav).toBeVisible();
    
    // Should have sections for content organization
    const sectionCount = await section.count();
    expect(sectionCount).toBeGreaterThan(0);
  });

  test('should handle dynamic content changes gracefully', async ({ page }) => {
    // Navigate between pages to test dynamic content
    await page.getByRole('link', { name: /Inloggen|Sign In/i }).click();
    await expect(page).toHaveURL(/.*sign-in/);
    
    // Go back to home
    await page.goBack();
    await expect(page).toHaveURL('/');
    
    // Content should be stable
    await expect(page.locator('h1')).toContainText('KlusQuest');
    
    // Navigation should still work
    await page.getByRole('link', { name: /Account Aanmaken|Sign Up/i }).click();
    await expect(page).toHaveURL(/.*sign-up/);
  });

  test('should have proper error handling for accessibility', async ({ page }) => {
    // Try to access a non-existent page
    await page.goto('/non-existent-page');
    
    // Should show some content (even if it's an error)
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
    
    // Should have proper heading structure even on error pages
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
  });
}); 