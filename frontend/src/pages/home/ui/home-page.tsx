import { useQuery } from '@tanstack/react-query';
import { promoApi } from '../api/promoApi';
import { Loader } from '@/shared/ui/loader';
import { TEST_IDS } from '@/shared/constants/testids';
import { HomeHeader } from './header';
import { PromoItemCard } from './promo-card';

export const HomePage = () => {
  const { data, isPending, isError } = useQuery({
    ...promoApi.getPromoOptionsQuery(),
  });

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <HomeHeader />

      {isPending ? (
        <Loader />
      ) : isError || !data?.length ? null : (
        <>
          <h3 className='text-l font-bold text-gray-900 my-2'>
            Выбор магазина
          </h3>
          <div
            className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
            data-testid={TEST_IDS.home.list}
          >
            {data.map((item) => (
              <PromoItemCard key={item.id} promoItem={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
