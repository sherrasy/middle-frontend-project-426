import { HomePage } from '@/pages/home';
import { ROUTES } from '@/shared/constants/routes';
import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layout/layout';
import { SignUpPage } from '@/pages/sign-up';
import { SignInPage } from '@/pages/sign-in';
import { RequireAuth } from './protected-route';

export const router = createBrowserRouter([
  {
    path: ROUTES.MAIN,
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTES.SIGNIN, element: <SignInPage /> },
      { path: ROUTES.SIGNUP, element: <SignUpPage /> },
      {
        path: ROUTES.CATALOG,
        element: <HomePage />,
      },
      {
        path: ROUTES.CART,
        element: <HomePage />,
      },
      {
        path: ROUTES.CABINET,
        element: (
          <RequireAuth>
            <HomePage />
          </RequireAuth>
        ),
      },
      { path: ROUTES.NOT_FOUND, element: <HomePage /> },
    ],
  },
]);
