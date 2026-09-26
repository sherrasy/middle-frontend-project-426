import { ROUTES } from '@/shared/constants/routes';
import { Link } from 'react-router-dom';

export const HomeHeader = () => {
  return (
    <div className='mb-6 flex flex-col gap-2'>
      <h2 className='text-2xl font-bold text-gray-900'>
        Комплектующие для ПК с доставкой по городу
      </h2>
      <p className='text-md text-gray-500 mt-1 w-160 '>
        Видеокарты, процессоры и материнские платы в наличии. Собираем подборки
        под задачу, чтобы не выбирать из всего каталога сразу.
      </p>

      <Link
        to={ROUTES.CATALOG}
        className='bg-blue-500 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition-colors w-44'
      >
        Перейти в каталог
      </Link>
    </div>
  );
};
