import { test, expect } from '@playwright/test';

test.describe('Chore Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication state for testing
    await page.addInitScript(() => {
      (window as any).__CLERK_FRONTEND_API = 'mock';
      (window as any).__CLERK_PUBLISHABLE_KEY = 'mock';
    });

    await page.goto('/chores');
  });

  test('should display chore management page', async ({ page }) => {
    // Since this is a protected route, we need to mock authentication
    // For now, we'll check that the page loads (even if it shows auth required)
    await page.goto('/chores');
    
    // The page should either show chore management or require authentication
    const pageContent = await page.textContent('body');
    if (pageContent?.includes('Klussen') || pageContent?.includes('Chores')) {
      // Check page title
      await expect(page.locator('h1')).toContainText(/Klussen|Chores/i);
      
      // Check for chore form
      await expect(page.getByText(/Nieuwe klus toevoegen|Add New Chore/i)).toBeVisible();
      
      // Check for chore list
      await expect(page.getByText(/Klussen|Chores/i)).toBeVisible();
    } else {
      // Page requires authentication
      await expect(page.getByText(/Inloggen|Sign In/i)).toBeVisible();
    }
  });

  test('should allow creating new chores', async ({ page }) => {
    // Fill out chore form
    await page.getByLabel(/Titel|Title/i).fill('Test Chore');
    await page.getByLabel(/Beschrijving|Description/i).fill('Test Description');
    await page.getByLabel(/Frequentie|Frequency/i).selectOption('DAILY');
    await page.getByLabel(/Basis XP|Base XP/i).fill('15');
    await page.getByLabel(/Basis munten|Base Coins/i).fill('2');
    
    // Submit form
    await page.getByRole('button', { name: /Toevoegen|Add/i }).click();
    
    // Wait for form submission
    await page.waitForTimeout(1000);
    
    // Should show success or new chore in list
    await expect(page.getByText('Test Chore')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit empty form
    await page.getByRole('button', { name: /Toevoegen|Add/i }).click();
    
    // Should show validation errors
    await expect(page.getByText(/Titel is verplicht|Title is required/i)).toBeVisible();
    await expect(page.getByText(/Frequentie is verplicht|Frequency is required/i)).toBeVisible();
  });

  test('should allow editing existing chores', async ({ page }) => {
    // First create a chore
    await page.getByLabel(/Titel|Title/i).fill('Edit Test Chore');
    await page.getByLabel(/Beschrijving|Description/i).fill('Edit Test Description');
    await page.getByLabel(/Frequentie|Frequency/i).selectOption('WEEKLY');
    await page.getByLabel(/Basis XP|Base XP/i).fill('20');
    await page.getByLabel(/Basis munten|Base Coins/i).fill('3');
    await page.getByRole('button', { name: /Toevoegen|Add/i }).click();
    
    await page.waitForTimeout(1000);
    
    // Find and click edit button
    const editButton = page.locator('button').filter({ hasText: /✏️|Edit/i }).first();
    await editButton.click();
    
    // Should show edit form
    await expect(page.getByText(/Klus bewerken|Edit Chore/i)).toBeVisible();
    
    // Modify the chore
    await page.getByLabel(/Titel|Title/i).fill('Updated Test Chore');
    await page.getByRole('button', { name: /Bijwerken|Update/i }).click();
    
    // Should show updated chore
    await expect(page.getByText('Updated Test Chore')).toBeVisible();
  });

  test('should allow deleting chores', async ({ page }) => {
    // First create a chore
    await page.getByLabel(/Titel|Title/i).fill('Delete Test Chore');
    await page.getByLabel(/Frequentie|Frequency/i).selectOption('ONE_OFF');
    await page.getByLabel(/Basis XP|Base XP/i).fill('10');
    await page.getByLabel(/Basis munten|Base Coins/i).fill('1');
    await page.getByRole('button', { name: /Toevoegen|Add/i }).click();
    
    await page.waitForTimeout(1000);
    
    // Find and click delete button
    const deleteButton = page.locator('button').filter({ hasText: /🗑️|Delete/i }).first();
    await deleteButton.click();
    
    // Should show confirmation dialog
    // Note: This depends on the browser's confirm dialog
    page.on('dialog', dialog => dialog.accept());
    
    // Chore should be removed
    await page.waitForTimeout(500);
    await expect(page.getByText('Delete Test Chore')).not.toBeVisible();
  });

  test('should assign chores to kids', async ({ page }) => {
    // First create a chore
    await page.getByLabel(/Titel|Title/i).fill('Assigned Chore');
    await page.getByLabel(/Frequentie|Frequency/i).selectOption('DAILY');
    await page.getByLabel(/Basis XP|Base XP/i).fill('15');
    await page.getByLabel(/Basis munten|Base Coins/i).fill('2');
    
    // Select a kid if available
    const kidSelect = page.getByLabel(/Toewijzen aan|Assign to/i);
    if (await kidSelect.count() > 0) {
      await kidSelect.selectOption({ index: 1 }); // Select first available kid
    }
    
    await page.getByRole('button', { name: /Toevoegen|Add/i }).click();
    
    await page.waitForTimeout(1000);
    
    // Should show assigned chore
    await expect(page.getByText('Assigned Chore')).toBeVisible();
  });

  test('should show chore list with details', async ({ page }) => {
    // Create a few chores first
    const chores = [
      { title: 'Morning Chore', frequency: 'DAILY', xp: '10', coins: '1' },
      { title: 'Weekly Chore', frequency: 'WEEKLY', xp: '25', coins: '3' },
      { title: 'One-time Chore', frequency: 'ONE_OFF', xp: '50', coins: '5' }
    ];
    
    for (const chore of chores) {
      await page.getByLabel(/Titel|Title/i).fill(chore.title);
      await page.getByLabel(/Frequentie|Frequency/i).selectOption(chore.frequency);
      await page.getByLabel(/Basis XP|Base XP/i).fill(chore.xp);
      await page.getByLabel(/Basis munten|Base Coins/i).fill(chore.coins);
      await page.getByRole('button', { name: /Toevoegen|Add/i }).click();
      await page.waitForTimeout(500);
    }
    
    // Check that all chores are displayed
    for (const chore of chores) {
      await expect(page.getByText(chore.title)).toBeVisible();
    }
  });

  test('should handle form cancellation', async ({ page }) => {
    // Fill out form partially
    await page.getByLabel(/Titel|Title/i).fill('Cancelled Chore');
    
    // Click cancel
    await page.getByRole('button', { name: /Annuleren|Cancel/i }).click();
    
    // Form should be reset
    await expect(page.getByLabel(/Titel|Title/i)).toHaveValue('');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that form is still usable
    await expect(page.getByLabel(/Titel|Title/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Toevoegen|Add/i })).toBeVisible();
    
    // Check that buttons are properly sized for touch
    const addButton = page.getByRole('button', { name: /Toevoegen|Add/i });
    const buttonBox = await addButton.boundingBox();
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

  test('should show frequency options correctly', async ({ page }) => {
    // Check frequency dropdown
    const frequencySelect = page.getByLabel(/Frequentie|Frequency/i);
    await expect(frequencySelect).toBeVisible();
    
    // Check frequency options
    await frequencySelect.click();
    await expect(page.getByText(/Dagelijks|Daily/i)).toBeVisible();
    await expect(page.getByText(/Wekelijks|Weekly/i)).toBeVisible();
    await expect(page.getByText(/Eenmalig|One-off/i)).toBeVisible();
  });

  test('should validate XP and coin values', async ({ page }) => {
    // Try to submit with invalid XP
    await page.getByLabel(/Titel|Title/i).fill('Invalid XP Chore');
    await page.getByLabel(/Frequentie|Frequency/i).selectOption('DAILY');
    await page.getByLabel(/Basis XP|Base XP/i).fill('0'); // Invalid XP
    await page.getByLabel(/Basis munten|Base Coins/i).fill('1');
    
    await page.getByRole('button', { name: /Toevoegen|Add/i }).click();
    
    // Should show validation error
    await expect(page.getByText(/XP moet minimaal 1 zijn|XP must be at least 1/i)).toBeVisible();
  });
}); 