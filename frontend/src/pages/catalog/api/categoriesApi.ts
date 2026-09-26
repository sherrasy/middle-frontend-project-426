import { api } from '@/shared/config/axiosApi';
import type { components } from '@/shared/types/api-schema';
import { queryOptions } from '@tanstack/react-query';

export const categoriesApi = {
  baseKey: 'categories',

  getCategories: async () => {
    const response = await api.get<components['schemas']['Category'][]>(
      '/catalog/categories',
    );
    return response.data;
  },

  getCategoriesQueryOptions: () => {
    return queryOptions({
      queryKey: [categoriesApi.baseKey],
      queryFn: categoriesApi.getCategories,
    });
  },
};
