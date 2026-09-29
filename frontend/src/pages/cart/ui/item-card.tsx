import { useCart } from '@/feature/add-to-cart';

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

  if (quantity === 0) return null;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQty = parseInt(e.target.value, 10);
    if (!isNaN(newQty) && newQty >= 1) {
      updateQuantity(productId, newQty);
    }
  };

  const handleRemove = () => {
    removeFromCart(productId);
  };

  if (!isAccessible) {
    return (
      <div className='bg-gray-50 border border-gray-300 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 opacity-60'>
        <div className='w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shrink-0'>
          {imageUrl && (
            <img
              src={imageUrl}
              alt={name}
              className='w-full h-full object-contain p-2 grayscale'
            />
          )}
        </div>

        <div className='flex-1 min-w-0'>
          <h2 className='text-lg font-semibold text-gray-500'>{name}</h2>
          <p className='text-sm text-red-500 mt-1 font-medium'>
            Товар недоступен для заказа
          </p>
        </div>

        <button
          onClick={handleRemove}
          className='shrink-0 text-red-500 hover:text-red-700 font-medium text-sm transition-colors'
        >
          Удалить
        </button>
      </div>
    );
  }

  return (
    <div className='bg-white border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4'>
      <div className='w-24 h-24 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0'>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={name}
            className='w-full h-full object-contain p-2'
          />
        )}
      </div>

      <div className='flex-1 min-w-0'>
        <h2 className='text-lg font-semibold text-gray-900'>{name}</h2>
        <p className='text-sm text-gray-500 mt-1'>
          {pricePerUnit.toLocaleString('ru-RU')} ₽ за штуку
        </p>
      </div>

      <div className='shrink-0'>
        <input
          type='number'
          value={quantity}
          min={1}
          onChange={handleQuantityChange}
          className='w-20 h-10 border border-gray-300 rounded-lg px-3 text-center text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent'
        />
      </div>

      <div className='shrink-0 text-lg font-semibold text-gray-900 w-28 text-right'>
        {totalPrice.toLocaleString('ru-RU')} ₽
      </div>

      <button
        onClick={handleRemove}
        className='shrink-0 text-red-500 hover:text-red-700 font-medium text-sm transition-colors hover:cursor-pointer'
      >
        Удалить
      </button>
    </div>
  );
};
