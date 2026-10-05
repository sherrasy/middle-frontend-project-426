import { test, expect } from '@playwright/test';
import { TEST_IDS } from '@/shared/constants/testids';
import { ROUTES } from '@/shared/constants/routes';

import { mockAuthMe, loginTestUser } from './_mocks/auth';
import {
  addProductToCart,
  mockCreateOrderEmpty,
  mockCreateOrderInvalid,
  mockCreateOrderSuccess,
  mockGetMyOrders,
  mockGetOrderById,
} from './_mocks/order';
import { mockProductById } from './_mocks/product';
import { ORDER_FIXTURE } from './_fixtures/orderData';
import { formatPrice } from '@/shared/lib/formatters';

test.describe('Checkout and Account Flow', () => {
  // 1. Неавторизованный пользователь не может оформить заказ.
  test('unauthorized user cannot access checkout', async ({ page }) => {
    await mockAuthMe(page, false);
    await page.goto(ROUTES.CHECKOUT);

    await expect(page).toHaveURL(new RegExp(ROUTES.SIGNIN));
    await expect(page.getByTestId(TEST_IDS.checkout.form)).not.toBeVisible();
  });

  // 2. Авторизованный пользователь оформляет заказ и видит страницу успеха.
  test('authorized user can place order and sees success page', async ({
    page,
  }) => {
    await loginTestUser(page);
    await addProductToCart(page, 1);

    await mockCreateOrderSuccess(page);
    await mockProductById(page, 1);

    await page.goto(ROUTES.CHECKOUT);

    await page
      .getByTestId(TEST_IDS.checkout.name)
      .fill(ORDER_FIXTURE.recipientName);
    await page
      .getByTestId(TEST_IDS.checkout.phone)
      .fill(ORDER_FIXTURE.recipientPhone);
    await page.getByTestId(TEST_IDS.checkout.method).selectOption('pickup');

    const submitButton = page.getByTestId(TEST_IDS.checkout.submit);

    await Promise.all([page.waitForURL(ROUTES.SUCCESS), submitButton.click()]);

    await expect(page.getByTestId(TEST_IDS.order.success)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.order.total)).toHaveText(
      formatPrice(43980),
    );
  });

  // 3. Пустую корзину оформить нельзя.
  test('cannot place order with empty cart', async ({ page }) => {
    await loginTestUser(page);
    await mockCreateOrderEmpty(page);

    await page.goto(ROUTES.CHECKOUT);
    await expect(page.getByTestId(TEST_IDS.cart.checkout)).toBeDisabled();
  });

  // 4. Итоговая сумма заказа совпадает с суммой позиций и не зависит от того, что прислал клиент.
  test('order total comes from server and matches sum', async ({ page }) => {
    await loginTestUser(page);
    await mockCreateOrderSuccess(page);
    await addProductToCart(page, 1);

    await page.goto(ROUTES.CHECKOUT);
    await page
      .getByTestId(TEST_IDS.checkout.name)
      .fill(ORDER_FIXTURE.recipientName);
    await page
      .getByTestId(TEST_IDS.checkout.phone)
      .fill(ORDER_FIXTURE.recipientPhone);
    await page.getByTestId(TEST_IDS.checkout.method).selectOption('pickup');

    await page.getByTestId(TEST_IDS.checkout.submit).click();

    await expect(page).toHaveURL(ROUTES.SUCCESS);
    await expect(page.getByTestId(TEST_IDS.order.total)).toHaveText(
      formatPrice(43980),
    );
  });

  // 5. При выборе доставки адрес обязателен, при самовывозе — не запрашивается.
  test('address is required for delivery, hidden for pickup', async ({
    page,
  }) => {
    await loginTestUser(page);
    await addProductToCart(page, 1);

    await page.goto(ROUTES.CHECKOUT);

    await page.getByTestId(TEST_IDS.checkout.method).selectOption('delivery');
    await expect(page.getByTestId(TEST_IDS.checkout.address)).toBeVisible();

    await page.getByTestId(TEST_IDS.checkout.method).selectOption('pickup');
    await expect(page.getByTestId(TEST_IDS.checkout.address)).not.toBeVisible();
  });

  // 6. Заказ с недоступным товаром отклоняется целиком, ошибка показывается пользователю.
  test('order with unavailable product is rejected with server error code', async ({
    page,
  }) => {
    await loginTestUser(page);
    await addProductToCart(page, 3);
    await mockCreateOrderInvalid(page);

    await page.goto(ROUTES.CHECKOUT);
    await page
      .getByTestId(TEST_IDS.checkout.name)
      .fill(ORDER_FIXTURE.recipientName);
    await page
      .getByTestId(TEST_IDS.checkout.phone)
      .fill(ORDER_FIXTURE.recipientPhone);
    await page.getByTestId(TEST_IDS.checkout.method).selectOption('pickup');

    const responsePromise = page.waitForResponse('**/api/orders');
    await page.getByTestId(TEST_IDS.checkout.submit).click();
    const response = await responsePromise;

    expect(response.status()).toBe(400);

    await expect(page.getByTestId(TEST_IDS.order.error)).toBeVisible();
    await expect(
      page.getByText('Товар временно недоступен для покупки'),
    ).toBeVisible();
  });

  // 7. В личном кабинете видны заказы этого пользователя и не видны чужие.
  test('account shows only current user orders', async ({ page }) => {
    await loginTestUser(page);
    await mockGetMyOrders(page, false);

    await page.goto(ROUTES.CABINET);

    await expect(page.getByTestId(TEST_IDS.account.orders)).toBeVisible();
    await expect(
      page.getByTestId(TEST_IDS.account.ordersEmpty),
    ).not.toBeVisible();
    await expect(page.getByTestId(TEST_IDS.account.orderItem)).toHaveCount(1);
  });

  // 8. Открытый заказ показывает состав, количество, цены на момент покупки и итог.
  test('opened order displays correct composition', async ({ page }) => {
    await loginTestUser(page);
    await mockGetMyOrders(page, false);
    await mockGetOrderById(page, 1001);

    await page.goto(ROUTES.CABINET);

    await page.getByTestId(TEST_IDS.account.orderToggle).click();

    const orderItem = page.getByTestId(TEST_IDS.account.orderItem).first();

    const status = orderItem.getByTestId(TEST_IDS.order.status);
    await expect(status).toBeVisible();
    await expect(status).toHaveAttribute('data-status', 'paid');

    const line = orderItem.getByTestId(TEST_IDS.account.orderLine).first();
    await expect(line).toBeVisible();

    await expect(line.getByTestId(TEST_IDS.account.orderLineQty)).toHaveText(
      '2',
    );

    await expect(line.getByTestId(TEST_IDS.account.orderLinePrice)).toHaveText(
      formatPrice(21990),
    );

    await expect(orderItem.getByTestId(TEST_IDS.order.total))
      .toHaveText(`Итого: 
      ${formatPrice(43980)}`);
  });
});
