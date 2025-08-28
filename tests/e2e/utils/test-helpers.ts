import { Page, expect } from '@playwright/test';

/**
 * Mock Clerk authentication for testing
 */
export async function mockClerkAuth(page: Page) {
  await page.addInitScript(() => {
    (window as any).__CLERK_FRONTEND_API = 'mock';
    (window as any).__CLERK_PUBLISHABLE_KEY = 'mock';
  });
}

/**
 * Wait for page to be fully loaded
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
}

/**
 * Wait for element to be visible with timeout
 */
export async function waitForElement(page: Page, selector: string, timeout = 5000) {
  await page.waitForSelector(selector, { state: 'visible', timeout });
}

/**
 * Fill form field with validation
 */
export async function fillFormField(page: Page, label: string, value: string) {
  const field = page.getByLabel(label);
  await expect(field).toBeVisible();
  await field.fill(value);
}

/**
 * Select dropdown option with validation
 */
export async function selectDropdownOption(page: Page, label: string, option: string) {
  const dropdown = page.getByLabel(label);
  await expect(dropdown).toBeVisible();
  await dropdown.selectOption(option);
}

/**
 * Click button with validation
 */
export async function clickButton(page: Page, name: string) {
  const button = page.getByRole('button', { name: new RegExp(name, 'i') });
  await expect(button).toBeVisible();
  await button.click();
}

/**
 * Navigate to page with validation
 */
export async function navigateTo(page: Page, url: string, expectedTitle?: string) {
  await page.goto(url);
  if (expectedTitle) {
    await expect(page.locator('h1')).toContainText(expectedTitle);
  }
}

/**
 * Check responsive design on mobile
 */
export async function testMobileResponsiveness(page: Page, testFunction: () => Promise<void>) {
  // Test on mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await testFunction();
  
  // Test on tablet viewport
  await page.setViewportSize({ width: 768, height: 1024 });
  await testFunction();
  
  // Test on desktop viewport
  await page.setViewportSize({ width: 1200, height: 800 });
  await testFunction();
}

/**
 * Create test kid data
 */
export function createTestKid(name: string, avatar = '👶') {
  return {
    displayName: name,
    avatar
  };
}

/**
 * Create test chore data
 */
export function createTestChore(title: string, frequency = 'DAILY', xp = 15, coins = 2) {
  return {
    title,
    description: `Test description for ${title}`,
    frequency,
    baseXp: xp,
    baseCoins: coins
  };
}

/**
 * Wait for API response
 */
export async function waitForAPIResponse(page: Page, urlPattern: RegExp, timeout = 5000) {
  await page.waitForResponse(response => 
    response.url().includes(urlPattern.source) && response.status() === 200,
    { timeout }
  );
}

/**
 * Check for error messages
 */
export async function expectNoErrors(page: Page) {
  const errorElements = page.locator('.alert-error, .text-error, [role="alert"]');
  if (await errorElements.count() > 0) {
    const errorText = await errorElements.first().textContent();
    throw new Error(`Unexpected error found: ${errorText}`);
  }
}

/**
 * Check for success messages
 */
export async function expectSuccessMessage(page: Page, message?: string) {
  const successElements = page.locator('.alert-success, .text-success, [role="status"]');
  if (message) {
    await expect(successElements.filter({ hasText: message })).toBeVisible();
  } else {
    await expect(successElements.first()).toBeVisible();
  }
}

/**
 * Mock database state for testing
 */
export async function setupTestDatabase(page: Page) {
  // This would typically involve API calls to set up test data
  // For now, we'll just ensure the page is ready
  await waitForPageLoad(page);
}

/**
 * Clean up test data
 */
export async function cleanupTestData(page: Page) {
  // This would typically involve API calls to clean up test data
  // For now, we'll just wait a bit for any cleanup operations
  await page.waitForTimeout(1000);
}

/**
 * Test form validation
 */
export async function testFormValidation(
  page: Page, 
  submitButton: string, 
  expectedErrors: string[]
) {
  // Click submit without filling required fields
  await clickButton(page, submitButton);
  
  // Check that all expected errors are shown
  for (const error of expectedErrors) {
    await expect(page.getByText(error)).toBeVisible();
  }
}

/**
 * Test form submission success
 */
export async function testFormSubmission(
  page: Page,
  formData: Record<string, string | number>,
  submitButton: string,
  successIndicator: string
) {
  // Fill out form
  for (const [field, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      await fillFormField(page, field, value);
    } else {
      await page.getByLabel(field).fill(value.toString());
    }
  }
  
  // Submit form
  await clickButton(page, submitButton);
  
  // Wait for success
  await page.waitForTimeout(1000);
  
  // Check success indicator
  await expect(page.getByText(successIndicator)).toBeVisible();
}

/**
 * Test CRUD operations
 */
export async function testCRUDOperations(
  page: Page,
  createData: Record<string, string | number>,
  updateData: Record<string, string | number>,
  deleteConfirmation = true
) {
  // Create
  await testFormSubmission(page, createData, 'Add', createData.title as string);
  
  // Update
  const editButton = page.locator('button').filter({ hasText: /✏️|Edit/i }).first();
  await editButton.click();
  
  for (const [field, value] of Object.entries(updateData)) {
    if (typeof value === 'string') {
      await fillFormField(page, field, value);
    } else {
      await page.getByLabel(field).fill(value.toString());
    }
  }
  
  await clickButton(page, 'Update');
  await page.waitForTimeout(1000);
  await expect(page.getByText(updateData.title as string)).toBeVisible();
  
  // Delete
  const deleteButton = page.locator('button').filter({ hasText: /🗑️|Delete/i }).first();
  await deleteButton.click();
  
  if (deleteConfirmation) {
    page.on('dialog', dialog => dialog.accept());
  }
  
  await page.waitForTimeout(500);
  await expect(page.getByText(updateData.title as string)).not.toBeVisible();
} 