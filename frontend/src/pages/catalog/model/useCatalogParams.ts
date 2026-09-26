import type { components } from '@/shared/types/api-schema';
import { useSearchParams } from 'react-router-dom';

type CatalogQuery = components['schemas']['CatalogQuery'];

export const useCatalogParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: CatalogQuery = {
    page: Number(searchParams.get('page')) || 1,
    categoryId: searchParams.get('categoryId')
      ? Number(searchParams.get('categoryId'))
      : undefined,
    priceFrom: searchParams.get('priceFrom')
      ? Number(searchParams.get('priceFrom'))
      : undefined,
    priceTo: searchParams.get('priceTo')
      ? Number(searchParams.get('priceTo'))
      : undefined,
    onlyAvailable: searchParams.get('onlyAvailable') === 'true',
    search: searchParams.get('search') || undefined,
  };

  const setPage = (page: number) => {
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set('page', String(page));
        return newParams;
      },
      { replace: false },
    );
  };

  const setFilter = (
    key: keyof CatalogQuery,
    value: string | number | boolean | undefined,
  ) => {
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev);

        if (value === undefined || value === '' || value === false) {
          newParams.delete(key as string);
        } else {
          newParams.set(key as string, String(value));
        }

        if (key !== 'page') {
          newParams.set('page', '1');
        }

        return newParams;
      },
      { replace: false },
    );
  };

  const resetFilters = () => {
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.delete('categoryId');
        newParams.delete('priceFrom');
        newParams.delete('priceTo');
        newParams.delete('onlyAvailable');
        newParams.delete('search');
        newParams.set('page', '1');
        return newParams;
      },
      { replace: false },
    );
  };

  return { filters, setFilter, setPage, resetFilters };
};
