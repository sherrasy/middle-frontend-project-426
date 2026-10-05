import { Order } from '@/entities/order';
import { TEST_IDS } from '@/shared/constants/testids';
import { formatDate, formatPrice } from '@/shared/lib/formatters';
import { Badge } from '@/shared/ui/badge';
import { KeyboardArrowDown } from '@material-symbols-svg/react/rounded/keyboard-arrow-down';
import { KeyboardArrowUp } from '@material-symbols-svg/react/rounded/keyboard-arrow-up';

interface OrderItemProps {
  order: Order;
  isExpanded: boolean;
  handleExpand: (id: number) => void;
}
export const OrderItem = ({
  order,
  isExpanded,
  handleExpand,
}: OrderItemProps) => {
  const total = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div
      className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 w-full'
      data-testid={TEST_IDS.account.orderItem}
    >
      <div className='flex flex-col gap-4'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='flex items-center gap-3'>
            <h2 className='text-lg font-bold text-gray-900'>
              Заказ №{order.id}
            </h2>
            <Badge
              variant='success'
              data-testid={TEST_IDS.order.status}
              data-status='paid'
            >
              ОПЛАЧЕНО
            </Badge>
            <span className='text-sm text-gray-400'>
              {formatDate(order.createdAt)}
            </span>{' '}
          </div>

          <button
            type='button'
            onClick={() => handleExpand(order.id)}
            data-testid={TEST_IDS.account.orderToggle}
            className='text-sm text-blue-600 hover:text-blue-800 font-medium'
          >
            {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </button>
        </div>

        {isExpanded && (
          <div className='mt-2'>
            <div className='grid grid-cols-12 gap-4 pb-3 border-b border-gray-200 text-sm font-semibold text-gray-700'>
              <div className='col-span-6'>Товар</div>
              <div className='col-span-2 text-center'>Кол-во</div>
              <div className='col-span-2 text-right'>Цена покупки</div>
              <div className='col-span-2 text-right'>Сумма</div>
            </div>

            <div className='py-4 space-y-3'>
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className='grid grid-cols-12 gap-4 py-2 text-sm text-gray-800 items-center'
                  data-testid={TEST_IDS.account.orderLine}
                >
                  <div className='col-span-6 font-medium'>
                    {item.productName}
                  </div>
                  <div
                    className='col-span-2 text-center'
                    data-testid={TEST_IDS.account.orderLineQty}
                  >
                    {item.quantity}
                  </div>
                  <div
                    className='col-span-2 text-right'
                    data-testid={TEST_IDS.account.orderLinePrice}
                  >
                    {formatPrice(item.price)}
                  </div>
                  <div className='col-span-2 text-right font-semibold'>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className='border-t border-gray-200 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
              <div className='text-sm text-gray-500'>
                {order.deliveryMethod === 'delivery' ? 'Доставка' : 'Самовывоз'}
                :
                {order.deliveryMethod === 'delivery' &&
                  ` ${order.deliveryAddress} ·`}{' '}
                {order.recipientName}, {order.recipientPhone}
              </div>
              <div
                className='text-lg font-bold text-gray-900'
                data-testid={TEST_IDS.order.total}
              >
                Итого: {formatPrice(total)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
