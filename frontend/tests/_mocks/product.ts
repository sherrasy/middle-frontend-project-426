import { Page, Route } from '@playwright/test';
import { CATRGORIES_FIXTURE, PRODUCTS_FIXTURE } from '../_fixtures/catalogData';
import { ROUTES } from '@/shared/constants/routes';
import { TEST_IDS } from '@/shared/constants/testids';

const PAGE_SIZE = 3;
export const getProductRoute = (id: number) => `${ROUTES.CATALOG}/${id}`;

const fulfillJson = (route: Route, status: number, body: unknown) =>
  route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });

const fulfillCategories = (route: Route) =>
  fulfillJson(route, 200, CATRGORIES_FIXTURE);

const fulfillProducts = (route: Route, items: unknown[]) => {
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

  const filtered = (items as typeof PRODUCTS_FIXTURE).filter((p) => {
    if (categoryId && p.categoryId !== categoryId) return false;
    if (search && !p.name.toLowerCase().includes(search)) return false;
    if (p.price < priceFrom || p.price > priceTo) return false;
    if (onlyAvailable && !p.isAccessible) return false;
    return true;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  const start = (pageParam - 1) * PAGE_SIZE;

  return fulfillJson(route, 200, {
    items: filtered.slice(start, start + PAGE_SIZE),
    total,
    page: pageParam,
    pageSize: PAGE_SIZE,
    totalPages,
  });
};

const fulfillEmptyProducts = (route: Route) =>
  fulfillJson(route, 200, {
    items: [],
    total: 0,
    page: 1,
    pageSize: PAGE_SIZE,
    totalPages: 0,
  });

const fulfillProductById = (route: Route, productId: string | number) => {
  const product = PRODUCTS_FIXTURE.find((p) => p.id === Number(productId));
  return product
    ? fulfillJson(route, 200, product)
    : fulfillJson(route, 404, { message: 'Not found' });
};

export const navigateToProduct = async (page: Page, productId: number) => {
  await mockProductById(page, productId);
  await page.goto(getProductRoute(productId));
};

export const addProductToCartAndOpenCart = async (
  page: Page,
  productId: number,
) => {
  await navigateToProduct(page, productId);
  await page.getByTestId(TEST_IDS.product.addToCart).click();
  await page.getByTestId(TEST_IDS.nav.cart).click();
};

export const mockCategories = async (page: Page) => {
  await page.route('**/api/catalog/categories', fulfillCategories);
};

export const mockProducts = async (page: Page) => {
  await page.route(/\/api\/catalog\/products(\?.*)?$/, (route) =>
    fulfillProducts(route, PRODUCTS_FIXTURE),
  );
};

export const mockProductsEmpty = async (page: Page) => {
  await page.route(/\/api\/catalog\/products(\?.*)?$/, fulfillEmptyProducts);
};

export const mockProductById = async (
  page: Page,
  productId: string | number,
) => {
  await page.route(`**/catalog/products/${productId}`, (route) =>
    fulfillProductById(route, productId),
  );
};
