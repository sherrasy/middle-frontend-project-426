import { EmptyState } from '@/shared/ui/empty-placeholder';
import { Loader } from '@/shared/ui/loader';
import { ItemCard } from './item-card';
import { CartTotal } from './total';
import { TEST_IDS } from '@/shared/constants/testids';
import { useCartProducts } from '@/feature/add-to-cart/model/useCartProducts';

export const CartPage = () => {
  const { cartItems, totalPrice, totalItems, isEmptyCart, isLoading } =
    useCartProducts();

  if (isLoading && cartItems.length === 0) {
    return <Loader />;
  }

  return (
    <div className='px-4 py-8 mx-auto w-svw max-w-6xl'>
      <h1 className='text-3xl font-bold text-gray-900 mb-6'>Корзина</h1>

      <div className='flex flex-col lg:flex-row gap-6'>
        {isEmptyCart ? (
          <EmptyState
            title='Корзина пуста'
            description='Перейдите в каталог чтобы добавить товары'
            classname='flex-1 max-w-250'
            testId={TEST_IDS.cart.empty}
          />
        ) : (
          <div className='flex-1 flex flex-col gap-4'>
            {cartItems.map((cartItem) => {
              const { productId, product, isError } = cartItem;

              if (isError || !product) {
                return null;
              }

              return (
                <ItemCard
                  key={productId}
                  productId={productId}
                  name={product.name}
                  pricePerUnit={product.price}
                  imageUrl={product.image}
                  isAccessible={product.isAccessible}
                />
              );
            })}
          </div>
        )}

        <CartTotal amount={totalItems} price={totalPrice} />
      </div>
    </div>
  );
};
