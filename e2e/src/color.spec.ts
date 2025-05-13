import { test, expect } from '@playwright/test';
import { visualCheck } from '../../utils/visual-check-utils';
import { config as loadEnv } from 'dotenv';
loadEnv();

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display welcome title', async ({ page }) => {
    await expect(page.locator('h2.card-title')).toHaveText('Small app title');
  });

  test('clicking the button changes card color', async ({ page }) => {
    const card = page.locator('.basic-card');
    const initialBg = await card.evaluate(el => getComputedStyle(el).backgroundColor);

    await page.click('button.action-button');
    const newBg = await card.evaluate(el => getComputedStyle(el).backgroundColor);

    expect(newBg).not.toBe(initialBg);

    await visualCheck(page, 'Basic card test', {
      region: 'basic-card',
      masks: [],
    });
  });
});
