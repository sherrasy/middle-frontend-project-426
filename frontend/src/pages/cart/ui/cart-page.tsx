import { EmptyState } from '@/shared/ui/empty-placeholder';
import { Loader } from '@/shared/ui/loader';
import { ItemCard } from './item-card';
import { CartTotal } from './total';
import { TEST_IDS } from '@/shared/constants/testids';
import { useCartProducts } from '@/feature/add-to-cart/model/useCartProducts';
import { useCart } from '@/feature/add-to-cart';

export const CartPage = () => {
  const { clearCart } = useCart();
  const { cartItems, totalPrice, totalItems, isEmptyCart, isLoading } =
    useCartProducts();

  if (isLoading && cartItems.length === 0) {
    return <Loader />;
  }

  return (
    <div className='px-4 py-8 mx-auto w-full max-w-6xl relative'>
      <h1 className='text-3xl font-bold text-gray-900 mb-6'>Корзина</h1>
      {!isEmptyCart && (
        <button
          className='text-red-500 hover:text-red-600  p-2 rounded-lg cursor-pointer transition-colors absolute top-13 right-2'
          onClick={() => clearCart()}
        >
          Очистить корзину
        </button>
      )}
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
