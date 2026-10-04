import { OrderItem } from '@/entities/order';
import { formatPrice } from '@/shared/lib/formatters';
import { Badge } from '@/shared/ui/badge';

interface OrderSuccessSummaryProps {
  items: OrderItem[];
}

export const OrderSuccessSummary = ({ items }: OrderSuccessSummaryProps) => {
  return (
    <div className='bg-white rounded-xl border border-gray-200 p-6 w-full max-w-2xl h-fit'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-base font-semibold text-gray-900'>Состав заказа</h2>
        <Badge variant='success'>ОПЛАЧЕН</Badge>
      </div>

      <div className='space-y-3'>
        {items.map((item) => (
          <div
            key={item.productId}
            className='flex justify-between items-center text-sm'
          >
            <span className='text-gray-900'>
              {item.productName} × {item.quantity}
            </span>
            <span className='font-semibold text-gray-900'>
              {formatPrice(item.price * item.quantity)} ₽
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
