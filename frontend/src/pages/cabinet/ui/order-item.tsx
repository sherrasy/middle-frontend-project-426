import { formatPrice } from '@/shared/lib/formatters';
import { Badge } from '@/shared/ui/badge';
import { Order } from './cabinet-page';

export const OrderItem = ({ order }: { order: Order }) => {
  const total = order.items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-6xl'>
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <h2 className='text-lg font-bold text-gray-900'>Заказ №{order.id}</h2>
          <Badge variant='success'>ОПЛАЧЕНО</Badge>
          <span className='text-sm text-gray-400'>{order.createdAt}</span>
        </div>

        <div className='grid grid-cols-12 gap-4 pb-3 border-b border-gray-200 text-sm font-semibold text-gray-700'>
          <div className='col-span-6'>Товар</div>
          <div className='col-span-2 text-center'>Кол-во</div>
          <div className='col-span-2 text-right'>Цена покупки</div>
          <div className='col-span-2 text-right'>Сумма</div>
        </div>

        <div className='py-4'>
          {order.items.map((item, index) => (
            <div
              key={index}
              className='grid grid-cols-12 gap-4 py-3 text-sm text-gray-800'
            >
              <div className='col-span-6'>{item.productName}</div>
              <div className='col-span-2 text-center'>{item.quantity}</div>
              <div className='col-span-2 text-right'>
                {formatPrice(item.price)}
              </div>
              <div className='col-span-2 text-right'>
                {formatPrice(item.total)}
              </div>
            </div>
          ))}
        </div>

        <div className='border-t border-gray-200 pt-4 flex items-center justify-between'>
          <div className='text-sm text-gray-400'>
            Доставка: {order.deliveryAddress} · {order.recipientName},{' '}
            {order.recipientPhone}
          </div>
          <div className='text-lg font-bold text-gray-900'>
            Итого: {formatPrice(total)}
          </div>
        </div>
      </div>
    </div>
  );
};
