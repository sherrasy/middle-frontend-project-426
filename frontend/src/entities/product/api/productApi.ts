import { api } from '@/shared/config/axiosApi';
import { components } from '@/shared/types/api-schema';
import { queryOptions } from '@tanstack/react-query';

export const productApi = {
  baseKey: 'product',

  getProduct: async (id: string) => {
    const response = await api.get<components['schemas']['Product']>(
      `/catalog/products/${id}`,
    );
    return response.data;
  },

  getProductQueryOptions: (id: string) => {
    return queryOptions({
      queryKey: [productApi.baseKey, id],
      queryFn: () => productApi.getProduct(id),
    });
  },
};
