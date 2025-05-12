# Test info

- Name: Home page >> should display welcome title
- Location: /Users/phillipdacosta/military-dog/tests/color.spec.ts:8:7

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/", waiting until "load"

    at /Users/phillipdacosta/military-dog/tests/color.spec.ts:5:16
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Home page', () => {
   4 |   test.beforeEach(async ({ page }) => {
>  5 |     await page.goto('/');
     |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
   6 |   });
   7 |
   8 |   test('should display welcome title', async ({ page }) => {
   9 |     await expect(page.locator('h2.card-title')).toHaveText('Small app title');
  10 |   });
  11 |
  12 |   test('clicking the button changes card color', async ({ page }) => {
  13 |     const card = page.locator('.basic-card');
  14 |     const initialBg = await card.evaluate(el => getComputedStyle(el).backgroundColor);
  15 |
  16 |     await page.click('button.action-button');
  17 |     const newBg = await card.evaluate(el => getComputedStyle(el).backgroundColor);
  18 |
  19 |     expect(newBg).not.toBe(initialBg);
  20 |   });
  21 | });
  22 |
```