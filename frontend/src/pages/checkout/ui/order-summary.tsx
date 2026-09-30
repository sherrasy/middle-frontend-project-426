import { formatPrice } from '@/shared/lib/formatters';

interface OrderSummaryProps {
  items: { name: string; quantity: number; price: number }[];
  total: number;
}

export const OrderSummary = ({ items, total }: OrderSummaryProps) => {
  return (
    <div className='bg-white rounded-xl border border-gray-200 p-6'>
      <h2 className='text-lg font-semibold text-gray-900 pb-4 border-b border-gray-200'>
        Состав заказа
      </h2>

      <div className='py-4 space-y-3'>
        {items.map((item, idx) => (
          <div
            key={idx}
            className='flex justify-between items-start text-gray-900'
          >
            <span>
              {item.name} × {item.quantity}
            </span>
            <span className='font-medium whitespace-nowrap ml-4'>
              {formatPrice(item.price)}
            </span>
          </div>
        ))}
      </div>

      <div className='border-t border-gray-200 pt-4 flex justify-between items-center'>
        <span className='text-gray-500'>Предварительный итог</span>
        <span className='text-xl font-bold text-gray-900'>
          {formatPrice(total)}
        </span>
      </div>

      <p className='mt-3 text-xs text-gray-400'>
        Окончательную сумму посчитает сервер по актуальным ценам товаров.
      </p>
    </div>
  );
};
