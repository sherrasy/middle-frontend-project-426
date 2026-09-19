import { test, expect } from '@playwright/test';
import { TEST_IDS } from '@/shared/constants/testids';
import {
  DEMO_EMAIL,
  DEMO_PASSWORD,
  TEST_PASSWORD,
} from './_fixtures/authFormData';
import { ROUTES } from '@/shared/constants/routes';

// Хелпер для генерации уникального email, чтобы тесты не падали из-за конфликта "email уже занят"
const generateUniqueEmail = () =>
  `test-${Date.now()}-${Math.random().toString(36).substring(2, 7)}@example.com`;

test.describe('Authentication Flow', () => {
  // 1. Новый пользователь регистрируется и оказывается авторизованным
  test('should register a new user and authenticate them', async ({ page }) => {
    const uniqueEmail = generateUniqueEmail();

    await page.goto(ROUTES.SIGNUP);

    await page.getByTestId(TEST_IDS.auth.email).fill(uniqueEmail);
    await page.getByTestId(TEST_IDS.auth.password).fill(TEST_PASSWORD);
    await page.getByTestId(TEST_IDS.auth.submit).click();

    await expect(page.getByTestId(TEST_IDS.nav.account)).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByTestId(TEST_IDS.nav.signout)).toBeVisible();
  });

  // 2. Зарегистрированный пользователь входит по своим email и паролю
  test('should login an existing user with valid credentials', async ({
    page,
  }) => {
    await page.goto(ROUTES.SIGNIN);

    await page.getByTestId(TEST_IDS.auth.email).fill(DEMO_EMAIL);
    await page.getByTestId(TEST_IDS.auth.password).fill(DEMO_PASSWORD);
    await page.getByTestId(TEST_IDS.auth.submit).click();

    await expect(page.getByTestId(TEST_IDS.nav.account)).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByTestId(TEST_IDS.nav.signout)).toBeVisible();
  });

  // 3. Авторизованный пользователь выходит, и личный раздел перестаёт быть доступен
  test('should logout user and restrict access to protected routes', async ({
    page,
  }) => {
    await page.goto(ROUTES.SIGNIN);
    await page.getByTestId(TEST_IDS.auth.email).fill(DEMO_EMAIL);
    await page.getByTestId(TEST_IDS.auth.password).fill(DEMO_PASSWORD);
    await page.getByTestId(TEST_IDS.auth.submit).click();

    await expect(page.getByTestId(TEST_IDS.nav.account)).toBeVisible();

    await page.getByTestId(TEST_IDS.nav.signout).click();

    await expect(page.getByTestId(TEST_IDS.nav.signin)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.nav.signup)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.nav.account)).not.toBeVisible();

    await page.goto(ROUTES.CABINET);

    await expect(page).toHaveURL(/.*sign-in/);
  });

  // 4. Регистрация с уже занятым email отклоняется с понятным сообщением
  test('should show error when registering with an existing email', async ({
    page,
  }) => {
    await page.goto(ROUTES.SIGNUP);

    await page.getByTestId(TEST_IDS.auth.email).fill(DEMO_EMAIL);
    await page.getByTestId(TEST_IDS.auth.password).fill(TEST_PASSWORD);
    await page.getByTestId(TEST_IDS.auth.submit).click();

    const errorBox = page.getByTestId(TEST_IDS.auth.error);
    await expect(errorBox).toBeVisible();

    await expect(errorBox).toContainText('Этот email уже зарегистрирован');
  });

  // 5. Вход с неверным паролем отклоняется с понятным сообщением
  test('should show error when logging in with invalid password', async ({
    page,
  }) => {
    await page.goto(ROUTES.SIGNIN);

    await page.getByTestId(TEST_IDS.auth.email).fill(DEMO_EMAIL);
    await page.getByTestId(TEST_IDS.auth.password).fill('wrong_password_123');
    await page.getByTestId(TEST_IDS.auth.submit).click();

    const errorBox = page.getByTestId(TEST_IDS.auth.error);
    await expect(errorBox).toBeVisible();

    await expect(errorBox).toContainText('Неверный email или пароль');
  });

  // 6. После перезагрузки страницы пользователь остаётся авторизованным
  test('should persist authentication state after page reload', async ({
    page,
  }) => {
    await page.goto(ROUTES.SIGNIN);
    await page.getByTestId(TEST_IDS.auth.email).fill(DEMO_EMAIL);
    await page.getByTestId(TEST_IDS.auth.password).fill(DEMO_PASSWORD);
    await page.getByTestId(TEST_IDS.auth.submit).click();

    await expect(page.getByTestId(TEST_IDS.nav.account)).toBeVisible();

    await page.reload();

    await expect(page.getByTestId(TEST_IDS.nav.account)).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByTestId(TEST_IDS.nav.signout)).toBeVisible();
  });

  // 7. Неавторизованный посетитель не попадает на защищённую страницу по прямому адресу
  test('should redirect unauthenticated user from protected route to signin', async ({
    page,
  }) => {
    await page.context().clearCookies();

    await page.goto(ROUTES.CABINET);

    await expect(page).toHaveURL(/.*sign-in/);

    await expect(page.getByTestId(TEST_IDS.auth.email)).toBeVisible();
  });
});
