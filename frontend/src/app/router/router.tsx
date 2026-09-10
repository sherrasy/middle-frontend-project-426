import { HomePage } from '@/pages/home';
import { ROUTES } from '@/shared/constants/routes';
import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layout/layout';

export const router = createBrowserRouter([
  {
    path: ROUTES.MAIN,
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTES.NOT_FOUND, element: <HomePage /> },
    ],
  },
]);
