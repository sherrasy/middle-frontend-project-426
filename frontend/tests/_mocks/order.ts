import { Page, Route } from '@playwright/test';
import { components } from '@/shared/types/api-schema';
import { OrderItem, OrderList } from '@/entities/order';
import { ORDER_FIXTURE } from '../_fixtures/orderData';

const UNAVAILABLE_PRODUCT_ID = 3;

const fulfillJson = (route: Route, status: number, body: unknown) =>
  route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });

const fulfillOrderSuccess = (route: Route) =>
  fulfillJson(route, 201, ORDER_FIXTURE);

const fulfillOrderList = (route: Route, orders: (typeof ORDER_FIXTURE)[]) =>
  fulfillJson(route, 200, {
    items: orders,
    total: orders.length,
  } as OrderList);

const fulfillEmptyCart = (route: Route) =>
  fulfillJson(route, 400, { code: 400, message: 'Корзина пуста' });

const fulfillOrderRejected = (route: Route) =>
  fulfillJson(route, 400, {
    code: 400,
    message: 'Невозможно создать заказ из-за проблем с товарами',
    problematicProducts: [
      {
        productId: UNAVAILABLE_PRODUCT_ID,
        reason: 'Товар временно недоступен для покупки',
      },
    ],
  } as components['schemas']['OrderCreationError']);

export const mockCreateOrderSuccess = async (page: Page) => {
  await page.route('**/api/orders', fulfillOrderSuccess);
};

export const mockCreateOrderEmpty = async (page: Page) => {
  await page.route('**/api/orders', async (route) => {
    const { items = [] } = JSON.parse(route.request().postData() || '{}');
    return items.length === 0
      ? fulfillEmptyCart(route)
      : fulfillOrderSuccess(route);
  });
};

export const mockCreateOrderInvalid = async (page: Page) => {
  await page.route('**/api/orders', async (route) => {
    const { items = [] } = JSON.parse(route.request().postData() || '{}');
    const hasUnavailable = items.some(
      (item: OrderItem) => item.productId === UNAVAILABLE_PRODUCT_ID,
    );
    return hasUnavailable
      ? fulfillOrderRejected(route)
      : fulfillOrderSuccess(route);
  });
};

export const mockGetMyOrders = async (page: Page, isEmpty = false) => {
  await page.route('**/api/orders', async (route) => {
    if (route.request().method() !== 'GET') {
      return route.continue();
    }
    return fulfillOrderList(route, isEmpty ? [] : [ORDER_FIXTURE]);
  });
};

export const mockGetOrderById = async (page: Page, orderId: number) => {
  await page.route(`**/api/orders/${orderId}`, (route) =>
    fulfillJson(route, 200, ORDER_FIXTURE),
  );
};

export const addProductToCart = async (page: Page, productId: number) => {
  await page.addInitScript((id) => {
    window.localStorage.setItem('cart', JSON.stringify({ [id]: 2 }));
  }, productId);
};
