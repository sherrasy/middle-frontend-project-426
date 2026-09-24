import { PhotoCamera } from '@material-symbols-svg/react/photo-camera';

import type { components } from '@/shared/types/api-schema';
import { TEST_IDS } from '@/shared/constants/testids';

type Product = components['schemas']['Product'];

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { name, price, description, image, isAccessible } = product;

  return (
    <div
      className='bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full'
      data-testid={TEST_IDS.catalog.item}
    >
      <div className='relative bg-linear-to-br from-blue-50 to-indigo-50 aspect-square overflow-hidden'>
        {image ? (
          <img src={image} alt={name} className='w-full h-full object-cover' />
        ) : (
          <div className='w-full h-full flex flex-col items-center justify-center p-8'>
            <PhotoCamera />
            <span className='text-sm text-gray-400'>Нет изображения</span>
          </div>
        )}
      </div>

      <div className='p-5 flex flex-col grow'>
        <h3
          className='font-semibold text-gray-900 text-lg mb-2 line-clamp-2'
          data-testid={TEST_IDS.catalog.itemName}
        >
          {name}
        </h3>

        <p className='text-sm text-gray-500 mb-4 line-clamp-2 grow'>
          {description}
        </p>

        <div className='flex items-center justify-between mb-4'>
          <span
            className='text-2xl font-bold text-gray-900'
            data-testid={TEST_IDS.catalog.itemPrice}
          >
            {price} ₽
          </span>
          <span
            className={`px-3 py-1 rounded-md text-xs font-semibold ${
              isAccessible
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-400 text-white'
            }`}
            data-testid={TEST_IDS.catalog.itemAvailability}
            data-availabile={isAccessible}
          >
            {isAccessible ? 'В НАЛИЧИИ' : 'НЕТ В НАЛИЧИИ'}
          </span>
        </div>

        <button
          type='button'
          disabled={!isAccessible}
          className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
            isAccessible
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          В корзину
        </button>
      </div>
    </div>
  );
};
