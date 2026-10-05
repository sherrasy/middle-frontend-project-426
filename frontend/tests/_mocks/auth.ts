import { Page, Route } from '@playwright/test';
import { DEMO_EMAIL, DEMO_PASSWORD } from '../_fixtures/authFormData';
import { ROUTES } from '@/shared/constants/routes';
import { TEST_IDS } from '@/shared/constants/testids';

const USER_FIXTURE = { id: 1, email: DEMO_EMAIL };

export const generateUniqueEmail = () =>
  `test-${Date.now()}-${Math.random().toString(36).substring(2, 7)}@example.com`;

const fulfillJson = (route: Route, status: number, body: unknown) =>
  route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });

export const mockAuthMe = async (page: Page, isAuthenticated = true) => {
  await page.route('**/api/auth/me', (route) =>
    isAuthenticated
      ? fulfillJson(route, 200, USER_FIXTURE)
      : fulfillJson(route, 401, { code: 401, message: 'Unauthorized' }),
  );
};

export const loginTestUser = async (page: Page) => {
  await mockAuthMe(page, true);

  await page.goto(ROUTES.SIGNIN);

  await page.getByTestId(TEST_IDS.auth.email).fill(DEMO_EMAIL);
  await page.getByTestId(TEST_IDS.auth.password).fill(DEMO_PASSWORD);
  await page.getByTestId(TEST_IDS.auth.submit).click();

  await page.waitForURL(ROUTES.CABINET);
};
