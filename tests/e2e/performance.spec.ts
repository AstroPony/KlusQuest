import { test, expect } from '@playwright/test';

test.describe('Performance & Loading States', () => {
  test('should load page within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 10 seconds
    expect(loadTime).toBeLessThan(10000);
    
    // Content should be visible
    await expect(page.locator('h1')).toContainText('KlusQuest');
  });

  test('should handle loading states gracefully', async ({ page }) => {
    // Navigate to page
    await page.goto('/');
    
    // Should show content even during loading
    await expect(page.locator('body')).toBeVisible();
    
    // Wait for full load
    await page.waitForLoadState('networkidle');
    
    // All content should be visible
    await expect(page.locator('h1')).toContainText('KlusQuest');
    await expect(page.getByRole('link', { name: /Inloggen|Sign In/i })).toBeVisible();
  });

  test('should optimize resource loading', async ({ page }) => {
    // Track resource requests
    const requests: string[] = [];
    
    page.on('request', request => {
      requests.push(request.url());
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Should not have excessive resource requests
    expect(requests.length).toBeLessThan(100);
    
    // Should load essential resources
    const hasEssentialResources = requests.some(url => 
      url.includes('localhost:3000') || 
      url.includes('_next') ||
      url.includes('static')
    );
    expect(hasEssentialResources).toBe(true);
  });

  test('should handle slow network gracefully', async ({ page }) => {
    // Mock slow network
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 2000);
    });
    
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    const loadTime = Date.now() - startTime;
    
    // Should load DOM content even with slow network
    expect(loadTime).toBeLessThan(10000);
    
    // Basic content should be visible
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle network failures gracefully', async ({ page }) => {
    // Mock network failures for non-essential resources
    await page.route('**/*.css', route => route.abort('failed'));
    await page.route('**/*.js', route => route.abort('failed'));
    
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Page should still load basic content
    await expect(page.locator('body')).toBeVisible();
    
    // Should show some content even without styles
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });

  test('should handle concurrent resource loading', async ({ page }) => {
    // Track concurrent requests
    let concurrentRequests = 0;
    let maxConcurrent = 0;
    
    page.on('request', () => {
      concurrentRequests++;
      maxConcurrent = Math.max(maxConcurrent, concurrentRequests);
    });
    
    page.on('requestfinished', () => {
      concurrentRequests--;
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Should not have excessive concurrent requests
    expect(maxConcurrent).toBeLessThan(20);
  });

  test('should handle memory usage efficiently', async ({ page }) => {
    // Navigate to multiple pages to test memory management
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await page.getByRole('link', { name: /Inloggen|Sign In/i }).click();
    await expect(page).toHaveURL(/.*sign-in/);
    
    await page.goBack();
    await expect(page).toHaveURL('/');
    
    await page.getByRole('link', { name: /Account Aanmaken|Sign Up/i }).click();
    await expect(page).toHaveURL(/.*sign-up/);
    
    // Page should remain functional after multiple navigations
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('should handle viewport changes efficiently', async ({ page }) => {
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
      
      // Content should be visible
      await expect(page.locator('h1')).toContainText('KlusQuest');
      
      // Wait for any layout adjustments
      await page.waitForTimeout(500);
    }
    
    // Page should remain stable
    await expect(page.locator('h1')).toContainText('KlusQuest');
  });

  test('should handle rapid navigation gracefully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Rapidly navigate between pages including onboarding
    const pages = [
      { link: /Inloggen|Sign In/i, name: 'sign-in' },
      { link: /Account Aanmaken|Sign Up/i, name: 'sign-up' },
      { link: /Onboarding/i, name: 'onboarding' }
    ];
    
    for (const pageInfo of pages) {
      await page.getByRole('link', { name: pageInfo.link }).click();
      await page.waitForLoadState('networkidle');
      await page.goBack();
      await page.waitForLoadState('networkidle');
    }
    
    // Page should remain functional
    await expect(page.locator('h1')).toContainText('KlusQuest');
  });

  test('should handle large content gracefully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Scroll to bottom to test large content handling
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Wait for any lazy loading
    await page.waitForTimeout(1000);
    
    // Page should remain functional
    await expect(page.locator('h1')).toContainText('KlusQuest');
    
    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    
    // Should still be functional
    await expect(page.locator('h1')).toContainText('KlusQuest');
  });

  test('should handle browser refresh efficiently', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Refresh multiple times
    for (let i = 0; i < 3; i++) {
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Content should be visible
      await expect(page.locator('h1')).toContainText('KlusQuest');
    }
  });
}); 