import { Page } from '@playwright/test';
import { PROMO_BLOCKS_FIXTURE } from '../_fixtures/promoData';

export const mockPromoBlocks = async (page: Page) => {
  await page.route('**/api/promo', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(PROMO_BLOCKS_FIXTURE),
    });
  });
};
