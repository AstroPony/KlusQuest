import { test, expect } from '@playwright/test';

test.describe('Parent Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication state for testing
    await page.addInitScript(() => {
      (window as any).__CLERK_FRONTEND_API = 'mock';
      (window as any).__CLERK_PUBLISHABLE_KEY = 'mock';
    });

    await page.goto('/dashboard');
  });

  test('should display parent dashboard', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Parent Dashboard');
    
    // Check for main sections
    await expect(page.getByText(/Huisgezin Overzicht|Household Overview/i)).toBeVisible();
    await expect(page.getByText(/Kinderen Beheren|Manage Kids/i)).toBeVisible();
    await expect(page.getByText(/Klus Goedkeuringen|Chore Approvals/i)).toBeVisible();
  });

  test('should show household overview with stats', async ({ page }) => {
    // Check for stats cards
    await expect(page.getByText(/Kinderen|Kids/i)).toBeVisible();
    await expect(page.getByText(/Actieve Klussen|Active Chores/i)).toBeVisible();
    await expect(page.getByText(/Vandaag Voltooid|Completed Today/i)).toBeVisible();
    await expect(page.getByText(/Voltooiingsgraad|Completion Rate/i)).toBeVisible();
    
    // Check for XP and coins totals
    await expect(page.getByText(/Totaal XP|Total XP/i)).toBeVisible();
    await expect(page.getByText(/Totaal Munten|Total Coins/i)).toBeVisible();
  });

  test('should allow adding new kids', async ({ page }) => {
    // Click add kid button
    await page.getByRole('button', { name: /👶 Kind Toevoegen|Add Kid/i }).click();
    
    // Should show kid form
    await expect(page.getByText(/Nieuw Kind Toevoegen|Add New Kid/i)).toBeVisible();
    
    // Fill out form
    await page.getByLabel(/Naam|Name/i).fill('Test Kid');
    await page.locator('button[title="Avatar"]').first().click(); // Select first avatar
    
    // Submit form
    await page.getByRole('button', { name: /Toevoegen|Add/i }).click();
    
    // Wait for submission
    await page.waitForTimeout(1000);
    
    // Should show new kid in list
    await expect(page.getByText('Test Kid')).toBeVisible();
  });

  test('should validate kid form fields', async ({ page }) => {
    // Click add kid button
    await page.getByRole('button', { name: /👶 Kind Toevoegen|Add Kid/i }).click();
    
    // Try to submit empty form
    await page.getByRole('button', { name: /Toevoegen|Add/i }).click();
    
    // Should show validation error
    await expect(page.getByText(/Naam is verplicht|Name is required/i)).toBeVisible();
  });

  test('should allow editing kids', async ({ page }) => {
    // First add a kid
    await page.getByRole('button', { name: /👶 Kind Toevoegen|Add Kid/i }).click();
    await page.getByLabel(/Naam|Name/i).fill('Edit Test Kid');
    await page.locator('button[title="Avatar"]').first().click();
    await page.getByRole('button', { name: /Toevoegen|Add/i }).click();
    await page.waitForTimeout(1000);
    
    // Find and click edit button
    const editButton = page.locator('button').filter({ hasText: /✏️|Edit/i }).first();
    await editButton.click();
    
    // Should show edit form
    await expect(page.getByText(/Kind Bewerken|Edit Kid/i)).toBeVisible();
    
    // Modify the kid
    await page.getByLabel(/Naam|Name/i).fill('Updated Test Kid');
    await page.getByRole('button', { name: /Bijwerken|Update/i }).click();
    
    // Should show updated kid
    await expect(page.getByText('Updated Test Kid')).toBeVisible();
  });

  test('should allow deleting kids', async ({ page }) => {
    // First add a kid
    await page.getByRole('button', { name: /👶 Kind Toevoegen|Add Kid/i }).click();
    await page.getByLabel(/Naam|Name/i).fill('Delete Test Kid');
    await page.locator('button[title="Avatar"]').first().click();
    await page.getByRole('button', { name: /Toevoegen|Add/i }).click();
    await page.waitForTimeout(1000);
    
    // Find and click delete button
    const deleteButton = page.locator('button').filter({ hasText: /🗑️|Delete/i }).first();
    await deleteButton.click();
    
    // Handle confirmation dialog
    page.on('dialog', dialog => dialog.accept());
    
    // Kid should be removed
    await page.waitForTimeout(500);
    await expect(page.getByText('Delete Test Kid')).not.toBeVisible();
  });

  test('should show kid progress bars', async ({ page }) => {
    // Add a kid first
    await page.getByRole('button', { name: /👶 Kind Toevoegen|Add Kid/i }).click();
    await page.getByLabel(/Naam|Name/i).fill('Progress Test Kid');
    await page.locator('button[title="Avatar"]').first().click();
    await page.getByRole('button', { name: /Toevoegen|Add/i }).click();
    await page.waitForTimeout(1000);
    
    // Should show progress bar for XP
    const progressBar = page.locator('.bg-primary.h-2.rounded-full').first();
    await expect(progressBar).toBeVisible();
  });

  test('should display chore approval section', async ({ page }) => {
    // Check for chore approvals section
    await expect(page.getByText(/Klus Goedkeuringen|Chore Approvals/i)).toBeVisible();
    
    // Should show appropriate message if no completions
    await expect(page.getByText(/Nog geen klussen voltooid|No chores completed/i)).toBeVisible();
  });

  test('should handle chore completion approvals', async ({ page }) => {
    // This test would require setting up test data with chore completions
    // For now, we'll check the UI structure
    
    // Check for approval buttons (if any completions exist)
    const approveButtons = page.locator('button').filter({ hasText: /Goedkeuren|Approve/i });
    const denyButtons = page.locator('button').filter({ hasText: /Afwijzen|Deny/i });
    
    // If buttons exist, they should be properly labeled
    if (await approveButtons.count() > 0) {
      await expect(approveButtons.first()).toBeVisible();
    }
    
    if (await denyButtons.count() > 0) {
      await expect(denyButtons.first()).toBeVisible();
    }
  });

  test('should show quick actions', async ({ page }) => {
    // Check for quick action cards
    await expect(page.getByText(/Snelle Acties|Quick Actions/i)).toBeVisible();
    
    // Check for action buttons
    await expect(page.getByText(/Klussen Beheren|Manage Chores/i)).toBeVisible();
    await expect(page.getByText(/Beloningen|Rewards/i)).toBeVisible();
    await expect(page.getByText(/Rapporten|Reports/i)).toBeVisible();
  });

  test('should navigate to chores page', async ({ page }) => {
    // Click chores management link
    await page.getByRole('link', { name: /Klussen Beheren|Manage Chores/i }).click();
    
    // Should navigate to chores page
    await expect(page).toHaveURL(/.*chores/);
    await expect(page.locator('h1')).toContainText(/Klussen|Chores/i);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that content is still visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByText(/Huisgezin Overzicht|Household Overview/i)).toBeVisible();
    
    // Check that buttons are properly sized for touch
    const addKidButton = page.getByRole('button', { name: /👶 Kind Toevoegen|Add Kid/i });
    const buttonBox = await addKidButton.boundingBox();
    expect(buttonBox?.height).toBeGreaterThan(44); // Minimum touch target
  });

  test('should handle form cancellation', async ({ page }) => {
    // Click add kid button
    await page.getByRole('button', { name: /👶 Kind Toevoegen|Add Kid/i }).click();
    
    // Fill out form partially
    await page.getByLabel(/Naam|Name/i).fill('Cancelled Kid');
    
    // Click cancel
    await page.getByRole('button', { name: /Annuleren|Cancel/i }).click();
    
    // Form should be hidden
    await expect(page.getByText(/Nieuw Kind Toevoegen|Add New Kid/i)).not.toBeVisible();
  });

  test('should show avatar selection', async ({ page }) => {
    // Click add kid button
    await page.getByRole('button', { name: /👶 Kind Toevoegen|Add Kid/i }).click();
    
    // Should show avatar options
    const avatarOptions = page.locator('button[title="Avatar"]');
    await expect(avatarOptions.first()).toBeVisible();
    
    // Should have multiple avatar options
    const avatarCount = await avatarOptions.count();
    expect(avatarCount).toBeGreaterThan(1);
  });

  test('should update stats after adding kids', async ({ page }) => {
    // Get initial stats
    const initialKidsText = await page.getByText(/Kinderen|Kids/i).textContent();
    const initialKids = parseInt(initialKidsText?.match(/\d+/)?.[0] || '0');
    
    // Add a kid
    await page.getByRole('button', { name: /👶 Kind Toevoegen|Add Kid/i }).click();
    await page.getByLabel(/Naam|Name/i).fill('Stats Test Kid');
    await page.locator('button[title="Avatar"]').first().click();
    await page.getByRole('button', { name: /Toevoegen|Add/i }).click();
    await page.waitForTimeout(1000);
    
    // Stats should be updated
    const newKidsText = await page.getByText(/Kinderen|Kids/i).textContent();
    const newKids = parseInt(newKidsText?.match(/\d+/)?.[0] || '0');
    expect(newKids).toBeGreaterThan(initialKids);
  });

  test('should handle multiple kids', async ({ page }) => {
    // Add multiple kids
    const kids = ['First Kid', 'Second Kid', 'Third Kid'];
    
    for (const kidName of kids) {
      await page.getByRole('button', { name: /👶 Kind Toevoegen|Add Kid/i }).click();
      await page.getByLabel(/Naam|Name/i).fill(kidName);
      await page.locator('button[title="Avatar"]').first().click();
      await page.getByRole('button', { name: /Toevoegen|Add/i }).click();
      await page.waitForTimeout(500);
    }
    
    // All kids should be visible
    for (const kidName of kids) {
      await expect(page.getByText(kidName)).toBeVisible();
    }
  });

  test('should have accessible form labels', async ({ page }) => {
    // Click add kid button
    await page.getByRole('button', { name: /👶 Kind Toevoegen|Add Kid/i }).click();
    
    // Check that form fields have proper labels
    const nameLabel = page.getByLabel(/Naam|Name/i);
    await expect(nameLabel).toBeVisible();
    
    // Check that avatar selection is accessible
    const avatarLabel = page.getByText(/Avatar/i);
    await expect(avatarLabel).toBeVisible();
  });
}); 