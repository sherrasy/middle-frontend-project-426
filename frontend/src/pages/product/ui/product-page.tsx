import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { Loader } from '@/shared/ui/loader';
import { EmptyState } from '@/shared/ui/empty-placeholder';
import { ROUTES } from '@/shared/constants/routes';
import { ImagePlaceholder } from '@/shared/ui/image-placeholder';
import { AdditionalInfo } from './additionInfo';
import { Badge } from '@/shared/ui/badge';
import { AddToCartButton } from '@/shared/ui/addToCartButton';

export const ProductPage = () => {
  const { id } = useParams();
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    ...productApi.getProductQueryOptions(id ?? ''),
    enabled: !!id,
  });

  if (isLoading) return <Loader />;

  if (isError || !product) {
    return (
      <EmptyState
        title='Товар не найден'
        description='Вернитесь в каталог и попробуйте снова.'
      />
    );
  }

  const { name, description, price, isAccessible, image } = product;

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <nav className='mb-8 text-sm text-gray-500'>
        <Link to={ROUTES.CATALOG} className='hover:text-gray-700'>
          Каталог
        </Link>
        <span className='mx-2'>→</span>
        <span className='text-gray-700'>{name}</span>
      </nav>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
        <div className='relative bg-linear-to-br from-blue-50 to-indigo-50 aspect-square overflow-hidden border border-gray-200 rounded-lg'>
          {image ? (
            <img
              src={image}
              alt={name}
              className='w-full h-full object-cover'
            />
          ) : (
            <ImagePlaceholder />
          )}
        </div>

        <div>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>{name}</h1>

          <div className='mb-4'>
            <Badge variant={isAccessible ? 'success' : 'muted'}>
              {isAccessible ? 'В НАЛИЧИИ' : 'НЕТ В НАЛИЧИИ'}
            </Badge>
          </div>

          <p className='text-gray-700 mb-6'>{description}</p>

          <div className='bg-white border border-gray-200 rounded-lg p-6 mb-6'>
            <div className='text-3xl font-bold text-gray-900 mb-4'>
              {price?.toLocaleString('ru-RU')} ₽
            </div>
            <AddToCartButton isAccessible={isAccessible} onClick={() => {}} />
          </div>

          <AdditionalInfo />
        </div>
      </div>
    </div>
  );
};
