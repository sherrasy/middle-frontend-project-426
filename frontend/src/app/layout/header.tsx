import { Link } from 'react-router-dom';
import { TEST_IDS } from '@/shared/constants/testids';
import { ROUTES } from '@/shared/constants/routes';

export const Header = () => (
  <header className='bg-white shadow-sm border-b border-gray-200'>
    <div className='max-w-6xl mx-auto px-4 py-4 flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <div className='w-3 h-3 bg-blue-500 rounded-sm'></div>
        <h1
          className='text-xl font-bold text-gray-900'
          data-testid={TEST_IDS.smoke}
        >
          Комплектующие
        </h1>
      </div>

      <nav className='flex items-center gap-6'>
        <Link
          to={'#'}
          className='text-base font-medium text-gray-700 hover:text-gray-900 transition-colors'
        >
          Каталог
        </Link>

        <Link
          to={'#'}
          className='text-base font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-1'
        >
          Корзина
          <span className='bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
            2
          </span>
        </Link>

        <Link
          to={ROUTES.SIGNUP}
          className='text-base font-medium text-gray-700 hover:text-gray-900 transition-colors'
        >
          Вход
        </Link>

        <Link
          to={ROUTES.SIGNIN}
          className='bg-blue-500 px-4 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition-colors'
        >
          Регистрация
        </Link>
      </nav>
    </div>
  </header>
);
