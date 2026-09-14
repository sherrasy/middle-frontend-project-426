import { test, expect } from '@playwright/test';
import { TEST_IDS } from '@/shared/constants/testids';

test.describe('Smoke test - Main Header', () => {
  test('should render main and have non-empty h1', async ({ page }) => {
    await page.goto('/');

    const heading = page.locator(`[data-testid="${TEST_IDS.smoke}"]`);

    await expect(heading).toBeVisible();

    const text = await heading.innerText();
    expect(text.trim().length).toBeGreaterThan(0);
  });
});
