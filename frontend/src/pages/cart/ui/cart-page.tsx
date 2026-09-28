import { useCart } from '@/feature/add-to-cart';
import { CartTotal } from './total';
import { ItemCard } from './item-card';
import { EmptyState } from '@/shared/ui/empty-placeholder';
export const CartPage = () => {
  const { cart, getTotalItems, isEmpty } = useCart();

  const totalItems = getTotalItems();

  const totalPrice = 1000 * totalItems;

  if (isEmpty()) {
    return (
      <EmptyState
        title='Корзина пуста'
        description='Перейдите в каталог чтобы добавить товары'
      />
    );
  }

  return (
    <div className='max-w-5xl mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold text-gray-900 mb-6'>Корзина</h1>

      <div className='flex flex-col lg:flex-row gap-6'>
        <div className='flex-1 flex flex-col gap-4'>
          {Object.entries(cart).map(([productId, id]) => {
            if (!productId) return null;

            return (
              <ItemCard
                key={productId}
                productId={productId}
                name={'Name'}
                pricePerUnit={1000}
                imageUrl={''}
              />
            );
          })}
        </div>

        <CartTotal amount={totalItems} price={totalPrice} />
      </div>
    </div>
  );
};
