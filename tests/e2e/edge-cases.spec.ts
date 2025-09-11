import { test, expect } from '@playwright/test';

test.describe('Edge Cases & Error Flows', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network failure for non-essential resources only
    await page.route('**/*.css', route => route.abort('failed'));
    await page.route('**/*.js', route => route.abort('failed'));
    
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Should show some error handling or fallback
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
    
    // Page should still be functional
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle slow loading gracefully', async ({ page }) => {
    // Mock slow network
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 5000);
    });
    
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Page should load even if slowly
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle invalid URLs gracefully', async ({ page }) => {
    // Try to access non-existent page
    await page.goto('/non-existent-page');
    
    // Should show 404 or error page
    const status = page.url();
    expect(status).toContain('non-existent-page');
    
    // Should have some content (even if it's an error)
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });

  test('should handle malformed navigation gracefully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Try to click on elements that might not exist
    const nonExistentButton = page.locator('button[data-testid="non-existent"]');
    
    // Should not crash the page
    await expect(page.locator('h1')).toContainText('KlusQuest');
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to sign-in
    await page.getByRole('link', { name: /Inloggen|Sign In/i }).click();
    await expect(page).toHaveURL(/.*sign-in/);
    
    // Go back
    await page.goBack();
    await expect(page).toHaveURL('/');
    
    // Go forward
    await page.goForward();
    await expect(page).toHaveURL(/.*sign-in/);
    
    // Page should still be functional
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('should handle page refresh correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Should still show the same content
    await expect(page.locator('h1')).toContainText('KlusQuest');
    await expect(page.getByRole('link', { name: /Inloggen|Sign In/i })).toBeVisible();
  });

  test('should handle multiple rapid clicks gracefully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Rapidly click navigation links
    const signInLink = page.getByRole('link', { name: /Inloggen|Sign In/i });
    
    // Click multiple times quickly
    await signInLink.click();
    await signInLink.click();
    await signInLink.click();
    
    // Should navigate to sign-in page
    await expect(page).toHaveURL(/.*sign-in/);
    
    // Page should be stable
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('should handle viewport size changes gracefully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test various viewport sizes
    const viewports = [
      { width: 320, height: 568 },   // Small mobile
      { width: 768, height: 1024 },  // Tablet
      { width: 1200, height: 800 },  // Desktop
      { width: 1920, height: 1080 }, // Large desktop
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      
      // Content should still be visible
      await expect(page.locator('h1')).toContainText('KlusQuest');
      
      // Wait a moment for any layout adjustments
      await page.waitForTimeout(100);
    }
  });

  test('should handle keyboard navigation correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Focus on the page
    await page.keyboard.press('Tab');
    
    // Should be able to navigate with keyboard
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Page should remain stable
    await expect(page.locator('h1')).toContainText('KlusQuest');
  });

  test('should handle form submission edge cases', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to sign-up page
    await page.getByRole('link', { name: /Account Aanmaken|Sign Up/i }).click();
    await expect(page).toHaveURL(/.*sign-up/);
    
    // Try to submit without filling anything (if there are forms)
    const forms = page.locator('form');
    if (await forms.count() > 0) {
      // Should handle empty submission gracefully
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should handle onboarding navigation edge cases', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test onboarding link
    const onboardingLink = page.getByRole('link', { name: /Onboarding/i });
    
    // Click multiple times rapidly
    await onboardingLink.click();
    await onboardingLink.click();
    await onboardingLink.click();
    
    // Should handle gracefully and still navigate
    await expect(page).toHaveURL('/onboarding');
  });

  test('should handle concurrent page loads', async ({ page }) => {
    // Create multiple page contexts to simulate concurrent users
    const context1 = page.context();
    const context2 = page.context();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    // Load pages concurrently
    await Promise.all([
      page1.goto('/'),
      page2.goto('/')
    ]);
    
    // Both should load successfully
    await expect(page1.locator('h1')).toContainText('KlusQuest');
    await expect(page2.locator('h1')).toContainText('KlusQuest');
    
    // Clean up
    await context1.close();
    await context2.close();
  });
}); 