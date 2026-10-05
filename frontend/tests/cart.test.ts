import { expect, test } from '@playwright/test';

import { ROUTES } from '@/shared/constants/routes';
import { TEST_IDS } from '@/shared/constants/testids';
import { formatPrice } from '@/shared/lib/formatters';
import { PRODUCTS_FIXTURE } from './_fixtures/catalogData';
import {
  addProductToCartAndOpenCart,
  mockCategories,
  mockProducts,
  navigateToProduct
} from './_mocks/product';

test.describe('Cart Flow', () => {
  const defaultProduct = PRODUCTS_FIXTURE[0];
  const { id, name, price, description } = defaultProduct;

  test.beforeEach(async ({ page }) => {
    await mockCategories(page);
    await mockProducts(page);
  });

  // 1.Карточка товара открывается и показывает название, цену и описание.
  test('should display product details correctly', async ({ page }) => {
    await navigateToProduct(page, id);

    await expect(page.getByTestId(TEST_IDS.product.name)).toHaveText(name);
    await expect(page.getByTestId(TEST_IDS.product.price)).toContainText(
      price.toLocaleString('ru-RU'),
    );
    await expect(page.getByTestId(TEST_IDS.product.description)).toHaveText(
      description,
    );
  });

  // 2.Товар добавляется в корзину и появляется в ней.
  test('should add product to cart and display it', async ({ page }) => {
    await addProductToCartAndOpenCart(page, id);

    await expect(page.getByTestId(TEST_IDS.cart.item)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.cart.item).locator('h2')).toHaveText(
      name,
    );
    await expect(page.getByTestId(TEST_IDS.cart.total)).toHaveText(
      formatPrice(price),
    );
  });

  // 3.Количество позиции меняется, итоговая сумма пересчитывается.
  test('should recalculate total when quantity changes', async ({ page }) => {
    await addProductToCartAndOpenCart(page, id);

    const qtyInput = page.getByTestId(TEST_IDS.cart.itemQty);
    await qtyInput.clear();
    await qtyInput.fill('2');

    await expect(page.getByTestId(TEST_IDS.cart.total)).toHaveText(
      formatPrice(price * 2),
    );
  });

  // 4.Позиция удаляется из корзины.
  test('should remove item from cart', async ({ page }) => {
    await addProductToCartAndOpenCart(page, id);

    await page.getByTestId(TEST_IDS.cart.itemRemove).click();

    await expect(page.getByTestId(TEST_IDS.cart.item)).not.toBeVisible();
    await expect(page.getByTestId(TEST_IDS.cart.empty)).toBeVisible();
  });

  // 5.Состав корзины сохраняется после перезагрузки страницы.
  test('should persist cart state after page reload', async ({ page }) => {
    await addProductToCartAndOpenCart(page, id);

    await page.reload();

    await expect(page.getByTestId(TEST_IDS.cart.item)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.cart.total)).toHaveText(
      formatPrice(price),
    );
  });

  // 6.Недоступный товар в корзину не добавляется.
  test('should not add inaccessible product to cart', async ({ page }) => {
    const inaccessibleProduct = PRODUCTS_FIXTURE[2];
    await navigateToProduct(page, inaccessibleProduct.id);

    const addToCartBtn = page.getByTestId(TEST_IDS.product.addToCart);
    await expect(addToCartBtn).toBeDisabled();

    await addToCartBtn.click({ force: true });
    await page.getByTestId(TEST_IDS.nav.cart).click();

    await expect(page.getByTestId(TEST_IDS.cart.empty)).toBeVisible();
  });

  // 7.Пустая корзина показывает своё состояние и не пускает к оформлению.
  test('should show empty state and disable checkout for empty cart', async ({
    page,
  }) => {
    await page.goto(ROUTES.CART);

    await expect(page.getByTestId(TEST_IDS.cart.empty)).toBeVisible();
    await expect(page.getByText('Корзина пуста')).toBeVisible();

    const checkoutBtn = page.getByTestId(TEST_IDS.cart.checkout);
    await expect(checkoutBtn).toBeDisabled();
    await expect(checkoutBtn).toHaveClass(/cursor-not-allowed/);
  });
});
