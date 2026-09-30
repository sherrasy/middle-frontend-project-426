import { useAuth } from '@/entities/auth';
// import { OrderItem } from './order-item';
import { ROUTES } from '@/shared/constants/routes';
import { Link } from 'react-router-dom';
import { components } from '@/shared/types/api-schema';

export type Order = components['schemas']['Order'];

export const CabinetPage = () => {
  const { user } = useAuth();
  return (
    <div className='px-4 py-8 mx-auto w-svw max-w-6xl flex flex-col gap-2'>
      <div className='mb-6 flex flex-col gap-2'>
        <h1 className='text-3xl font-bold text-gray-900 '>Личный кабинет</h1>
        <p className='text-md text-gray-500  w-160 '>{user?.email}</p>
      </div>

      <div className='flex flex-col gap-6'>
        {/* <OrderItem order={order} /> */}
      </div>

      <Link to={ROUTES.CATALOG} className='text-md text-gray-500'>
        Продолжить покупки
      </Link>
    </div>
  );
};
