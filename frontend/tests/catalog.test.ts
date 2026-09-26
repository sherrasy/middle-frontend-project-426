import { test, expect } from '@playwright/test';
import { ROUTES } from '@/shared/constants/routes';
import { mockCategories, mockProducts } from './_fixtures/mocks';
import { TEST_IDS } from '@/shared/constants/testids';

test.describe('Catalog Flow', () => {
  test.beforeEach(async ({ page }) => {
    await mockCategories(page);
    await mockProducts(page);

    await page.goto(ROUTES.CATALOG);

    await expect(page.getByTestId(TEST_IDS.catalog.list)).toBeVisible();
  });

  // 1. Каталог загружается, карточки товаров видны. В карточке есть название, цена и доступность.
  test('should load catalog', async ({ page }) => {
    const firstItem = page.getByTestId(TEST_IDS.catalog.item).first();
    await expect(firstItem).toBeVisible();

    await expect(
      firstItem.getByTestId(TEST_IDS.catalog.itemName),
    ).toBeVisible();
    await expect(
      firstItem.getByTestId(TEST_IDS.catalog.itemPrice),
    ).toBeVisible();

    const availability = firstItem.getByTestId(
      TEST_IDS.catalog.itemAvailability,
    );
    await expect(availability).toBeVisible();
    await expect(availability).toHaveAttribute('data-available', /true|false/);
  });

  // 2. Фильтр по категории сужает список.
  test('should narrow down list when category filter is set', async ({
    page,
  }) => {
    await page.getByTestId(TEST_IDS.filter.category).selectOption('2');
    await page.waitForResponse((resp) =>
      resp.url().includes('/catalog/products'),
    );

    const items = page.getByTestId(TEST_IDS.catalog.item);
    await expect(items).toHaveCount(3);
    await expect(page.getByText('RTX').first()).toBeVisible();
    await expect(page.getByText('Ryzen').first()).not.toBeVisible();
  });

  // 3. Поиск по части названия оставляет в выдаче подходящий товар.
  test('should filter products by partial name search', async ({ page }) => {
    const searchInput = page.getByTestId(TEST_IDS.filter.search);
    await searchInput.fill('Ryzen');

    await page.waitForResponse(
      (resp) =>
        resp.url().includes('/catalog/products') &&
        resp.request().method() === 'GET',
    );

    const items = page.getByTestId(TEST_IDS.catalog.item);
    await expect(items).toHaveCount(3);
  });

  // 4. Фильтр по цене меняет состав выдачи.
  test('should change results when price filter is applied', async ({
    page,
  }) => {
    const responsePromise = page.waitForResponse((resp) =>
      resp.url().includes('/catalog/products'),
    );

    await page.getByTestId(TEST_IDS.filter.priceMin).fill('40000');
    await page.getByTestId(TEST_IDS.filter.priceMax).fill('56000');

    await responsePromise;

    const items = page.getByTestId(TEST_IDS.catalog.item);
    await expect(items).toHaveCount(2);
    await expect(page.getByText('21990')).not.toBeVisible();
  });

  // 5. Сброс фильтров возвращает полный список.
  test('should reset filters and list', async ({ page }) => {
    await page.getByTestId(TEST_IDS.filter.category).selectOption('1');
    await page.waitForResponse((resp) =>
      resp.url().includes('/catalog/products'),
    );

    await page.getByTestId(TEST_IDS.filter.reset).click();

    await expect(page.getByTestId(TEST_IDS.catalog.list)).toBeVisible();
    await expect(page.getByText('Найдено товаров: 8')).toBeVisible();

    await expect(page.getByTestId(TEST_IDS.filter.category)).toHaveValue('');
    await expect(page.getByTestId(TEST_IDS.filter.priceMin)).toHaveValue('');

    await expect(page.getByText('Ryzen').first()).toBeVisible();
    await expect(page.getByText('Intel').first()).toBeVisible();
  });
  // 6. Комбинация фильтров, под которую ничего не подходит, показывает пустое состояние.
  test('should show empty state', async ({ page }) => {
    await page
      .getByTestId(TEST_IDS.filter.search)
      .fill('НесуществующийТовар12345');
    await page.waitForResponse((resp) =>
      resp.url().includes('/catalog/products'),
    );

    await expect(page.getByTestId(TEST_IDS.catalog.empty)).toBeVisible();
    await expect(page.getByText('Товары не найдены')).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.catalog.list)).not.toBeVisible();
  });

  // 7.Переход на следующую страницу меняет набор карточек.
  test('should change product set on next page', async ({ page }) => {
    const firstItemNamePage1 = await page
      .getByTestId(TEST_IDS.catalog.itemName)
      .first()
      .textContent();

    await page.getByTestId(TEST_IDS.catalog.pageNext).click();
    await page.waitForResponse((resp) =>
      resp.url().includes('/catalog/products'),
    );

    const firstItemNamePage2 = await page
      .getByTestId(TEST_IDS.catalog.itemName)
      .first()
      .textContent();
    expect(firstItemNamePage1).not.toBe(firstItemNamePage2);

    expect(page.url()).toContain('page=2');
  });

  // 8. Смена фильтра возвращает на первую страницу выдачи.
  test('should return to first page when filter is changed', async ({
    page,
  }) => {
    await page.getByTestId(TEST_IDS.catalog.pageNext).click();
    await page.waitForResponse((resp) =>
      resp.url().includes('/catalog/products'),
    );
    expect(page.url()).toContain('page=2');

    await page.getByTestId(TEST_IDS.filter.category).selectOption('2');
    await page.waitForResponse((resp) =>
      resp.url().includes('/catalog/products'),
    );

    expect(page.url()).not.toContain('page=2');
  });

  // 9. На первой странице «назад» не уводит в несуществующую страницу.
  test('should disable previous page button', async ({ page }) => {
    const prevButton = page.getByTestId(TEST_IDS.catalog.pagePrev);

    const isDisabled = await prevButton.isDisabled();

    expect(isDisabled).toBeTruthy();
  });

  // 10. Перезагрузка страницы с выбранным фильтром сохраняет выдачу и значения контролов.
  test('should preserve filter on reload', async ({ page }) => {
    const categoryFilter = page.getByTestId(TEST_IDS.filter.category);

    await categoryFilter.selectOption('1');

    await page.waitForResponse((resp) =>
      resp.url().includes('/catalog/products'),
    );

    await expect(categoryFilter).toHaveValue('1');
    await expect(page.getByText('Найдено товаров: 5')).toBeVisible();

    await page.reload();

    await expect(page.getByTestId(TEST_IDS.catalog.list)).toBeVisible();
    await expect(categoryFilter).toHaveValue('1');

    await expect(page.getByText('RTX').first()).not.toBeVisible();
  });

  // 11. «Назад» после смены фильтра возвращает предыдущую выдачу.
  test('should revert state when using browser back', async ({ page }) => {
    await expect(page.getByTestId(TEST_IDS.filter.category)).toHaveValue('');
    await expect(page.getByText('Intel').first()).toBeVisible();

    await page.getByTestId(TEST_IDS.filter.category).selectOption('1');
    await page.waitForResponse((resp) =>
      resp.url().includes('/catalog/products'),
    );

    await expect(page.getByTestId(TEST_IDS.filter.category)).toHaveValue('1');
    await expect(page.getByText('RTX').first()).not.toBeVisible();

    await page.goBack();

    await expect(page.getByTestId(TEST_IDS.filter.category)).toHaveValue('');
    await expect(page.getByText('Intel').first()).toBeVisible();
  });
});
