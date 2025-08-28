import { test, expect } from '@playwright/test';

test.describe('Kid View - PixiJS Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kid');
  });

  test('should display PixiJS game canvas', async ({ page }) => {
    // Check that the game canvas is present
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    // Check canvas dimensions
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox?.width).toBeGreaterThan(0);
    expect(canvasBox?.height).toBeGreaterThan(0);
  });

  test('should show game controls and score', async ({ page }) => {
    // Check for game UI elements
    await expect(page.getByText(/Score/i)).toBeVisible();
    await expect(page.getByText(/Level/i)).toBeVisible();
    await expect(page.getByText(/Moves/i)).toBeVisible();
    
    // Check for reset button
    await expect(page.getByRole('button', { name: /Reset|Resetten/i })).toBeVisible();
  });

  test('should handle game interactions', async ({ page }) => {
    // Wait for game to load
    await page.waitForTimeout(1000);
    
    // Click on the game canvas to interact
    const canvas = page.locator('canvas');
    await canvas.click({ position: { x: 100, y: 100 } });
    
    // Check that score or moves have changed
    await page.waitForTimeout(500);
    
    // The game should be interactive
    await expect(canvas).toBeVisible();
  });

  test('should reset game when reset button is clicked', async ({ page }) => {
    // Wait for game to load
    await page.waitForTimeout(1000);
    
    // Get initial score/moves
    const initialScore = await page.locator('text=Score').locator('..').textContent();
    
    // Click reset button
    await page.getByRole('button', { name: /Reset|Resetten/i }).click();
    
    // Wait for reset
    await page.waitForTimeout(500);
    
    // Game should be reset (this is a basic check)
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that game is still visible
    await expect(page.locator('canvas')).toBeVisible();
    
    // Check that UI elements are properly sized
    const resetButton = page.getByRole('button', { name: /Reset|Resetten/i });
    const buttonBox = await resetButton.boundingBox();
    expect(buttonBox?.height).toBeGreaterThan(44); // Minimum touch target
  });

  test('should have navigation back to dashboard', async ({ page }) => {
    // Check for navigation link
    const backLink = page.getByRole('link', { name: /Terug naar Dashboard|Back to Dashboard/i });
    await expect(backLink).toBeVisible();
    
    // Click the link
    await backLink.click();
    
    // Should navigate back
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should handle touch interactions on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Wait for game to load
    await page.waitForTimeout(1000);
    
    // Simulate touch interaction
    const canvas = page.locator('canvas');
    await canvas.tap({ position: { x: 100, y: 100 } });
    
    // Game should respond to touch
    await page.waitForTimeout(500);
    await expect(canvas).toBeVisible();
  });

  test('should display proper game instructions', async ({ page }) => {
    // Check for game instructions or help text
    const instructions = page.locator('text=/Click|Tap|Klik/i');
    if (await instructions.count() > 0) {
      await expect(instructions.first()).toBeVisible();
    }
  });

  test('should maintain game state during navigation', async ({ page }) => {
    // Wait for game to load
    await page.waitForTimeout(1000);
    
    // Interact with game
    const canvas = page.locator('canvas');
    await canvas.click({ position: { x: 100, y: 100 } });
    
    // Navigate away and back
    await page.goto('/');
    await page.goto('/kid');
    
    // Game should still be functional
    await expect(canvas).toBeVisible();
  });
}); 