import { api } from '@/shared/config/axiosApi';
import type { components } from '@/shared/types/api-schema';
import { queryOptions } from '@tanstack/react-query';

export const ordersApi = {
  baseKey: 'orders',

  getOrders: async () => {
    const response =
      await api.get<components['schemas']['OrderList']>('/orders');
    return response.data;
  },

  getOrdersOptionsQuery: () => {
    return queryOptions({
      queryKey: [ordersApi.baseKey],
      queryFn: () => ordersApi.getOrders(),
    });
  },
};
