import { useAuth } from '@/entities/auth';
import { OrderItem } from './order-item';
import { ROUTES } from '@/shared/constants/routes';
import { Link } from 'react-router-dom';
import { TEST_IDS } from '@/shared/constants/testids';
import { Loader } from '@/shared/ui/loader';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../api/ordersApi';

export const CabinetPage = () => {
  const { user } = useAuth();
  const { data, isLoading, isError } = useQuery(
    ordersApi.getOrdersOptionsQuery(),
  );

  const orders = data?.items || [];

  if (isLoading) {
    return (
      <div className='px-4 py-8 mx-auto w-full max-w-6xl flex justify-center'>
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='px-4 py-8 mx-auto w-full max-w-6xl text-center text-red-500'>
        Не удалось загрузить заказы. Попробуйте обновить страницу.
      </div>
    );
  }

  return (
    <div className='px-4 py-8 mx-auto w-full max-w-6xl flex flex-col gap-6'>
      <div className='flex flex-col gap-1'>
        <h1 className='text-3xl font-bold text-gray-900'>Личный кабинет</h1>
        <p className='text-sm text-gray-400'>{user?.email}</p>
      </div>

      <div
        className='flex flex-col gap-6'
        data-testid={TEST_IDS.account.orders}
      >
        {orders.length === 0 ? (
          <div
            className='text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300'
            data-testid={TEST_IDS.account.ordersEmpty}
          >
            Заказов пока нет
          </div>
        ) : (
          orders.map((order) => <OrderItem key={order.id} order={order} />)
        )}
      </div>

      <Link
        to={ROUTES.CATALOG}
        className='text-sm text-gray-400 hover:text-gray-600 self-start'
      >
        Продолжить покупки
      </Link>
    </div>
  );
};
