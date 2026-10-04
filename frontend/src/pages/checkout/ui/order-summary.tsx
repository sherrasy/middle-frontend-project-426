import { CartItem } from '@/feature/add-to-cart/model/useCartProducts';
import { formatPrice } from '@/shared/lib/formatters';

interface CheckoutSummaryProps {
  cartItems: CartItem[];
  total: number;
}

export const OrderSummary = ({ cartItems, total }: CheckoutSummaryProps) => {
  return (
    <div className='bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2'>
      <h2 className='text-base font-semibold text-gray-900 mb-4'>
        Состав заказа
      </h2>

      <div className='space-y-3'>
        {cartItems.map((item) => {
          if (!item.product) return null;
          return (
            <div
              key={item.productId}
              className={`flex justify-between items-center text-sm ${!item.product.isAccessible ? 'text-gray-400' : 'text-gray-900'}`}
            >
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span className='font-semibold'>
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </div>
          );
        })}
      </div>

      <div className='border-t border-gray-200 mt-4 pt-4'>
        <div className='flex justify-between items-center'>
          <span className='text-gray-500 text-sm'>Предварительный итог</span>
          <span className='text-base font-bold text-gray-900'>
            {formatPrice(total)}
          </span>
        </div>
        <p className='mt-2 text-xs text-gray-400'>
          Окончательную сумму посчитает сервер по актуальным ценам товаров.
        </p>
      </div>
    </div>
  );
};
