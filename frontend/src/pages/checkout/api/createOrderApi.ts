import { CreateOrderRequest, Order } from '@/entities/order';
import { api } from '@/shared/config/axiosApi';

export const createOrder = async (data: CreateOrderRequest) => {
  const response = await api.post<Order>('/orders', data);
  return response.data;
};
