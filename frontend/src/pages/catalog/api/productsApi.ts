import { api } from '@/shared/config/axiosApi';
import type { components } from '@/shared/types/api-schema';
import { queryOptions } from '@tanstack/react-query';

export const productsApi = {
  baseKey: 'products',

  getProducts: async (
    params: components['schemas']['CatalogQuery'],
    signal?: AbortSignal,
  ) => {
    const response = await api.get<components['schemas']['ProductList']>(
      '/catalog/products',
      { params, signal },
    );
    return response.data;
  },

  getProductsOptionsQuery: (filters: components['schemas']['CatalogQuery']) => {
    return queryOptions({
      queryKey: [productsApi.baseKey, filters],
      queryFn: ({ signal }) => productsApi.getProducts(filters, signal),
    });
  },
};
