import { Outlet } from 'react-router-dom';
import { ErrorButton } from './errorButton';
import { Header } from './header';

export const MainLayout = () => (
  <div className='min-h-screen bg-gray-50 text-gray-900'>
    <Header />
    <div className='absolute top-4 right-4'>
      <ErrorButton />
    </div>
    <main
      className={`max-w-6xl mx-auto px-4 py-8 flex flex-col items-center gap-6`}
    >
      <Outlet />
    </main>
  </div>
);
