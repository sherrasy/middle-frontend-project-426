import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/router';
import './app/styles/index.css';
import { initSentry } from './shared/config/initSentry';
import { AuthProvider } from './entities/auth';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './shared/config/queryClient';

initSentry();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
);
