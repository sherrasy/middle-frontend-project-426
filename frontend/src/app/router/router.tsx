import { HomePage } from '@/pages/home';
import { ROUTES } from '@/shared/constants/routes';
import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layout/layout';
import { SignInPage } from '@/pages/sign-in';
import { SignUpPage } from '@/pages/sign-up';

export const router = createBrowserRouter([
  {
    path: ROUTES.MAIN,
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTES.SIGNIN, element: <SignInPage /> },
      { path: ROUTES.SIGNUP, element: <SignUpPage /> },
      { path: ROUTES.NOT_FOUND, element: <HomePage /> },
    ],
  },
]);
