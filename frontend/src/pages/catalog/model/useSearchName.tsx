import { useEffect, useState } from 'react';
import { useDebounce } from './useDebounce';
import { components } from '@/shared/types/api-schema';

type CatalogQuery = components['schemas']['CatalogQuery'];

interface UseSearchItemNameProps {
  setFilter: (
    key: keyof CatalogQuery,
    value: string | number | boolean | undefined,
  ) => void;
  searchData?: string;
}

export const useSearchItemName = ({
  setFilter,
  searchData,
}: UseSearchItemNameProps) => {
  const [searchInput, setSearchInput] = useState(searchData || '');

  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    const normalizedDebounced =
      debouncedSearch === '' ? undefined : debouncedSearch;
    const currentFilterSearch = searchData;

    if (normalizedDebounced !== currentFilterSearch) {
      setFilter('search', normalizedDebounced);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, searchData]);

  return {
    searchInput,
    setSearchInput,
  };
};
