import { TEST_IDS } from '@/shared/constants/testids';
import type { components } from '@/shared/types/api-schema';
import { useQuery } from '@tanstack/react-query';
import { SyntheticEvent } from 'react';
import { categoriesApi } from '../api/categoriesApi';
import { useSearchItemName } from '../model/useSearchName';
import { FormField } from './common/formField';

type CatalogQuery = components['schemas']['CatalogQuery'];

interface CatalogFiltersProps {
  filters: CatalogQuery;
  setFilter: (
    key: keyof CatalogQuery,
    value: string | number | boolean | undefined,
  ) => void;
  resetFilters: () => void;
}

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all';

export const CatalogFilters = ({
  filters,
  setFilter,
  resetFilters,
}: CatalogFiltersProps) => {
  const { data: categories, isLoading } = useQuery({
    ...categoriesApi.getCategoriesQueryOptions(),
  });
  const { searchInput, setSearchInput } = useSearchItemName({
    setFilter,
    searchData: filters.search,
  });

  const handleSearchInput = (e: SyntheticEvent<HTMLInputElement>) => {
    setSearchInput(e.currentTarget.value);
  };

  return (
    <div
      className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6'
      data-testid={TEST_IDS.catalog.filters}
    >
      <FormField label='Категория' htmlFor={'filter-category'}>
        <select
          id={'filter-category'}
          value={filters.categoryId || ''}
          onChange={(e) =>
            setFilter(
              'categoryId',
              e.target.value ? Number(e.target.value) : undefined,
            )
          }
          data-testid={TEST_IDS.filter.category}
          className={`${inputClass} cursor-pointer`}
        >
          <option value=''>Все категории</option>
          {isLoading ? (
            <option disabled>Загрузка...</option>
          ) : (
            categories?.map((cat) => (
              <option key={cat.id} value={cat.id} className='cursor-pointer'>
                {cat.name}
              </option>
            ))
          )}
        </select>
      </FormField>

      <FormField label='Название' htmlFor={'filter-search'}>
        <input
          id={'filter-search'}
          type='text'
          value={searchInput}
          onChange={handleSearchInput}
          placeholder='Например, RTX'
          data-testid={TEST_IDS.filter.search}
          className={inputClass}
        />
      </FormField>

      <div className='grid grid-cols-2 gap-3'>
        <FormField label='От, ₽' htmlFor={'filter-priceMin'}>
          <input
            id={'filter-priceMin'}
            type='number'
            min='0'
            value={filters.priceFrom || ''}
            onChange={(e) =>
              setFilter(
                'priceFrom',
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
            data-testid={TEST_IDS.filter.priceMin}
            className={inputClass}
          />
        </FormField>

        <FormField label='До, ₽' htmlFor={'filter-priceMax'}>
          <input
            id={'filter-priceMax'}
            type='number'
            min='0'
            value={filters.priceTo || ''}
            onChange={(e) =>
              setFilter(
                'priceTo',
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
            data-testid={TEST_IDS.filter.priceMax}
            className={inputClass}
          />
        </FormField>
      </div>

      <div className='flex items-center'>
        <input
          type='checkbox'
          id='onlyAvailable'
          checked={filters.onlyAvailable || false}
          onChange={(e) => setFilter('onlyAvailable', e.target.checked)}
          className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer'
          data-testid={TEST_IDS.filter.available}
        />
        <label
          htmlFor='onlyAvailable'
          className='ml-2 text-sm text-gray-700 cursor-pointer select-none'
        >
          Только в наличии
        </label>
      </div>

      <button
        type='button'
        onClick={resetFilters}
        data-testid={TEST_IDS.filter.reset}
        className='w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer'
      >
        Сбросить фильтры
      </button>
    </div>
  );
};
