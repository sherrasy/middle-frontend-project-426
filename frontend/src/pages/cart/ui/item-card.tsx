import { useCart } from '@/feature/add-to-cart';
import { TEST_IDS } from '@/shared/constants/testids';
import { formatPrice } from '@/shared/lib/formatters';

interface ItemCardProps {
  productId: string | number;
  name: string;
  pricePerUnit: number;
  imageUrl: string | null;
  isAccessible: boolean;
}

export const ItemCard = ({
  productId,
  name,
  pricePerUnit,
  imageUrl,
  isAccessible = true,
}: ItemCardProps) => {
  const { getItemQuantity, updateQuantity, removeFromCart } = useCart();

  const quantity = getItemQuantity(productId);
  const totalPrice = quantity * pricePerUnit;

  if (quantity === 0 && isAccessible) return null;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQty = parseInt(e.target.value, 10);
    if (!isNaN(newQty) && newQty >= 1) {
      updateQuantity(productId, newQty);
    }
  };

  const handleRemove = () => {
    removeFromCart(productId);
  };

  const styles = {
    wrapper: isAccessible
      ? 'bg-white border-gray-200'
      : 'bg-gray-50 border-gray-300 opacity-60',
    imageBox: isAccessible ? 'bg-indigo-50' : 'bg-gray-200',
    image: isAccessible ? '' : 'grayscale',
    title: isAccessible ? 'text-gray-900' : 'text-gray-500',
    subtitle: isAccessible ? 'text-gray-500' : 'text-red-500 font-medium',
  };

  return (
    <div
      className={`border rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 ${styles.wrapper}`}
      data-testid={TEST_IDS.cart.item}
    >
      <div
        className={`w-24 h-24 rounded-lg flex items-center justify-center shrink-0 ${styles.imageBox}`}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={name}
            className={`w-full h-full object-contain p-2 ${styles.image}`}
          />
        )}
      </div>

      <div className='flex-1 min-w-0'>
        <h2 className={`text-lg font-semibold ${styles.title}`}>{name}</h2>
        <p className={`text-sm mt-1 ${styles.subtitle}`}>
          {isAccessible
            ? `${formatPrice(pricePerUnit)} за штуку`
            : 'Товар недоступен для заказа'}
        </p>
      </div>

      {isAccessible && (
        <>
          <div className='shrink-0'>
            <input
              data-testid={TEST_IDS.cart.itemQty}
              type='number'
              value={quantity}
              min={1}
              onChange={handleQuantityChange}
              className='w-20 h-10 border border-gray-300 rounded-lg px-3 text-center text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shrink-0'
            />
          </div>

          <div className='shrink-0 text-lg font-semibold text-gray-900 w-28 text-right min-w-0'>
            {formatPrice(totalPrice)}
          </div>
        </>
      )}

      <button
        onClick={handleRemove}
        data-testid={TEST_IDS.cart.itemRemove}
        className='shrink-0 text-red-500 hover:text-red-700 font-medium text-sm transition-colors hover:cursor-pointer'
      >
        Удалить
      </button>
    </div>
  );
};
