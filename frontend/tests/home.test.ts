import { test, expect } from '@playwright/test';
import { ROUTES } from '@/shared/constants/routes';
import {
  mockCategories,
  mockProducts,
  mockPromoBlocks,
} from './_fixtures/mocks';
import { TEST_IDS } from '@/shared/constants/testids';

test.describe('Home promo Flow', () => {
  test.beforeEach(async ({ page }) => {
    await mockCategories(page);
    await mockProducts(page);
    await mockPromoBlocks(page);

    await page.goto(ROUTES.MAIN);

    await expect(page.getByTestId(TEST_IDS.home.list)).toBeVisible();
  });

  // 1. Главная открывается на адресе / и показывает промо-блоки.
  test('should load home', async ({ page }) => {
    const promoList = page.getByTestId(TEST_IDS.home.list);
    await expect(promoList).toBeVisible();

    const promoItems = page.getByTestId(TEST_IDS.home.item);
    await expect(promoItems).toHaveCount(2);

    const firstItem = promoItems.first();
    await expect(firstItem).toBeVisible();
  });
  // 2. Клик по промо-блоку открывает страницу его товара.
  test('should redirect to product page', async ({ page }) => {
    const firstPromoItem = page.getByTestId(TEST_IDS.home.item).first();

    await firstPromoItem.click();

    await expect(page).toHaveURL(/\/catalog\/1$/);

    await expect(page.getByText('Product 1')).toBeVisible();
  });
  // 3. Из главной открывается каталог по ссылке в шапке.
  test(' should load catalog', async ({ page }) => {
    const catalogLink = page.getByTestId(TEST_IDS.nav.catalog);

    await expect(catalogLink).toBeVisible();
    await expect(catalogLink).toHaveAttribute('href', ROUTES.CATALOG);

    await catalogLink.click();

    await expect(page).toHaveURL(ROUTES.CATALOG);

    await expect(page.getByTestId(TEST_IDS.catalog.list)).toBeVisible();
  });
});
