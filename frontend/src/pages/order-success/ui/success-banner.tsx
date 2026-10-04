import { Order } from '@/entities/order';
import { formatDate } from '@/shared/lib/formatters';
import { CheckSmall } from '@material-symbols-svg/react/rounded/check-small';

interface OrderSuccessBannerProps {
  order: Order;
}

export const OrderSuccessBanner = ({ order }: OrderSuccessBannerProps) => {
  const { deliveryAddress, deliveryMethod, id, createdAt } = order;
  const dateTime = formatDate(createdAt);

  return (
    <div className='bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex items-baseline gap-4 w-full mb-6  justify-start'>
      <div className='shrink-0 w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center'>
        <CheckSmall />
      </div>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>
          Заказ №{id} оформлен
        </h1>
        <p className='text-gray-500 mt-1'>
          {dateTime}
          {deliveryMethod === 'delivery' &&
            ` · доставка на адрес: ${deliveryAddress}`}
        </p>
      </div>
    </div>
  );
};
