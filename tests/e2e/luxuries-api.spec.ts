import { test, expect } from '@playwright/test';

test.describe('Luxuries API', () => {
  test('GET /api/kids/[id]/luxuries requires auth', async ({ page }) => {
    const res = await page.request.get('/api/kids/test-id/luxuries');
    expect(res.status()).toBe(401);
  });

  test('POST /api/kids/[id]/luxuries requires auth', async ({ page }) => {
    const res = await page.request.post('/api/kids/test-id/luxuries', {
      data: [{ title: '15 min YouTube', type: 'TIME', minutes: 15, rank: 1, assignedGame: 'reaction' }],
    });
    expect(res.status()).toBe(401);
  });

  test('POST /api/games/[id]/win requires auth', async ({ page }) => {
    const res = await page.request.post('/api/games/reaction/win', {
      data: { kidId: 'some-kid' },
    });
    expect(res.status()).toBe(401);
  });
});

