import { TEST_IDS } from '@/shared/constants/testids';
import { EmptyState } from '@/shared/ui/empty-placeholder';
import { Loader } from '@/shared/ui/loader';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/productsApi';
import { useCatalogParams } from '../model/useCatalogParams';
import { CatalogErrorMessage } from './common/error-message';
import { CatalogHeader } from './common/header';
import { Pagination } from './common/pagination';
import { CatalogFilters } from './filters';
import { ProductCard } from './product-card';
//TODO: вынести сообщения в конст, переиспользовать типы и константы
export const CatalogPage = () => {
  const { filters, setFilter, setPage, resetFilters } = useCatalogParams();

  const { data, isLoading, isError } = useQuery({
    ...productsApi.getProductsOptionsQuery(filters),
  });

  const handlePageChange = (page: number) => {
    setPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isError) {
    return <CatalogErrorMessage />;
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='flex flex-col lg:flex-row gap-8'>
        <aside className='lg:w-72 shrink-0'>
          <div className='sticky top-24'>
            <CatalogFilters
              filters={filters}
              setFilter={setFilter}
              resetFilters={resetFilters}
            />
          </div>
        </aside>

        <div className='flex-1 min-w-0'>
          <CatalogHeader total={data?.total ?? 0} />
          {isLoading ? (
            <Loader />
          ) : data?.items.length === 0 ? (
            <EmptyState
              title='Товары не найдены'
              description='Попробуйте изменить параметры фильтрации или сбросить их, чтобы увидеть весь каталог.'
              onReset={resetFilters}
              testId={TEST_IDS.catalog.empty}
            />
          ) : (
            <>
              <div
                className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                data-testid={TEST_IDS.catalog.list}
              >
                {data?.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {data && data.totalPages > 1 && (
                <Pagination
                  currentPage={data.page}
                  totalPages={data.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
