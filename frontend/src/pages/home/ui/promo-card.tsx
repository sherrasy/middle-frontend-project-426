import { PhotoCamera } from '@material-symbols-svg/react/photo-camera';

import type { components } from '@/shared/types/api-schema';
import { TEST_IDS } from '@/shared/constants/testids';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';

type PromoItem = components['schemas']['PromoBlock'];

interface PromoItemCardProps {
  promoItem: PromoItem;
}
//TODO: вынести дублирующийся код карточек в shared, плейсхолдер пустого фото

export const PromoItemCard = ({ promoItem }: PromoItemCardProps) => {
  const { title, description, product } = promoItem;
  const navigate = useNavigate();
  const handeOpenProduct = () => navigate(`${ROUTES.CATALOG}/${product.id}`);
  return (
    <div
      className='bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full  hover:cursor-pointer'
      data-testid={TEST_IDS.home.item}
      onClick={handeOpenProduct}
    >
      <div className='relative bg-linear-to-br from-blue-50 to-indigo-50 aspect-square overflow-hidden'>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className='w-full h-full object-cover'
          />
        ) : (
          <div className='w-full h-full flex flex-col items-center justify-center p-8'>
            <PhotoCamera />
            <span className='text-sm text-gray-400'>Нет изображения</span>
          </div>
        )}
      </div>

      <div className='p-5 flex flex-col grow'>
        <h3 className='font-semibold text-gray-900 text-lg mb-2 line-clamp-2'>
          {title}
        </h3>

        <p className='text-sm text-gray-500 mb-4 line-clamp-2 grow'>
          {description}
        </p>

        <div className='flex items-center justify-between mb-4'>
          <span className='text-2xl font-bold text-gray-900'>
            {product.price.toLocaleString('Ru-ru')} ₽
          </span>
          <span
            className={`px-3 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-7
           `}
          >
            {product.name.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};
