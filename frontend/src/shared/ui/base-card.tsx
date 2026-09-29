import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { ReactNode } from 'react';
import { ImagePlaceholder } from './image-placeholder';
import { components } from '../types/api-schema';
import { formatPrice } from '../lib/formatters';

type Product = components['schemas']['Product'];
export interface BaseCardTestIds {
  root: string;
  title?: string;
  price?: string;
}
interface BaseCardProps {
  data: Product;
  title?: string;
  testIds: BaseCardTestIds;
  badge?: ReactNode;
  action?: ReactNode;
}

export const BaseCard = ({
  data,
  title,
  testIds,
  badge,
  action,
}: BaseCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`${ROUTES.CATALOG}/${data.id}`);
  };

  const displayTitle = title || data.name;

  return (
    <div
      className='bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full hover:cursor-pointer'
      data-testid={testIds.root}
      onClick={handleCardClick}
    >
      <div className='relative bg-linear-to-br from-blue-50 to-indigo-50 aspect-square overflow-hidden'>
        {data.image ? (
          <img
            src={data.image}
            alt={data.name}
            className='w-full h-full object-cover'
          />
        ) : (
          <ImagePlaceholder />
        )}
      </div>

      <div className='p-5 flex flex-col grow'>
        <h3
          className='font-semibold text-gray-900 text-lg mb-2 line-clamp-2'
          data-testid={testIds.title}
        >
          {displayTitle}
        </h3>

        <p className='text-sm text-gray-500 mb-4 line-clamp-2 grow'>
          {data.description}
        </p>

        <div className='flex items-center justify-between mb-4'>
          <span
            className='text-2xl font-bold text-gray-900'
            data-testid={testIds.price}
          >
            {formatPrice(data.price)}
          </span>
          {badge}
        </div>

        {action && <div onClick={(e) => e.stopPropagation()}>{action}</div>}
      </div>
    </div>
  );
};
