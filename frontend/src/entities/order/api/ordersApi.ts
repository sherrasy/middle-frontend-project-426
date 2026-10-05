import { api } from '@/shared/config/axiosApi';
import { queryOptions } from '@tanstack/react-query';
import { Order, OrderList } from '../model/types';

export const ordersApi = {
  baseKey: 'orders',

  getOrders: async () => {
    const response = await api.get<OrderList>('/orders');
    return response.data;
  },

  getOrder: async (id: number) => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  getOrdersOptionsQuery: () => {
    return queryOptions({
      queryKey: [ordersApi.baseKey, 'list'],
      queryFn: () => ordersApi.getOrders(),
    });
  },

  getOrderOptionsQuery: (id: number) => {
    return queryOptions({
      queryKey: [ordersApi.baseKey, id],
      queryFn: () => ordersApi.getOrder(id),
      enabled: !!id,
    });
  },
};
