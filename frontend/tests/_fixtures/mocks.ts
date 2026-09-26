import { Page } from '@playwright/test';
// Импортируйте ваши фикстуры.
// Предполагаем, что PRODUCTS_FIXTURE имеет структуру { items: Product[], total: number, ... }
import { CATRGORIES_FIXTURE, PRODUCTS_FIXTURE } from './catalogData';

export interface MockResponse<T = unknown> {
  status: number;
  body: T;
}

export const mockCategories = async (page: Page) => {
  await page.route('**/api/catalog/categories', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(CATRGORIES_FIXTURE),
    });
  });
};

export const mockProducts = async (page: Page) => {
  await page.route(/\/api\/catalog\/products(\?.*)?$/, async (route) => {
    const url = new URL(route.request().url());
    const params = url.searchParams;

    const search = params.get('search')?.toLowerCase() || '';
    const categoryId = params.get('categoryId')
      ? Number(params.get('categoryId'))
      : null;
    const priceFrom = params.get('priceFrom')
      ? Number(params.get('priceFrom'))
      : 0;
    const priceTo = params.get('priceTo')
      ? Number(params.get('priceTo'))
      : Infinity;
    const onlyAvailable = params.get('onlyAvailable') === 'true';

    const pageParam = Number(params.get('page') || 1);
    const pageSize = 3;

    const filteredItems = PRODUCTS_FIXTURE.filter((p) => {
      if (categoryId && p.categoryId !== categoryId) return false;
      if (search && !p.name.toLowerCase().includes(search)) return false;
      if (p.price < priceFrom || p.price > priceTo) return false;
      if (onlyAvailable && !p.isAccessible) return false;
      return true;
    });

    const total = filteredItems.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const start = (pageParam - 1) * pageSize;
    const pagedItems = filteredItems.slice(start, start + pageSize);

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        items: pagedItems,
        total,
        page: pageParam,
        pageSize,
        totalPages,
      }),
    });
  });
};

export const mockProductsEmpty = async (page: Page) => {
  await page.route(/\/api\/catalog\/products(\?.*)?$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        items: [],
        total: 0,
        page: 1,
        pageSize: 3,
        totalPages: 0,
      }),
    });
  });
};
